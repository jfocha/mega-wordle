import { wordList, wordBank } from './wordLists';

export const generateNewWords = () => {
    const newWords = [];
    wordList.forEach((array) => {
        let word;
        do {
            word = array[Math.floor(Math.random() * array.length)].toUpperCase();
        } while (
            word.endsWith('S') || 
            word.endsWith('ED') || 
            word.endsWith('ING') || 
            word.endsWith('ER') || 
            word.endsWith('LY') || 
            word.startsWith('UN') || 
            !isWordInList(word));
        newWords.push(word);
    });
    return newWords;
};

// Function to check if guess is in wordList
export const isWordInList = (guess) => {
    const upperCaseGuess = guess.toUpperCase();
    return wordBank.some(word => word.toUpperCase() === upperCaseGuess
    );
};
