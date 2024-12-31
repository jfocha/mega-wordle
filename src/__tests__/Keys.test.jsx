import React from 'react';
import { render, screen } from '@testing-library/react';
import { Keys, getLetterStatus } from '../Keys';

describe('Keys component', () => {

test('getLetterStatus returns "correct" when letter is in correct position in any guess', () => {
  const letter = 'A';
  const guesses = ['BEACH', 'APPLE'];
  const targetWord = 'APPLE';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('correct');
});

test('getLetterStatus returns "present" when letter is in target word but not in correct position', () => {
  const letter = 'A';
  const guesses = ['BEACH', 'CRATE'];
  const targetWord = 'APPLE';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('present');
});

test('getLetterStatus returns "absent" when the letter is not in the target word but has been guessed', () => {
  const letter = 'Z';
  const guesses = ['BEACH', 'PIZZA'];
  const targetWord = 'APPLE';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('absent');
});

test('getLetterStatus returns an empty string when the letter has not been guessed', () => {
  const letter = 'Z';
  const guesses = ['BEACH', 'APPLE'];
  const targetWord = 'GRAPE';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('');
});

test('getLetterStatus handles multiple occurrences of the same letter in guesses', () => {
  const letter = 'P';
  const guesses = ['APPLE', 'HAPPY'];
  const targetWord = 'PAPER';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('correct');
});

test('getLetterStatus correctly identifies letter status with repeated letters in target word', () => {
  const letter = 'E';
  const guesses = ['APPLE', 'SLEEP'];
  const targetWord = 'RESET';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('correct');
});

test('getLetterStatus returns "correct" for a letter that appears as both "correct" and "present" in different guesses', () => {
  const letter = 'A';
  const guesses = ['APPLE', 'BEACH'];
  const targetWord = 'PASTA';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('correct');
});

test('getLetterStatus handles case sensitivity correctly', () => {
  const letter = 'a';
  const guesses = ['BEACH', 'APPLE'];
  const targetWord = 'APPLE';
  const result = getLetterStatus(letter, guesses, targetWord);
  expect(result).toBe('correct');
});

test('getLetterStatus returns consistent results for the same input across multiple function calls', () => {
  const letter = 'A';
  const guesses = ['BEACH', 'APPLE'];
  const targetWord = 'GRAPE';

  const result1 = getLetterStatus(letter, guesses, targetWord);
  const result2 = getLetterStatus(letter, guesses, targetWord);
  const result3 = getLetterStatus(letter, guesses, targetWord);

  expect(result1).toBe(result2);
  expect(result2).toBe(result3);
  expect(result1).toBe('present');
});
});
