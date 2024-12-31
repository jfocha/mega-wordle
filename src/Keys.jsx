import React, { useMemo } from "react";
import "./Keys.css";

// Define the keyboard layout
const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

// Function to determine the status of a letter based on previous guesses
const getLetterStatus = (letter, guesses, targetWord) => {
  if (guesses.some((guess) => guess.includes(letter))) {
    // Check if the letter is in the correct position in any guess
    if (
      guesses.some((guess) =>
        guess
          .split("")
          .some(
            (guessLetter, letterIndex) =>
              guessLetter === letter && guessLetter === targetWord[letterIndex]
          )
      )
    ) {
      return "correct";
    } else if (targetWord.includes(letter)) {
      return "present";
    } else {
      return "absent";
    }
  }
  return "";
};

// Keys component (memoized to prevent unnecessary re-renders)
const Keys = React.memo(
  ({ guesses, targetWord, onKeyClick, onEnter, onBackspace, keyStyle, specialKeyStyle }) => {
    // Memoized calculation of key statuses
    const keyStatuses = useMemo(() => {
      return keys.flat().map((letter) => ({
        letter,
        status: ["ENTER", "⌫"].includes(letter)
          ? "special"
          : getLetterStatus(letter, guesses, targetWord),
      }));
    }, [guesses, targetWord]);

    // Handle key clicks
    const handleKeyClick = (letter) => {
      if (letter === "ENTER") {
        onEnter();
      } else if (letter === "⌫") {
        onBackspace();
      } else {
        onKeyClick(letter);
      }
    };

    // Render the keyboard
    return (
      <div className="keyboard">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="key-row">
            {row.map((letter) => {
              const keyStatus = keyStatuses.find((k) => k.letter === letter);
              const isSpecial = ["ENTER", "⌫"].includes(letter);
              return (
                <button
                  key={letter}
                  className={`keys ${keyStatus.status} ${isSpecial ? 'special' : 'letter'}`}
                  onClick={() => handleKeyClick(letter)}
                  style={isSpecial ? specialKeyStyle : keyStyle}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);

export default Keys;
