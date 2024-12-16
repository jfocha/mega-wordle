import React, { useState } from "react";
import "./App.css";
import Row from "./Row.jsx";

const App = () => {
  const targetWord = "REACT";
  const maxAttempts = 6;
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const handleInputChange = (event) => {
    setCurrentGuess(event.target.value.toUpperCase());
  };
  const handleGuess = () => {
    if (currentGuess.length !== 5) return;
    const updatedGuesses = [...guesses, currentGuess];
    setGuesses(updatedGuesses);
    if (currentGuess === targetWord || updatedGuesses.length >= maxAttempts) {
      setIsGameOver(true);
    }
  };

  return (
    <div className="main-container">
      <h1>Wordle</h1>
      {guesses.map((guess, index) => (
        <ul>
          <li key={index}>
            <Row guess={guess} targetWord={targetWord} />
          </li>
        </ul>
      ))}
      {!isGameOver && (
        <input
          placeholder="Enter your guess"
          onChange={handleInputChange}
          maxLength={targetWord.length}
        />
      )}
      {!isGameOver && <button onClick={handleGuess}>Guess</button>}
      {isGameOver && currentGuess !== targetWord && <p>{targetWord}</p>}
    </div>
  );
};

export default App;
