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
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll('.card-wrapper');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('flip-down');
        }, index * 100);
      });
    }, 500);  // Delay the start of the animation by 500ms
  
    return () => clearTimeout(timer);
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
      document.activeElement.blur();
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

  const customKeyStyle = {
    width: '27px',
    height: '35px',
    backgroundColor: '#d3d6da',
    color: '#1a1a1b',
    border: '2px solid #6a6a6a',
    borderRadius: '4px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '2px',
    padding: '0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const customSpecialKeyStyle = {
    ...customKeyStyle,
    width: 'auto',
    minWidth: '65px',
    backgroundColor: '#6a6a6a',
    border: '2px solid #8a8a8a',
    fontSize: '0.8rem',
  };

  console.log(pickedWords)
  return (
    <div className="main-container">
      <div className="title-wrapper">
      {"MEGA WORDLE".split('').map((letter, index) => (
        <div key={index} className="card-wrapper flip-down" style={{animationDelay: `${index * 0.1}s`}}>
          <div className="card">
            <div className="front">{letter}</div>
            <div className="back">{letter}</div>
          </div>
        </div>
      ))}
    </div>
      <h2>Level {level}</h2>
      <div className="guesses">
        {guesses.map((guess, index) => (
          <div key={index}>
            <Row guess={guess} targetWord={targetWord} />
          </div>
        ))}
      </div>
      {!isGameOver && (
        <>
          <Row guess={currentGuess} targetWord="" className={isInvalidGuess ? 'invalid' : ''} />
        </>
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
                <button 
                  onClick={restartGame}
                  className="game-button restart-button"
                >
                  Restart Game
                </button>
              </>
            ) : (
              <button 
                onClick={nextLevel}
                className="game-button next-level-button" 
              >
                Next Level
              </button>
            )
          ) : (
            <>
              <p>Streak ended at: {streak}</p>
              <button 
                onClick={restartGame}
                className="game-button restart-button"
              >
                Restart Game
              </button>
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
          keyStyle={customKeyStyle}
          specialKeyStyle={customSpecialKeyStyle}
        />
    </div>
  );
};

export default App;
