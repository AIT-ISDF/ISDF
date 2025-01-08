// List of words to choose from
const wordList = [
    'javascript',
    'hangman',
    'programming',
    'developer',
    'computer',
    'algorithm',
    'function',
    'variable',
    'constant',
    'array',
    'object',
    'string',
    'number',
    'boolean',
    'undefined',
    'null',
    'class',
    'scope',
    'closure',
    'promise'
];

// Game variables
let chosenWord = '';
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;

// Select elements
const wordDisplay = document.getElementById('wordDisplay');
const messageDisplay = document.getElementById('message');
const alphabetDiv = document.getElementById('alphabet');
const restartButton = document.getElementById('restartButton');
const canvas = document.getElementById('hangmanCanvas');
const context = canvas.getContext('2d');

// Initialize game
function initGame() {
    // Reset variables
    mistakes = 0;
    guessedLetters = [];
    messageDisplay.textContent = '';
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Randomly select a word
    chosenWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

    // Display word with underscores
    displayWord();

    // Create alphabet buttons
    createAlphabetButtons();
}

// Display the word with guessed letters and underscores
function displayWord() {
    const display = chosenWord
        .split('')
        .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
        .join(' ');

    wordDisplay.textContent = display;

    // Check for win condition
    if (!display.includes('_')) {
        messageDisplay.textContent = 'You won! 🎉';
        disableAlphabet();
    }
}

// Create alphabet buttons
function createAlphabetButtons() {
    alphabetDiv.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', handleGuess);
        alphabetDiv.appendChild(button);
    }
}

// Handle user's guess
function handleGuess(event) {
    const letter = event.target.textContent;
    event.target.disabled = true;

    if (chosenWord.includes(letter)) {
        guessedLetters.push(letter);
        displayWord();
    } else {
        mistakes++;
        updateHangman();
        if (mistakes === maxMistakes) {
            messageDisplay.textContent = `You lost! The word was: ${chosenWord}`;
            displayWord(); // Show the word
            disableAlphabet();
        }
    }
}

// Disable all alphabet buttons
function disableAlphabet() {
    const buttons = alphabetDiv.getElementsByTagName('button');
    for (let button of buttons) {
        button.disabled = true;
    }
}

// Update the hangman drawing based on mistakes
function updateHangman() {
    context.lineWidth = 2;
    context.strokeStyle = '#333';

    switch (mistakes) {
        case 1:
            // Draw the gallows (vertical pole)
            context.beginPath();
            context.moveTo(20, 180);
            context.lineTo(20, 20);
            context.stroke();
            break;
        case 2:
            // Draw the horizontal beam
            context.beginPath();
            context.moveTo(20, 20);
            context.lineTo(100, 20);
            context.stroke();
            break;
        case 3:
            // Draw the rope
            context.beginPath();
            context.moveTo(100, 20);
            context.lineTo(100, 40);
            context.stroke();
            break;
        case 4:
            // Draw the head
            context.beginPath();
            context.arc(100, 50, 10, 0, Math.PI * 2);
            context.stroke();
            break;
        case 5:
            // Draw the body
            context.beginPath();
            context.moveTo(100, 60);
            context.lineTo(100, 100);
            context.stroke();
            break;
        case 6:
            // Draw the arms and legs
            // Left arm
            context.beginPath();
            context.moveTo(100, 70);
            context.lineTo(80, 90);
            context.stroke();

            // Right arm
            context.beginPath();
            context.moveTo(100, 70);
            context.lineTo(120, 90);
            context.stroke();

            // Left leg
            context.beginPath();
            context.moveTo(100, 100);
            context.lineTo(80, 130);
            context.stroke();

            // Right leg
            context.beginPath();
            context.moveTo(100, 100);
            context.lineTo(120, 130);
            context.stroke();
            break;
    }
}

// Restart game
restartButton.addEventListener('click', initGame);

// Start the game
initGame();