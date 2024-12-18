import React, { useState } from "react";
import "./App.css";
import Row from "./Row.jsx";

const App = () => {
  const targetWord = "REAC";
  const level = targetWord.length - 3;
  const maxAttempts = 8 - level;
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      if (currentGuess.length !== targetWord.length) return;
    const updatedGuesses = [...guesses, currentGuess];
    setGuesses(updatedGuesses);
    if (currentGuess === targetWord || updatedGuesses.length >= maxAttempts) {
      setIsGameOver(true);
    }
      setCurrentGuess("");
    }
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
        
        <div class="wrapper">
        <Row guess={currentGuess} targetWord="" />
        <input
          type="text"
          value={currentGuess}
          onChange={e => setCurrentGuess(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          maxLength={targetWord.length}
          onBlur={e => {
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
          {/* Create "next Level" or "restart game" */}
        </>
      )}
    </div>
  );
};

export default App;
