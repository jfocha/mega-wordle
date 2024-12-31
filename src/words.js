import { wordList, wordBank } from './wordLists';

// Function to generate new words for the game
export const generateNewWords = () => {
    const newWords = [];
    // Iterate through each array in the wordList
    wordList.forEach((array) => {
        let word;
        do {
            // Randomly select a word from the current array and convert to uppercase
            word = array[Math.floor(Math.random() * array.length)].toUpperCase();
        } while (
            // Exclude words that:
            word.endsWith('S') ||    // End with 'S' (plurals)
            word.endsWith('ED') ||   // End with 'ED' (past tense)
            word.endsWith('ING') ||  // End with 'ING' (gerunds)
            word.endsWith('ER') ||   // End with 'ER' (comparatives)
            word.endsWith('LY') ||   // End with 'LY' (adverbs)
            word.startsWith('UN') || // Start with 'UN' (negations)
            !isWordInList(word)      // Are not in the word bank
        );
        // Add the selected word to the new words array
        newWords.push(word);
    });
    return newWords;
};

// Function to check if a guess is in the word bank
export const isWordInList = (guess) => {
    // Convert the guess to uppercase for case-insensitive comparison
    const upperCaseGuess = guess.toUpperCase();
    // Check if any word in the word bank matches the guess
    return wordBank.some(word => word.toUpperCase() === upperCaseGuess);
};

