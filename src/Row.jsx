import React from "react";
import "./Row.css";

// Row component represents a single row in the Wordle game
const Row = ({ guess, targetWord, className = '', isInput = false }) => {
  // Create a map of the target word
  const createTargetMap = () => {
    const map = new Map();
    for (let char of targetWord) {
      map.set(char, (map.get(char) || 0) + 1);
    }
    return map;
  };

  // Function to determine the status of each letter in the guess
  const getLetterStatuses = () => {
    const statuses = Array(targetWord.length).fill('absent');
    const targetMap = createTargetMap();

    // First pass: mark correct letters
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
        statuses[i] = 'correct';
        targetMap.set(guess[i], targetMap.get(guess[i]) - 1);
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < guess.length; i++) {
      if (statuses[i] !== 'correct' && targetMap.get(guess[i]) > 0) {
        statuses[i] = 'present';
        targetMap.set(guess[i], targetMap.get(guess[i]) - 1);
      }
    }

    return statuses;
  };

  const letterStatuses = isInput ? [] : getLetterStatuses();
  return (
    // Main row container with dynamic classes
    <div className={`row ${className} ${isInput ? 'input' : ''}`}>
      {/* Create an array of length equal to targetWord and map over it */}
      {Array.from({ length: targetWord.length }).map((_, index) => {
        const letter = guess[index] || ''; // Get letter from guess or empty string
        const status = isInput ? 'input' : letterStatuses[index]; // Determine letter status
        const isFlipping = !isInput && letter; // Determine if tile should flip
        return (
          // Individual tile for each letter
          <div 
            key={index} 
            className={`tile ${status} ${isFlipping ? 'flip' : ''}`}
            style={isFlipping ? { animationDelay: `${index * 100}ms` } : {}}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
};

export default Row;
