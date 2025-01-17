# Mega Wordle

Mega Wordle is an extended version of the popular word-guessing game, Wordle. This project was built using React and offers a multi-level word-guessing experience.

## Features

- Multiple levels with increasing word lengths
- Daily reset of the game
- Winning streak tracking
- On-screen keyboard
- Responsive design for various screen sizes
- Local storage to save game progress

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
https://github.com/jfocha/mega-wordle.git


2. Navigate to the project directory:
cd mega-wordle

3. Install the dependencies:
npm install

4. Start the development server:
npm start


5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to Play

1. The game starts with a 4-letter word.
2. You have 7 attempts to guess the word correctly.
3. After each guess, the letters will be colored to indicate:
- Green: The letter is correct and in the right position.
- Yellow: The letter is in the word but in the wrong position.
- Gray: The letter is not in the word.
4. If you guess the word correctly, you move to the next level with a longer word.
5. The game has 5 levels in total, with word lengths increasing from 4 to 8 letters.
6. Your winning streak is tracked across games.
7. The game resets daily at midnight.

## Technologies Used

- React
- CSS
- Local Storage for game state persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL License. See the [LICENSE](GPL License.txt) file for details.

## Acknowledgments

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle/index.html) game.
- Thanks to all contributors and users of Mega Wordle!