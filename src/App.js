import React, { useState } from "react";
import "./App.css";
import Row from "./Row.jsx";

const App = () => {
  const targetWord = "REACT";
  const maxAttempts = 6;
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const handleGuess = (event) => {
    if (currentGuess.length !== 5) return;
    const updatedGuesses = [...guesses, currentGuess];
    setGuesses(updatedGuesses);
    if (currentGuess === targetWord || updatedGuesses.length >= maxAttempts) {
      setIsGameOver(true);
    }
    setCurrentGuess("");
  };
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleGuess(event);
      setCurrentGuess("");
    }
  };

  return (
    <div className="main-container">
      <h1>Mega Wordle</h1>
      <div className="guesses">
      {guesses.map((guess, index) => (
        <ul>
          <li key={index}>
            <Row guess={guess} targetWord={targetWord} />
          </li>
        </ul>
      ))}
      </div>
      {!isGameOver && (
        <input
          placeholder="Enter your guess"
          value={currentGuess}
          onChange={e => setCurrentGuess(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          maxLength={targetWord.length}
        />
      )}
      {!isGameOver && <button onClick={handleGuess}>Guess</button>}
      {isGameOver && currentGuess !== targetWord && (
        <>
          <h2>Correct answer:</h2>
          <Row guess={targetWord} targetWord={targetWord} />
        </>
      )}
    </div>
  );
};

export default App;
