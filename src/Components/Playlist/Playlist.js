import React from 'react';
import './Playlist.css';

import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
  constructor(props) {
    super(props)

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  //Сохраняет вводимое пользователем название плейлиста, которое передаётся в App.js и впоследствии сохраняется в this.state.playlistName
  handleNameChange(event) {
    this.props.onNameChange(event.target.value)
  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={'New Playlist'}
          onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}/>
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    );
  }
}

export default Playlist;
