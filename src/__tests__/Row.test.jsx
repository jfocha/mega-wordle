import React from 'react';
import { render, screen } from '@testing-library/react';
import Row from '../Row';

describe('Row component', () => {

test('renders correct number of tiles based on targetWord length', () => {
  const targetWord = 'HELLO';
  const guess = 'WORLD';
  render(<Row guess={guess} targetWord={targetWord} />);
  const tiles = screen.getAllByRole('generic', { name: '' });
  expect(tiles).toHaveLength(targetWord.length);
});

test('displays correct letter status for each tile', () => {
  const targetWord = 'APPLE';
  const guess = 'PAPER';
  render(<Row guess={guess} targetWord={targetWord} />);
  
  const tiles = screen.getAllByRole('generic', { name: '' });
  const expectedStatuses = ['correct', 'correct', 'absent', 'present', 'absent'];
  
  tiles.forEach((tile, index) => {
    expect(tile).toHaveClass(expectedStatuses[index]);
    expect(tile).toHaveTextContent(guess[index]);
  });
});

test('applies input class when isInput prop is true', () => {
  const targetWord = 'HELLO';
  const guess = 'WORLD';
  render(<Row guess={guess} targetWord={targetWord} isInput={true} />);
  const rowElement = screen.getByRole('generic', { name: '' });
  expect(rowElement).toHaveClass('input');
});

test('applies correct animation delay to flipping tiles', () => {
  const targetWord = 'REACT';
  const guess = 'REDUX';
  render(<Row guess={guess} targetWord={targetWord} />);
  
  const tiles = screen.getAllByRole('generic', { name: '' });
  tiles.forEach((tile, index) => {
    expect(tile).toHaveClass('flip');
    expect(tile).toHaveStyle(`animation-delay: ${index * 100}ms`);
  });
});

test('correctly identifies present status for repeated letters', () => {
  const targetWord = 'HELLO';
  const guess = 'LEVEL';
  render(<Row guess={guess} targetWord={targetWord} />);
  
  const tiles = screen.getAllByRole('generic', { name: '' });
  const expectedStatuses = ['present', 'correct', 'absent', 'absent', 'present'];
  
  tiles.forEach((tile, index) => {
    expect(tile).toHaveClass(expectedStatuses[index]);
    expect(tile).toHaveTextContent(guess[index]);
  });
});
});
