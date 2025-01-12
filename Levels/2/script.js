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
let gameActive = true;

// Select elements
const wordDisplay = document.getElementById('wordDisplay');
const messageDisplay = document.getElementById('message');
const alphabetDiv = document.getElementById('alphabet');
const restartButton = document.getElementById('restartButton');
const canvas = document.getElementById('hangmanCanvas');
const context = canvas.getContext('2d');
const nextLevelButton = document.querySelector('.next-level-button');
const winMessage = document.getElementById('winMessage');

// Check level access when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if this level is unlocked
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (2 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
    
    // Start the game
    initGame();
});

// Initialize game
function initGame() {
    // Reset variables
    mistakes = 0;
    guessedLetters = [];
    messageDisplay.textContent = '';
    gameActive = true;
    
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Hide win message and next level button
    winMessage.style.display = 'none';
    nextLevelButton.style.display = 'none';

    // Draw the base line for hangman
    context.beginPath();
    context.moveTo(20, 180);
    context.lineTo(180, 180);
    context.strokeStyle = '#333';
    context.lineWidth = 2;
    context.stroke();

    // Randomly select a word
    chosenWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

    // Display word with underscores
    displayWord();

    // Create alphabet buttons
    createAlphabetButtons();

    // Enable all alphabet buttons
    const buttons = alphabetDiv.getElementsByTagName('button');
    for (let button of buttons) {
        button.disabled = false;
    }

    // Reset message display
    messageDisplay.style.color = '#333';
}

// Display the word with guessed letters and underscores
function displayWord() {
    const display = chosenWord
        .split('')
        .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
        .join(' ');

    wordDisplay.textContent = display;

    // Check for win condition
    if (gameActive && !display.includes('_')) {
        gameActive = false;
        messageDisplay.textContent = 'You won! 🎉';
        messageDisplay.style.color = '#4CAF50';
        disableAlphabet();
        completeLevel(2);
        winMessage.style.display = 'block';
        nextLevelButton.style.display = 'block';
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
    if (!gameActive) return;

    const letter = event.target.textContent;
    event.target.disabled = true;

    if (chosenWord.includes(letter)) {
        guessedLetters.push(letter);
        displayWord();
    } else {
        mistakes++;
        updateHangman();
        if (mistakes === maxMistakes) {
            gameActive = false;
            messageDisplay.textContent = `You lost! The word was: ${chosenWord}`;
            messageDisplay.style.color = '#ff3333';
            displayWord();
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

// Level completion and navigation functions
function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

function returnToLevels() {
    window.location.href = '../index.html';
}

function goToNextLevel() {
    window.location.href = '../3/index.html';
}

// Event listeners
restartButton.addEventListener('click', initGame);