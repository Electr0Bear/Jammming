import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../Util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New playlist',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  //Проверяет находится ли трэк (track) в плейлисте. Метод find ищет трек по id в массиве плейлиста (playlistTracks). Если находится совпадение, то работа метода прекращается, если совпадений не найдено, то track добавляется к массиву, а массив сохраняется в this.state.playlistTracks
  addTrack(track) {
    let trackList = this.state.playlistTracks;
    if (trackList.find(savedTracks => savedTracks.id === track.id)) {
      return;
    }
    trackList.push(track);
    this.setState({playlistTracks: trackList});
  }

  //Метод filter находит все треки массива playlistTracks с id отличными от id выбранного трека (track). Результат фильтра сохраняется в переменную trackList, после чего сохраняет значение переменной в this.state.playlistTracks, таким образом ОТФИЛЬТРОВЫВАЯ (удаляя) track
  removeTrack(track) {
    let trackList = this.state.playlistTracks;
    trackList = trackList.filter(filterOutTrack => filterOutTrack.id !== track.id);
    this.setState({playlistTracks: trackList})
  }

  //обновляет наименование плейлиста: сохраняет в this.state принимаемое методом значение
  updatePlaylistName(playlistName) {
    this.setState({playlistName: playlistName});
  }

  //Отвечает за сохранение плейлистов с треками. Передаёт методу Spotify.savePlaylist данные о треках из this.state. После успешного завершения работы метода "сбрасывает" данные в this.state
  savePlaylist() {
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks).then(() =>
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    );

  }
  //Cохраняет в searchResults найденные треки
  search(searchTerm) {
    console.log(searchTerm);
    Spotify.search(searchTerm).then(tracks =>
      this.setState({ searchResults: tracks }));
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
