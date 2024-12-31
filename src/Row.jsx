import React from "react";
import "./Row.css";

// Row component represents a single row in the Wordle game
const Row = ({ guess, targetWord, className = '', isInput = false }) => {
  // Function to determine the status of each letter in the guess
  const getLetterStatus = (letter, index) => {
    if (letter === targetWord[index]) {
      return "correct"; // Letter is in the correct position
    } else if (targetWord.includes(letter)) {
      return "present"; // Letter is in the word but in wrong position
    } else {
      return "absent"; // Letter is not in the word
    }
  };

  return (
    // Main row container with dynamic classes
    <div className={`row ${className} ${isInput ? 'input' : ''}`}>
      {/* Create an array of length equal to targetWord and map over it */}
      {Array.from({ length: targetWord.length }).map((_, index) => {
        const letter = guess[index] || ''; // Get letter from guess or empty string
        const status = isInput ? 'input' : getLetterStatus(letter, index); // Determine letter status
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
