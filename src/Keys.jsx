// make a keyboard that shows the letters already used.
import React, { useMemo } from "react";
import "./Keys.css";

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

const getLetterStatus = (letter, guesses, targetWord) => {
    if (guesses.some(guess => guess.includes(letter))) {
        // Check if the letter is in the correct position in any guess
        if (guesses.some((guess, guessIndex) => 
            guess.split("").some((guessLetter, letterIndex) => 
                guessLetter === letter && guessLetter === targetWord[letterIndex]
            )
        )) {
            return "correct";
        } else if (targetWord.includes(letter)) {
            return "present";
        } else {
            return "absent";
        }
    }
    return "untried";
};

const Keys = React.memo(({ guesses, targetWord }) => {
    const keyStatuses = useMemo(() => {
      return keys.map(key => ({
        key,
        status: getLetterStatus(key, guesses, targetWord)
      }));
    }, [guesses, targetWord]);
  
    return (
      <div className="key-row">
        {keyStatuses.map(({ key, status }) => (
          <span
            key={key}
            className={`keys ${status}`}
          >   
            {key}
          </span>
        ))}
      </div>
    );
  });

export default Keys;