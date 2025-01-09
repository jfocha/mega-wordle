import React from "react";
import "./LandingPage.css";

const LandingPage = ({ onStart }) => {
    return (
      <div className="landing-page">
        <h1>Welcome to Mega Wordle!</h1>
        <div className="instructions">
          <h2>How to Play:</h2>
          <ul>
            <li>Guess the word in 7 tries or less.</li>
            <li>After each guess, the tile colors change:</li>
            <ul>
              <li><span className="green">Green</span>: Correct letter, right spot</li>
              <li><span className="yellow">Yellow</span>: Correct letter, wrong spot</li>
              <li><span className="gray">Gray</span>: Letter not in the word</li>
            </ul>
            <li>Words get longer as you progress through 5 levels.</li>
            <li>Fewer guesses allowed in higher levels.</li>
            <li>Try to maintain your streak!</li>
          </ul>
        </div>
        <button onClick={onStart} className="start-button">Start Game</button>
      </div>
    );
  };

  export default LandingPage;