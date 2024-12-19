import React, { useState } from "react";
import "./App.css";
import Row from "./Row.jsx";

const App = () => {
  const targetWords = ["DOGS", "REACT", "WORDLE", "FORTUNE", "ACHIEVER"];
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const targetWord = targetWords[currentLevelIndex];
  const level = currentLevelIndex + 1;
  const maxAttempts = 11 - targetWord.length;
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      if (currentGuess.length !== targetWord.length) return;
      const updatedGuesses = [...guesses, currentGuess];
      setGuesses(updatedGuesses);
      if (currentGuess === targetWord) {
        setIsGameOver(true);
      } else if (updatedGuesses.length >= maxAttempts) {
        setIsGameOver(true);
      }
      setCurrentGuess("");
    }
  };

  const nextLevel = () => {
    if (currentLevelIndex < targetWords.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      setGuesses([]);
      setCurrentGuess("");
      setIsGameOver(false);
    }
  };

  const restartGame = () => {
    setCurrentLevelIndex(0);
    setGuesses([]);
    setCurrentGuess("");
    setIsGameOver(false);
  };
  return (
    <div className="main-container">
      <h1>Mega Wordle</h1>
      <h2>Level {level}</h2>
      <div className="guesses">
        {guesses.map((guess, index) => (
          <div key={index}>
            <Row guess={guess} targetWord={targetWord} />
          </div>
        ))}
      </div>
      {!isGameOver && (
        <div className="wrapper">
          <Row guess={currentGuess} targetWord="" />
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            maxLength={targetWord.length}
            onBlur={(e) => {
              if (e.relatedTarget === null) {
                e.target.focus();
              }
            }}
            autoFocus
          />
        </div>
      )}
      {isGameOver && (
        <>
          <h3>Correct answer:</h3>
          <Row guess={targetWord} targetWord={targetWord} />
          {guesses.length < maxAttempts ? (
            (level === 5) ? (
              <>
                <h4>You Win!</h4>
                <button onClick={restartGame}>Restart Game</button>
              </>
            ) : (
            <button onClick={nextLevel}>Next Level</button>
            )
          ) : (
            <button onClick={restartGame}>Restart Game</button>
          )}
        </>
      )}
    </div>
  );
};

export default App;
