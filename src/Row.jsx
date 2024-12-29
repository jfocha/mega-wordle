import React from "react";
import "./Row.css";

const getLetterStatus = (letter, index, targetWord) => {
  if (targetWord === "") return "try";
  if (letter === targetWord[index]) {
    return "correct";
  } else if (targetWord.includes(letter)) {
    return "present";
  } else {
    return "absent";
  }
};

const Row = ({ guess, targetWord, className = "", isInput }) => {
  const letters = guess.split('').concat(Array(targetWord.length - guess.length).fill('')).map((letter, index) => ({
      letter,
      status: getLetterStatus(letter, index, targetWord),
    }));

  return (
    <div className={`row ${className} ${isInput ? 'input-row' : ''}`}>
      {}
      {letters.map(({ letter, status }, index) => (
        <span key={index} className={`tile ${status} ${isInput ? 'input-tile' : ''}`}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default Row;
