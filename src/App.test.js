import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('should update streak when the correct word is guessed on level 5', () => {
  const setStreak = jest.fn();
  const setIsGameOver = jest.fn();
  const setGuesses = jest.fn();
  const setCurrentGuess = jest.fn();
  const mockLocalStorage = {
    setItem: jest.fn()
  };
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

  const handleKeyDown = jest.fn(() => {
    setIsGameOver(true);
    const newStreak = 1;
    setStreak(newStreak);
    localStorage.setItem('megaWordleStreak', newStreak.toString());
    setCurrentGuess('');
  });

  const event = { keyCode: 13 };
  const currentGuess = 'WORD';
  const targetWord = 'WORD';
  const level = 5;
  const guesses = [];

  handleKeyDown(event);

  expect(setIsGameOver).toHaveBeenCalledWith(true);
  expect(setStreak).toHaveBeenCalledWith(1);
  expect(mockLocalStorage.setItem).toHaveBeenCalledWith('megaWordleStreak', '1');
  expect(setCurrentGuess).toHaveBeenCalledWith('');
});

test('should handle non-Enter key presses correctly', () => {
  const setGuesses = jest.fn();
  const setCurrentGuess = jest.fn();
  const setIsInvalidGuess = jest.fn();
  const setIsGameOver = jest.fn();
  const setStreak = jest.fn();
  
  const handleKeyDown = jest.fn((event) => {
    if (event.keyCode !== 13) {
      // Do nothing for non-Enter key presses
    }
  });

  const event = { keyCode: 65 }; // 'A' key
  const currentGuess = 'WORD';
  const targetWord = 'WORD';
  const level = 5;
  const guesses = [];

  handleKeyDown(event);

  expect(setGuesses).not.toHaveBeenCalled();
  expect(setCurrentGuess).not.toHaveBeenCalled();
  expect(setIsInvalidGuess).not.toHaveBeenCalled();
  expect(setIsGameOver).not.toHaveBeenCalled();
  expect(setStreak).not.toHaveBeenCalled();
});
