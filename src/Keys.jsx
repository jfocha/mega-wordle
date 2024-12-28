// make a keyboard that shows the letters already used.
import React, { useMemo } from "react";
import "./Keys.css";

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const getLetterStatus = (letter, guesses, targetWord) => {
  if (guesses.some((guess) => guess.includes(letter))) {
    // Check if the letter is in the correct position in any guess
    if (
      guesses.some((guess, guessIndex) =>
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

const Keys = React.memo(
  ({ guesses, targetWord, onKeyClick, onEnter, onBackspace }) => {
    const keyStatuses = useMemo(() => {
      return keys.flat().map((letter) => ({
        letter,
        status: ["ENTER", "⌫"].includes(letter)
          ? "special"
          : getLetterStatus(letter, guesses, targetWord),
      }));
    }, [guesses, targetWord]);

    const handleKeyClick = (letter) => {
      if (letter === "ENTER") {
        onEnter();
      } else if (letter === "⌫") {
        onBackspace();
      } else {
        onKeyClick(letter);
      }
    };

    return (
      <div className="keyboard">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="key-row">
            {row.map((letter) => {
              const keyStatus = keyStatuses.find((k) => k.letter === letter);
              return (
                <button
                  key={letter}
                  className={`keys ${keyStatus.status}`}
                  onClick={() => handleKeyClick(letter)}
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
