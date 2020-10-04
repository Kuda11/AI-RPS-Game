
import React, { Component } from "react";

import "./Buttons.css";
import "./App.css";

import AdvancedModel from "./AdvancedModel.js";

class App extends Component {

  state = {
    webcamActive: false,
    advancedDemo: false,
    results: "",
    resultContainer: [],
    showResult: false,
    botChoice: '',
    humanChoice: '',
    stopGame: false,
    countdown: 3,
    nextGameCountdown: 5,
    nextGameCountdownId: undefined,
    timerId: undefined
  };

// Rock, Paper, Scissors Winner function:

// Base Function:
// random number 0,1,2 genarator:
randToRpsInt() {
  return (Math.floor(Math.random() * 3));
}

// choice genrator based on number genrator:
numberToChoice(number) {
  return ['Rock', 'Paper', 'Scissors'][number];    
}

desideWinner = (yourChoice, computerChoice) => {
  const rpsDatabase = {
      'Rock': {'Scissors': 1, 'Rock': 0.5, 'Paper': 0},
      'Paper': {'Rock': 1, 'Paper': 0.5, 'Scissors': 0},
      'Scissors': {'Paper': 1, 'Scissors': 0.5, 'Rock': 0},
  }

  const yourScore = rpsDatabase[yourChoice][computerChoice];
  const computerScore = rpsDatabase[computerChoice][yourChoice];

  return [yourScore, computerScore];
}

finalMessage = ([yourScore, computerScore]) => {
  if (yourScore === 0) {
      return {'message': 'You Lost', 'color': 'red'};
  } else if (yourScore === 0.5) {
      return {'message': 'You Drew', 'color': 'orange'};
  } else {
      return {'message': 'You Won', 'color': 'green'};
  }
}

rpsGame = (yourChoice) => {
  let humanChoice, botChoice;
  
  // Human choice id selector
  humanChoice = yourChoice; // ******* Take the answer from the AI *****(Create a extra function which receves the value rock, paper or scissors a certain num of times before relising answer in the function)
  // console.log(humanChoice);

  // Bot choice selector
  botChoice = this.numberToChoice(this.randToRpsInt())
  // console.log('Computer choice:', botChoice)
  // Result for winner and loser

  const result = this.desideWinner(humanChoice, botChoice);
  // Message database for results
  const message = this.finalMessage(result);
  // console.log(message)
  // Front-end view for user

  this.setState({
    resultContainer: [...this.state.resultContainer, humanChoice]
  })

  const {resultContainer} = this.state
  if (resultContainer.length >= 10) {
    const latestResults = resultContainer.slice(-10)
    const resultsMatch = new Set(latestResults)
    if (resultsMatch.size === 1) {
      this.setState({
        showResult: true,
        results: message.message,
        botChoice,
        humanChoice,
        stopGame: true,
        timerId: this.activateTimeout()
      })
    } 
  }
}

activateNextGameCountdown = () => {
  return setInterval(() => {
    if(this.state.nextGameCountdown < 1) {
      this.setState({
        stopGame: false,
        showResult: false,
        humanChoice: '',
        botChoice: '',
        results: '',
        countdown: 3,
        nextGameCountdown: 5,
        resultContainer: []
      })
      return clearInterval(this.state.nextGameCountdownId)
    }
    this.setState({
      nextGameCountdown: this.state.nextGameCountdown - 1
    })
  }, 1000);
}

// Activate timers
activateTimeout = () => {
  return setInterval(() => {
    if(this.state.countdown < 1) {
      // Reset game
      clearInterval(this.state.timerId)
      this.setState({
        nextGameCountdownId: this.activateNextGameCountdown()
      })
      return
    }
    // Countdown timer for game results to display
      this.setState({
        countdown: this.state.countdown - 1
      })
  }, 1000)
}

  // Extra text game input
  _renderAdvancedModel = () => {
    if (this.state.advancedDemo) {
      return (
        <div>
          <AdvancedModel key="advancedDemo" rpsGame={this.rpsGame} stopGame={this.state.stopGame}/>
          <p>Turn off ad-block where applicable</p>
        </div>
      );
    }
  };

  render() {
    const { humanChoice, botChoice, results, showResult, countdown, nextGameCountdown } = this.state 
    return (
      <div className="App">
        <div className="Main">
          <header class="">
            <h1>Rock Paper Scissior AI Game</h1>
            <p>Are you struggling to make decisions by yourself? why not try playing with our RPS AI to help you make those thought spliting desions?. </p>
          </header>
          <section>
            <h2>Here are the rules:</h2>
            <p>
              <strong>Tip: For a better game make sure your camera is pointing towards a plain background.</strong> 
            </p>
            <p>1. Click start when ready.</p>
            <p>2. Give the AI 5-10 seconds after the camera has loaded to get ready.</p>
            <p>3. Make your rock paper or scissors symbol as shown in the images below:</p>
            <img src="./rps_webcam_big.jpg" class="demo" alt="webcam demo" height="200px"></img>
          </section>

          <button
            className="btn-3d blue"
            onClick={() => {
              this.setState(prevState => ({
                webcamActive: false,
                advancedDemo: !prevState.advancedDemo
              }));
            }}
          >
            {this.state.advancedDemo
              ? "Stop Game"
              : "Start Game"}
          </button>
          {this._renderAdvancedModel()}

          {showResult 
          ? countdown === 0
          ? <div>
              <h4>You: {humanChoice}</h4>
              <h4>Computer: {botChoice}</h4>
              <h3>Results: {results}</h3>
              <p>Next game in {nextGameCountdown} seconds</p>
            </div>
          : `Game starts in ${countdown} seconds`
          : "Processing hand sign..."}
        </div>
      </div>
    );
  }
}

export default App;