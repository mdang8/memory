import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      keys: [],
      foundKeys: [],
      remainingKeys: [],
      displayLetters: {},
      currentMatchCharacter: '',
      currentMatchKey: '',
      allowClicks: true
    };

    this.channel.join()
        .receive('ok', this.gotView.bind(this))
        .receive('error', res => {
          console.log('Unable to join.', res);
        });
  }

  gotView(view) {
    if (!view.game.allowClicks) {
      this.setState(view.game);

      setTimeout(() => {
        this.channel.push('clear', {})
            .receive('ok', this.gotView.bind(this));
      }, 1000);
    } else {
      this.setState(view.game);
    }
  }

  // sends the guess to be evaluated
  sendGuess(guessKey) {
    this.channel.push('guess', { key: guessKey })
        .receive('ok', this.gotView.bind(this));
  }

  // resets the game by reinitialzing the letters and setting the other state properties to their
  // default values
  resetGame() {
    this.channel.push('reset', {})
        .receive('reset', this.gotView.bind(this));
  }

  render() {
    let tileList = _.map(this.state.keys, (key) => {
      return <Tile id={key} state={this.state}
                   guess={this.sendGuess.bind(this)} key={key} />;
    });

    // renders the tiles from the list
    return (
      <div className="container">
        <div className="container">
          <h5>Number of clicks: {this.state.numberClicks}</h5>
          <Button onClick={this.resetGame.bind(this)}>Reset</Button>
        </div>
        <div className="row">
          <div className="col-3">
            {tileList[0]}
          </div>
          <div className="col-3">
            {tileList[1]}
          </div>
          <div className="col-3">
            {tileList[2]}
          </div>
          <div className="col-3">
            {tileList[3]}
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            {tileList[4]}
          </div>
          <div className="col-3">
            {tileList[5]}
          </div>
          <div className="col-3">
            {tileList[6]}
          </div>
          <div className="col-3">
            {tileList[7]}
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            {tileList[8]}
          </div>
          <div className="col-3">
            {tileList[9]}
          </div>
          <div className="col-3">
            {tileList[10]}
          </div>
          <div className="col-3">
            {tileList[11]}
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            {tileList[12]}
          </div>
          <div className="col-3">
            {tileList[13]}
          </div>
          <div className="col-3">
            {tileList[14]}
          </div>
          <div className="col-3">
            {tileList[15]}
          </div>
        </div>
      </div>
    );
  }
}

function Tile(params) {
  function tileClick() {
    if (params.state.allowClicks && params.id !== params.state.currentMatchKey) {
      params.guess(params.id);
    }
  }

  let character = params.id in params.state.displayLetters ?
      params.state.displayLetters[params.id] : '';

  // determines display of the tile
  if (params.state.foundKeys.includes(params.id)) {
    return (
      <div className="tile matched" onClick={tileClick}><h2>{character}</h2></div>
    );
  } else if (params.id in params.state.displayLetters) {
    return (
      <div className="tile matching" onClick={tileClick}><h2>{character}</h2></div>
    );
  } else {
    return (
      <div className="tile na" onClick={tileClick}><h2>{'-'}</h2></div>
    );
  }
}
