// First check level access
document.addEventListener('DOMContentLoaded', () => {
    // Check level access
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (7 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
    setupGame();
});

const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Turquoise
    '#FFD93D', // Yellow
    '#95A5A6', // Gray
    '#6C5CE7', // Purple
    '#A8E6CF'  // Mint
];

const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

let secretCode = [];
let currentGuess = [];
let attempts = [];
let attemptsLeft = MAX_ATTEMPTS;
let gameStartTime;
let gameEndTime;

function initializeGame() {
    secretCode = [];
    currentGuess = [];
    attempts = [];
    attemptsLeft = MAX_ATTEMPTS;
    gameStartTime = new Date();
    generateSecretCode();
    updateUI();
}

function generateSecretCode() {
    secretCode = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
        secretCode.push(Math.floor(Math.random() * COLORS.length));
    }
    console.log('Secret Code:', secretCode); // For debugging
}

function updateUI() {
    document.getElementById('attempts').textContent = `Attempts: ${attemptsLeft}`;
    
    const currentGuessPegs = document.querySelectorAll('.current-guess .guess-peg');
    currentGuessPegs.forEach((peg, index) => {
        if (currentGuess[index] !== undefined) {
            peg.style.background = COLORS[currentGuess[index]];
            peg.classList.remove('empty');
        } else {
            peg.style.background = '';
            peg.classList.add('empty');
        }
    });

    document.getElementById('check-button').disabled = currentGuess.length !== CODE_LENGTH;

    const attemptsContainer = document.getElementById('attempts-container');
    attemptsContainer.innerHTML = '';
    
    attempts.forEach(attempt => {
        const attemptRow = document.createElement('div');
        attemptRow.className = 'attempt-row';

        const pegsDiv = document.createElement('div');
        pegsDiv.className = 'pegs';
        attempt.guess.forEach(color => {
            const peg = document.createElement('div');
            peg.className = 'guess-peg';
            peg.style.background = COLORS[color];
            pegsDiv.appendChild(peg);
        });
        attemptRow.appendChild(pegsDiv);

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback';
        attempt.feedback.forEach(fb => {
            const peg = document.createElement('div');
            peg.className = `feedback-peg ${fb}`;
            feedbackDiv.appendChild(peg);
        });
        attemptRow.appendChild(feedbackDiv);

        attemptsContainer.appendChild(attemptRow);
    });
}

function checkGuess() {
    const feedback = [];
    const codeCopy = [...secretCode];
    const guessCopy = [...currentGuess];

    for (let i = 0; i < CODE_LENGTH; i++) {
        if (guessCopy[i] === codeCopy[i]) {
            feedback.push('black');
            codeCopy[i] = null;
            guessCopy[i] = null;
        }
    }

    for (let i = 0; i < CODE_LENGTH; i++) {
        if (guessCopy[i] !== null) {
            const colorIndex = codeCopy.findIndex(color => color === guessCopy[i]);
            if (colorIndex !== -1) {
                feedback.push('white');
                codeCopy[colorIndex] = null;
            } else {
                feedback.push('empty');
            }
        }
    }

    feedback.sort((a, b) => {
        if (a === 'black' && b !== 'black') return -1;
        if (b === 'black' && a !== 'black') return 1;
        if (a === 'white' && b === 'empty') return -1;
        if (b === 'white' && a === 'empty') return 1;
        return 0;
    });

    attempts.push({
        guess: [...currentGuess],
        feedback: [...feedback]
    });

    attemptsLeft--;

    const blackPegs = feedback.filter(f => f === 'black').length;
    if (blackPegs === CODE_LENGTH) {
        showGameOver(true);
    } else if (attemptsLeft === 0) {
        showGameOver(false);
    }

    currentGuess = [];
    updateUI();
}

function showGameOver(won) {
    gameEndTime = new Date();
    const timeTaken = gameEndTime - gameStartTime;
    
    if (won) {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('levelWinMessage').style.display = 'block';
        document.querySelector('.next-level-button').style.display = 'block';
        completeLevel(7);
        createConfetti();
    } else {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        
        document.getElementById('game-over-text').textContent = 'Game Over!';
        document.getElementById('attempts-used').textContent = 'You ran out of attempts!';
        
        const secretCodeDiv = document.getElementById('secret-code');
        secretCodeDiv.innerHTML = '';
        secretCode.forEach(color => {
            const peg = document.createElement('div');
            peg.className = 'guess-peg';
            peg.style.background = COLORS[color];
            secretCodeDiv.appendChild(peg);
        });
    }
}

function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        confettiContainer.appendChild(confetti);
    }
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Level navigation functions

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

function setupGame() {
    // Start game button
    document.getElementById('start-game').addEventListener('click', startGame);

    // Rules buttons
    document.getElementById('rules-button').addEventListener('click', showRules);
    document.getElementById('in-game-rules').addEventListener('click', showRules);
    document.getElementById('close-rules').addEventListener('click', hideRules);

    // Rules modal outside click
    document.getElementById('rules-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('rules-modal')) {
            hideRules();
        }
    });

    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            if (currentGuess.length < CODE_LENGTH) {
                currentGuess.push(parseInt(option.dataset.color));
                updateUI();
            }
        });
    });

    // Check button
    document.getElementById('check-button').addEventListener('click', checkGuess);

    // Restart buttons
    document.getElementById('restart').addEventListener('click', initializeGame);
    document.getElementById('restart-over').addEventListener('click', () => {
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        initializeGame();
    });
    document.getElementById('play-again-win').addEventListener('click', () => {
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        initializeGame();
    });

    // Current guess click to remove
    document.querySelector('.current-guess').addEventListener('click', () => {
        if (currentGuess.length > 0) {
            currentGuess.pop();
            updateUI();
        }
    });
}

function showRules() {
    document.getElementById('rules-modal').classList.remove('hidden');
}

function hideRules() {
    document.getElementById('rules-modal').classList.add('hidden');
}

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initializeGame();
}