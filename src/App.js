import React, { useState, useEffect } from "react";
import "./App.css";
import Row from "./Row.jsx";
import Keys from "./Keys.jsx";
import { generateNewWords, isWordInList } from './words.js';

const App = () => {
  const [pickedWords, setPickedWords] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isInvalidGuess, setIsInvalidGuess] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setPickedWords(generateNewWords());
    const savedStreak = localStorage.getItem('megaWordleStreak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
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
        if (level === 5) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('megaWordleStreak', newStreak.toString());
        }
      } else if (updatedGuesses.length >= maxAttempts) {
        setIsGameOver(true);
      }
      setCurrentGuess("");
    } else {
      setIsInvalidGuess(true);
      setTimeout(() => setIsInvalidGuess(false), 1000);
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
    if (level < 5) {
      setStreak(0);
      localStorage.setItem('megaWordleStreak', '0');
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
        <div className="wrapper">
          <Row guess={currentGuess} targetWord="" className={isInvalidGuess ? 'invalid' : ''} />
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
                <p>Streak: {streak}</p>
                <button onClick={restartGame}>Restart Game</button>
              </>
            ) : (
            <button onClick={nextLevel}>Next Level</button>
            )
          ) : (
            <>
              <p>Streak ended at: {streak}</p>
              <button onClick={restartGame}>Restart Game</button>
            </>
          )}
        </>
      )}
      <div className="keyboard">
        <Keys guesses={guesses} targetWord={targetWord} />
      </div>
    </div>
  );
};

export default App;
