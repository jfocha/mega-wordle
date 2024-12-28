import React, { useState, useEffect, useMemo, useCallback } from "react";
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

  const targetWord = useMemo(() => pickedWords[currentLevelIndex] || '', [pickedWords, currentLevelIndex]);
  const level = useMemo(() => currentLevelIndex + 1, [currentLevelIndex]);
  const maxAttempts = useMemo(() => targetWord ? 11 - targetWord.length : 0, [targetWord]);

  const handleGuess = useCallback(() => {
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
  }, [currentGuess, targetWord, guesses, level, streak, maxAttempts]);

  const handleKeyDown = useCallback((event) => {
    if (isGameOver) return;

    if (event.key === 'Enter') {
      handleGuess();
    } else if (event.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(event.key)) {
      if (currentGuess.length < targetWord.length) {
        setCurrentGuess(prev => prev + event.key.toUpperCase());
      }
    }
  }, [currentGuess, targetWord.length, isGameOver, handleGuess]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const nextLevel = useCallback(() => {
    if (currentLevelIndex < targetWord.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      setGuesses([]);
      setCurrentGuess("");
      setIsGameOver(false);
    }
  }, [currentLevelIndex, targetWord.length]);

  const restartGame = useCallback(() => {
    setPickedWords(generateNewWords());
    setCurrentLevelIndex(0);
    setGuesses([]);
    setCurrentGuess("");
    setIsGameOver(false);
    if (level < 5) {
      setStreak(0);
      localStorage.setItem('megaWordleStreak', '0');
    }
  }, [level]);

  const handleKeyClick = useCallback((letter) => {
    if (currentGuess.length < targetWord.length && !isGameOver) {
      setCurrentGuess(prev => prev + letter);
    }
  }, [currentGuess, targetWord.length, isGameOver]);

  const handleBackspace = useCallback(() => {
    setCurrentGuess(prev => prev.slice(0, -1));
  }, []);

  console.log(pickedWords)
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
        <Keys 
          guesses={guesses} 
          targetWord={targetWord} 
          onKeyClick={handleKeyClick}
          onEnter={handleGuess}
          onBackspace={handleBackspace}
        />
    </div>
  );
};

export default App;
