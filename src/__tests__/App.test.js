import React from 'react';
import { render, screen, fireEvent, renderHook, act  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import { isWordInList } from '../words';

jest.mock('../words', () => ({
  isWordInList: jest.fn(),
  generateNewWords: jest.fn(() => ['WORD1', 'WORD2', 'WORD3', 'WORD4', 'WORD5']),
}));

describe('App component', () => {


test('handleGuess should not update state when current guess length doesn\'t match target word length', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'SHOR',
    targetWord: 'WORDS',
    guesses: [],
    level: 1,
    streak: 0,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setGuesses).not.toHaveBeenCalled();
  expect(setRemainingGuesses).not.toHaveBeenCalled();
  expect(setIsGameOver).not.toHaveBeenCalled();
  expect(setStreak).not.toHaveBeenCalled();
  expect(setCurrentGuess).not.toHaveBeenCalled();
  expect(setIsInvalidGuess).not.toHaveBeenCalled();
});

test('should add current guess to guesses array when it\'s a valid word', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'VALID',
    targetWord: 'WORDS',
    guesses: [],
    level: 1,
    streak: 0,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);
  isWordInList.mockReturnValue(true);

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setGuesses).toHaveBeenCalledWith(['VALID']);
  expect(setRemainingGuesses).toHaveBeenCalled();
  expect(setIsGameOver).not.toHaveBeenCalled();
  expect(setStreak).not.toHaveBeenCalled();
  expect(setCurrentGuess).toHaveBeenCalledWith('');
  expect(setIsInvalidGuess).not.toHaveBeenCalled();
});

test('should decrease remaining guesses by 1 after a valid guess', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'VALID',
    targetWord: 'WORDS',
    guesses: [],
    level: 1,
    streak: 0,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);
  isWordInList.mockReturnValue(true);

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setRemainingGuesses).toHaveBeenCalledWith(expect.any(Function));
  const setRemainingGuessesCallback = setRemainingGuesses.mock.calls[0][0];
  expect(setRemainingGuessesCallback(6)).toBe(5);
});

test('should set game over when current guess matches target word', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'WORDS',
    targetWord: 'WORDS',
    guesses: [],
    level: 1,
    streak: 0,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);
  isWordInList.mockReturnValue(true);

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setGuesses).toHaveBeenCalledWith(['WORDS']);
  expect(setRemainingGuesses).toHaveBeenCalled();
  expect(setIsGameOver).toHaveBeenCalledWith(true);
  expect(setStreak).not.toHaveBeenCalled();
  expect(setCurrentGuess).toHaveBeenCalledWith('');
  expect(setIsInvalidGuess).not.toHaveBeenCalled();
});

test('should update streak and local storage when winning on the final level', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'FINAL',
    targetWord: 'FINAL',
    guesses: [],
    level: 5,
    streak: 3,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);
  isWordInList.mockReturnValue(true);

  const localStorageMock = {
    setItem: jest.fn()
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setGuesses).toHaveBeenCalledWith(['FINAL']);
  expect(setRemainingGuesses).toHaveBeenCalled();
  expect(setIsGameOver).toHaveBeenCalledWith(true);
  expect(setStreak).toHaveBeenCalledWith(4);
  expect(setCurrentGuess).toHaveBeenCalledWith('');
  expect(localStorageMock.setItem).toHaveBeenCalledWith('megaWordleStreak', '4');
});

test('should set game over when maximum attempts are reached', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'VALID',
    targetWord: 'WORDS',
    guesses: ['GUESS1', 'GUESS2', 'GUESS3', 'GUESS4', 'GUESS5'],
    level: 1,
    streak: 0,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);
  isWordInList.mockReturnValue(true);

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setGuesses).toHaveBeenCalledWith(['GUESS1', 'GUESS2', 'GUESS3', 'GUESS4', 'GUESS5', 'VALID']);
  expect(setRemainingGuesses).toHaveBeenCalled();
  expect(setIsGameOver).toHaveBeenCalledWith(true);
  expect(setStreak).not.toHaveBeenCalled();
  expect(setCurrentGuess).toHaveBeenCalledWith('');
  expect(setIsInvalidGuess).not.toHaveBeenCalled();
});

test('should clear current guess after a valid guess', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'VALID',
    targetWord: 'WORDS',
    guesses: [],
    level: 1,
    streak: 0,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);
  isWordInList.mockReturnValue(true);

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setCurrentGuess).toHaveBeenCalledWith('');
});

test('should not update state for invalid guesses', () => {
  const setGuesses = jest.fn();
  const setRemainingGuesses = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();

  const mockState = {
    currentGuess: 'INVALID',
    targetWord: 'VALID',
    guesses: [],
    level: 1,
    streak: 0,
    maxAttempts: 6
  };

  React.useState = jest.fn().mockReturnValue([mockState, jest.fn()]);
  React.useCallback = jest.fn().mockImplementation(cb => cb);
  isWordInList.mockReturnValue(false);

  const { result } = renderHook(() => App());
  act(() => {
    result.current.handleGuess();
  });

  expect(setGuesses).not.toHaveBeenCalled();
  expect(setRemainingGuesses).not.toHaveBeenCalled();
  expect(setIsGameOver).not.toHaveBeenCalled();
  expect(setStreak).not.toHaveBeenCalled();
  expect(setCurrentGuess).not.toHaveBeenCalled();
  expect(setIsInvalidGuess).toHaveBeenCalledWith(true);
});
});
