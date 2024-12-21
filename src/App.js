import React, { useState, useEffect } from "react";
import "./App.css";
import Row from "./Row.jsx";
import { generateNewWords, isWordInList } from './words.js';

const App = () => {
  const [pickedWords, setPickedWords] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    setPickedWords(generateNewWords());
  }, []);

  const targetWord = pickedWords[currentLevelIndex] || '';
  const level = currentLevelIndex + 1;
  const maxAttempts = targetWord ? 11 - targetWord.length : 0;
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      if (currentGuess.length !== targetWord.length) return;
      if (isWordInList(currentGuess)) {
      const updatedGuesses = [...guesses, currentGuess];
      setGuesses(updatedGuesses);
      if (currentGuess === targetWord) {
        setIsGameOver(true);
      } else if (updatedGuesses.length >= maxAttempts) {
        setIsGameOver(true);
      }
      setCurrentGuess("");
    } else {
      alert("Word not in word bank")
    }
    }
  };
console.log(pickedWords)
  const nextLevel = () => {
    if (currentLevelIndex < targetWord.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      setGuesses([]);
      setCurrentGuess("");
      setIsGameOver(false);
    }
  };

  const restartGame = () => {
    setPickedWords(generateNewWords());
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
          {(guesses[guesses.length - 1] === targetWord) ? (
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
