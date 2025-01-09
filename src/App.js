// Import necessary React hooks and components
import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import Row from "./Row.jsx";
import Keys from "./Keys.jsx";
// Import utility functions for word generation and validation
import { generateNewWords, isWordInList } from './words.js';

const App = () => {
  // State variables
  const [pickedWords, setPickedWords] = useState([]); // Array of words for each level
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); // Current level index
  const [guesses, setGuesses] = useState([]); // Array of user guesses
  const [currentGuess, setCurrentGuess] = useState(""); // Current user input
  const [isInvalidGuess, setIsInvalidGuess] = useState(false); // Flag for invalid guess
  const [isGameOver, setIsGameOver] = useState(false); // Flag for game over state
  const [streak, setStreak] = useState(0); // User's winning streak
  const [flippedLetters, setFlippedLetters] = useState([]); // State for title animation
  const [lastResetDate, setLastResetDate] = useState(null); //keep track of when the game was last reset
  const [remainingGuesses, setRemainingGuesses] = useState(7);
  const now = new Date();
  const todayDate = now.toDateString();

  useEffect(() => {
    let parsedState = null;

    try {
      const savedState = localStorage.getItem('megaWordleState');
      if (savedState) {
        parsedState = JSON.parse(savedState);
        setPickedWords(parsedState.pickedWords);
        setCurrentLevelIndex(parsedState.currentLevelIndex);
        setGuesses(parsedState.guesses);
        setCurrentGuess(parsedState.currentGuess);
        setIsGameOver(parsedState.isGameOver);
        setStreak(parsedState.streak);
        setLastResetDate(parsedState.lastResetDate);
        setRemainingGuesses(parsedState.remainingGuesses);
      }
    } catch (error) {
      console.error('Error retrieving or parsing saved game state:', error);
      // If there's an error, we'll fall back to starting a new game
      parsedState = null;
    } finally {
      if (!parsedState) {
        // If we couldn't retrieve a valid saved state, start a new game
        setPickedWords(generateNewWords());
        setLastResetDate(todayDate);
      }
    }

    // Timer for title animation (rest of the existing code)
    const title = "MEGAWORDLE";
    let timer;

    const flipNextLetter = (index) => {
      if (index < title.length) {
        setFlippedLetters(prev => [...prev, index]);
        timer = setTimeout(() => flipNextLetter(index + 1), 500);
      }
    };

    flipNextLetter(0);

    return () => clearTimeout(timer);
  }, [todayDate]);

// Memoized values to optimize performance
const targetWord = useMemo(() => pickedWords[currentLevelIndex] || '', [pickedWords, currentLevelIndex]);
const level = useMemo(() => currentLevelIndex + 1, [currentLevelIndex]);
const maxAttempts = useMemo(() => targetWord ? 11 - targetWord.length : 0, [targetWord]);


// Save the current game state
const saveGame = useCallback(() => {
  const gameState = {
    pickedWords,
    currentLevelIndex,
    guesses,
    currentGuess,
    isGameOver,
    streak,
    remainingGuesses,
    lastResetDate
  };
  localStorage.setItem('megaWordleState', JSON.stringify(gameState));
}, [pickedWords, currentLevelIndex, guesses, currentGuess, isGameOver, streak, remainingGuesses, lastResetDate]);

// Handle user's guess submission
const handleGuess = useCallback(() => {
  if (currentGuess.length !== targetWord.length) return;
  if (isWordInList(currentGuess)) {
    const updatedGuesses = [...guesses, currentGuess];
    setGuesses(updatedGuesses);
    setRemainingGuesses(prevGuesses => prevGuesses - 1);
    if (currentGuess === targetWord) {
      setIsGameOver(true);
      if (level === 5) {
        // Update streak if player wins the final level
        const newStreak = streak + 1;
        setStreak(newStreak);
        saveGame();
      }
    } else if (updatedGuesses.length >= maxAttempts) {
      setIsGameOver(true);
    }
    setCurrentGuess("");
    document.activeElement.blur();
    saveGame();
  } else {
    // Handle invalid guess
    setIsInvalidGuess(true);
    setTimeout(() => setIsInvalidGuess(false), 1000);
  }
}, [currentGuess, targetWord, guesses, level, streak, maxAttempts, saveGame]);

// Handle keyboard input
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

