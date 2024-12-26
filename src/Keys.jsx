// make a keyboard that shows the letters already used.
import React, { useState } from "react";
import "./Keys.css";

const Keys = ({ guesses, targetWord }) => {
    const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

    const getLetterStatus = (letter) => {
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
    
    return (
        <div className="key-row">
            {keys.map((letter, index) => (
                <span
                key={index}
                className={`keys ${getLetterStatus(letter)}`}
                >   
                    {letter}
                </span>
            ))}
        </div>
      );
      
};

export default Keys;