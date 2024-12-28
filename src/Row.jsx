import React, { useMemo } from "react";
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

const Row = React.memo(({ guess, targetWord, className = "", isInput }) => {
  const letters = useMemo(() => {
    return guess.split("").map((letter, index) => ({
      letter,
      status: getLetterStatus(letter, index, targetWord),
    }));
  }, [guess, targetWord]);

  return (
    <div className={`word-row ${className}`}>
      {letters.map(({ letter, status }, index) => (
        <span key={index} className={`letter ${status}`}>
          {letter}
        </span>
      ))}
    </div>
  );
});

export default Row;