// Add and remove keyboard event listener
useEffect(() => {
  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [handleKeyDown]);

// Move to the next level
const nextLevel = useCallback(() => {
  if (currentLevelIndex < targetWord.length - 1) {
    setCurrentLevelIndex(currentLevelIndex + 1);
    setGuesses([]);
    setCurrentGuess("");
    setRemainingGuesses(7 - level);
    setIsGameOver(false);
    saveGame();
  }
}, [currentLevelIndex, targetWord.length, level, saveGame]);

// Restart the game
const restartGame = useCallback(() => {
  setPickedWords(generateNewWords());
  setCurrentLevelIndex(0);
  setGuesses([]);
  setCurrentGuess("");
  setRemainingGuesses(7);
  setIsGameOver(false);
  if (level < 5) {
    setStreak(0);
    saveGame();}
}, [level, saveGame]);

// Handle on-screen keyboard key clicks
const handleKeyClick = useCallback((letter) => {
  if (currentGuess.length < targetWord.length && !isGameOver) {
    setCurrentGuess(prev => prev + letter);
  }
}, [currentGuess, targetWord.length, isGameOver]);

// Handle backspace for on-screen keyboard
const handleBackspace = useCallback(() => {
  setCurrentGuess(prev => prev.slice(0, -1));
}, []);

    // Function to check and reset game at midnight
    const checkAndResetAtMidnight = useCallback(() => {
      if (lastResetDate !== todayDate && lastResetDate !== null) {
        // It's a new day, reset the game
        localStorage.removeItem('megaWordleState');
        restartGame();
        setLastResetDate(todayDate);
        saveGame();
      }
    }, [lastResetDate, todayDate, restartGame, saveGame]);
  
    // Use effect for midnight reset check
    useEffect(() => {
      // Check for reset on component mount
      const savedState = localStorage.getItem('megaWordleState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.lastResetDate === todayDate) {
          setLastResetDate(parsedState.lastResetDate);
        }
      }
      checkAndResetAtMidnight();
  
      // Set up interval to check for midnight reset
      const intervalId = setInterval(() => {
        checkAndResetAtMidnight();
        saveGame();
      }, 60000); // Check every minute
  
      return () => clearInterval(intervalId);
    }, [todayDate, checkAndResetAtMidnight, saveGame]);

  // Function to render empty tiles for remaining guesses
  const renderEmptyTiles = useCallback(() => {
    // Calculate the number of empty rows to render
    const emptyRows = remainingGuesses - (isGameOver ? 0 : 1); // Subtract 1 for the current input row if the game is not over
    // Create an array of empty rows
    return Array(emptyRows).fill().map((_, rowIndex) => (
      <div key={`empty-row-${rowIndex}`} className="empty-row">
        {Array(targetWord.length).fill().map((_, colIndex) => (
          <div key={`empty-tile-${rowIndex}-${colIndex}`} className="empty-tile"></div>
        ))}
      </div>
    ));
  }, [remainingGuesses, isGameOver, targetWord.length]);

  return (
    <div className="main-container">
      <div className="top">
      <div className="title-wrapper">
        <div className="title-line">
          {["M", "E", "G", "A"].map((letter, index) => (
            <div key={index} className={`card-wrapper ${flippedLetters.includes(index) ? 'flip-down' : ''}`}>
              <div className="card">
                <div className="front">{letter}</div>
                <div className="back">{letter}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="title-line">
          {["W", "O", "R", "D", "L", "E"].map((letter, index) => (
            <div key={index + 4} className={`card-wrapper ${flippedLetters.includes(index + 4) ? 'flip-down' : ''}`}>
              <div className="card">
                <div className="front">{letter}</div>
                <div className="back">{letter}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h2>Level {level}</h2>
      <div className="guesses">
        {guesses.map((guess, index) => (
          <div key={index}>
            <Row guess={guess} targetWord={targetWord} isInput={false} />
          </div>
        ))}
      </div>
      {!isGameOver && (
        <Row
          guess={currentGuess}
          targetWord={targetWord}
          className={isInvalidGuess ? 'invalid' : ''}
          isInput={true}
        />
      )}
      {renderEmptyTiles()}
      </div>
      <div className="bottom">
      {isGameOver && (
        <div className="game-over">
          <h3>Correct answer:</h3>
          <div className="answer">
            <Row guess={targetWord} targetWord={targetWord} />
          </div>
          {(guesses[guesses.length - 1] === targetWord) ? (
            (level === 5) ? (
              <>
                <div className="win">
                  <h4 className="neon-text rotating-text" data-text="You Win!">You Win!</h4>
                </div>
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
        </div>
      )}
      {!isGameOver && (
        <Keys
          guesses={guesses}
          targetWord={targetWord}
          onKeyClick={handleKeyClick}
          onEnter={handleGuess}
          onBackspace={handleBackspace}
        />
      )}
      </div>
    </div>
  );
};

export default App;
