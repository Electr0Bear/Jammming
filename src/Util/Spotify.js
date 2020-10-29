let accessToken;
//Здесь должен быть ID приложения
const clientId = '';
const redirectUri = 'http://localhost:3000/';

const Spotify = {
  //Метод для получения и проверки наличия токена доступа
  getAccessToken() {
    if (accessToken) {
      console.log(accessToken);
      return accessToken;
    }
    //Ищет ключ доступа в строке адреса страницы. Согласно документации Spotify необходимые данные хранятся в адресной строке. Используется метод .match() для поиска по строке
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    console.log(accessTokenMatch);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    console.log(expiresInMatch);
    //Проверяет удалось ли найти данные о ключе доступа и сроке его истечения. Если данные получены, то они сохраняются в переменные
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      //Очищает значение токена доступа после истечения срока его действия
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      //Если токен доступа отсутствует, то пользователь перенаправляется на страницу авторизации Spotify
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  //Делает запрос в Spotify треках
  search(searchTerm) {
    //Получает токен доступа
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` }

    //ЗАпрашивает данные о треках и конкертирует их в JSON
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers: headers })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        //Если ответ пуст, - возвращается пустой массив
        if (!jsonResponse.tracks) {
          return [];
        }
        //Если ответ содержит данные о треках, то возвращает объекты с данными треков
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
      });
  },

  //Сохраняет наименование плейлиста и имеющиеся в нём песни
  savePlaylist(playlistName, trackUris) {
    //Если наименование плейлиста И данные о песнях существуют, скрипт сохраняет их в аккаунте пользователя
    if (playlistName && trackUris.length) {
      //Получает токен доступа
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` }
      let userId;

      //Запрашивает у Spotify данные о User ID
      return fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
          userId = jsonResponse.id;
          //Используя User Id сохраняет плейлист с названием в аккаунте
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists `, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: playlistName })
          })
            //Конвертирует ответ в JSON и сохраняет из него Playlist ID
            .then(response => response.json())
            .then(jsonResponse => {
              let playlistID = jsonResponse.id;
              console.log(trackUris);
              console.log(playlistID);
              //Согласно документации Spotify используются uri треков. Создает массив с uri всех композиций
              const trackUrisReady = trackUris.map(trackUri => trackUri.uri);
              console.log(trackUrisReady);
              //Используя Playlist ID сохраняет в созданном плейлисте треки по их uri
              return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUrisReady })
              });
            });
        });
    }
    return;
  }
}

export default Spotify;
