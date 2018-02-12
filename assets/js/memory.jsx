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
      letters: [],
      currentMatchCharacter: '',
      currentMatchKey: '',
      allowClicks: true,
      numberFound: 0,
      numberClicks: 0,
    };

    this.channel.join()
        .receive('ok', this.gotView.bind(this))
        .receive('error', res => {
          console.log('Unable to join.', res);
        });
  }

  gotView(view) {
    console.log('New view', view);
    this.setState(view.game);
  }

  // sends the guess to be evaluated
  sendGuess(guessKey) {
    this.channel.push('guess', { key: guessKey, })
        .receive('ok', this.gotView.bind(this));
  }

  checkMatched(guessKey) {
    return this.state.letters[guessKey].matched;
  }

  findLetter(key) {
    let matchLetter = {};
    this.state.letters.forEach((x) => {
      if (x.key === key) {
        matchLetter = x;
      }
    });

    return(matchLetter);
  }

  guess(guessKey) {
    // exits function if clicks are currently not allowed
    if (!this.state.allowClicks) {
      return;
    }

    let matchLetter = this.findLetter(guessKey);

    let guessCharacter = matchLetter.character;
    let letters = this.state.letters;

    if (this.checkMatched(guessKey)) {
      console.log("Check matched");
      // resets current letter being matched
      this.setState({
        letters,
        currentMatchCharacter: '',
        currentMatchKey: '',
      });
      return;
    }

    if (this.state.currentMatchCharacter === '' && this.state.currentMatchKey === '') {
      matchLetter.currentlyMatching = true;

      this.setState({
        letters,
        currentMatchCharacter: guessCharacter,
        currentMatchKey: guessKey,
        numberClicks: ++this.state.numberClicks,
      });

      return;
    } else {
      // checks if the letter is currently being matched (found letter pair)
      if (guessCharacter === this.state.currentMatchCharacter && guessKey !== this.state.currentMatchKey) {
        // sets the found letters as "matched"
        letters.forEach((letter) => {
          if (letter.character === guessCharacter) {
            letter.matched = true;
          }
        });

        // resets state with incremented number of matches found
        this.setState({
          letters,
          currentMatchCharacter: '',
          currentMatchKey: '',
          allowClicks: true,
          numberFound: ++this.state.numberFound,
          numberClicks: ++this.state.numberClicks,
        });

      } else {
        matchLetter.currentlyMatching = true;
        // resets state with clicks not allowed
        this.setState({
          letters,
          allowClicks: false,
          numberClicks: ++this.state.numberClicks,
        });

        // sets a one second delay after choosing an incorrect pair
        setTimeout(() => {
          // resets the currently matching status
          letters.forEach((letter) => {
            letter.currentlyMatching = false;
          });

          // resets state with clicks allowed
          this.setState({
            letters,
            currentMatchCharacter: '',
            currentMatchKey: '',
            allowClicks: true,
          });
        }, 1000);
      }
    }

    // displays winner message and resets game
    if (this.state.numberFound === 8) {
      alert('You are a winner!');
      this.resetGame();
    }
  }

  // resets the game by reinitialzing the letters and setting the other state properties to their default values
  resetGame() {
    this.channel.push('reset', {})
        .receive('reset', this.gotView.bind(this));
  }

  render() {
    let tileList = _.map(this.state.letters, (letter, i) => {
      let id = this.state.letters[i].key;
      return <Tile letter={letter} guess={this.guess.bind(this)} key={id} id={id} />;
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
    params.guess(params.id);
  }

  let letter = params.letter;

  // determines display of the tile
  if (letter.matched) {
    return (
      <div className="tile matched" onClick={tileClick}><h2>{params.letter.character}</h2></div>
    );
  } else if (letter.currentlyMatching) {
    return (
      <div className="tile matching" onClick={tileClick}><h2>{params.letter.character}</h2></div>
    );
  } else {
    return (
      <div className="tile na" onClick={tileClick}><h2>{'-'}</h2></div>
    );
  }
}
