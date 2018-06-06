import React, { Component } from 'react';
import './App.css';
import Sound from 'react-sound';
import { DATA } from './assets/data';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      playStatus: Sound.status.STOPPED,
      playPosition: 0,
      loaded: false
    }

    this.playerTimeout = null;

    this.playSong = this.playSong.bind(this);
    this.handlePlaySound = this.handlePlaySound.bind(this);
    this.handleSongLoaded = this.handleSongLoaded.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
  }

  playSong() {
    this.setState({
      playStatus: Sound.status.PLAYING,
      playPosition: 0
    });
  }

  handlePlaySound(index) {
    const soundItem = DATA[index];

    window.clearInterval(this.playerTimeout); // reset timer

    this.setState({ // start playing
      playStatus: Sound.status.PLAYING,
      playPosition: soundItem.time,
    });

    this.playerTimeout = window.setTimeout(() => { // only play for the duration of the sound
      this.setState({
        playStatus: Sound.status.STOPPED,
        playPosition: 0
      });
    }, soundItem.duration);
  }

  handleSongLoaded() {
    this.setState({ loaded: true })
    console.log('Loaded');
  }

  handleStopClick() {
    window.clearInterval(this.playerTimeout); // reset timer

    this.setState({
      playStatus: Sound.status.STOPPED,
      playPosition: 0
    });
  }

  render() {
    return (
      <div className="App">
        <h1 id="title">MC Carlos</h1>
        <div className="container">
          {DATA.map((item, i) => {
            return (
              <SoundTile
                key={"item-" + i}
                index={i}
                label={item.label}
                onClick={this.handlePlaySound}
              />
            )
          })}

          <SoundTile className="play-all-tile" onClick={this.playSong} label="Play Me All That Shit!"/>

          <Sound
            url={process.env.PUBLIC_URL + '/carlos.mp3'}
            playStatus={this.state.playStatus}
            onLoading={() => {}}
            autoLoad={true}
            playFromPosition={this.state.playPosition}
            onLoad={this.handleSongLoaded}
            onPause={() => console.log('Paused')}
            onResume={() => console.log('Resumed')}
            onStop={() => console.log('Stopped')}
            onFinishedPlaying={() => this.setState({ playStatus: Sound.status.STOPPED })}
          />
        </div>

        <button onClick={this.handleStopClick}>Stop Playback</button>
      </div>
    );
  }
}


function SoundTile(props) {
  return (
    <div className={props.className + " sound-tile"} onClick={() => { props.onClick(props.index) }}>
      <span>{props.label}</span>
    </div>
  );
}



export default App;
