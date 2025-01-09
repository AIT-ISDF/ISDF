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
    // Update attempts counter
    document.getElementById('attempts').textContent = `Attempts: ${attemptsLeft}`;
    
    // Update current guess display
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

    // Update check button state
    document.getElementById('check-button').disabled = currentGuess.length !== CODE_LENGTH;

    // Update attempts display
    const attemptsContainer = document.getElementById('attempts-container');
    attemptsContainer.innerHTML = '';
    
    // Display all previous attempts
    attempts.forEach(attempt => {
        const attemptRow = document.createElement('div');
        attemptRow.className = 'attempt-row';

        // Create guess pegs
        const pegsDiv = document.createElement('div');
        pegsDiv.className = 'pegs';
        attempt.guess.forEach(color => {
            const peg = document.createElement('div');
            peg.className = 'guess-peg';
            peg.style.background = COLORS[color];
            pegsDiv.appendChild(peg);
        });
        attemptRow.appendChild(pegsDiv);

        // Create feedback pegs
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
    // Create copies of the arrays to not modify the originals
    const codeCopy = [...secretCode];
    const guessCopy = [...currentGuess];

    // First pass: Check for correct position and color (black pegs)
    for (let i = 0; i < CODE_LENGTH; i++) {
        if (guessCopy[i] === codeCopy[i]) {
            feedback.push('black');
            // Mark these positions as checked
            codeCopy[i] = null;
            guessCopy[i] = null;
        }
    }

    // Second pass: Check for correct color but wrong position (white pegs)
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

    // Sort feedback to not give away positions
    feedback.sort((a, b) => {
        if (a === 'black' && b !== 'black') return -1;
        if (b === 'black' && a !== 'black') return 1;
        if (a === 'white' && b === 'empty') return -1;
        if (b === 'white' && a === 'empty') return 1;
        return 0;
    });

    // Store the guess and its feedback
    attempts.push({
        guess: [...currentGuess], // Store a copy of the guess
        feedback: [...feedback]   // Store a copy of the feedback
    });

    attemptsLeft--;

    // Check win condition
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
        document.getElementById('win-screen').classList.remove('hidden');
        createConfetti();
        
        document.getElementById('win-attempts').textContent = 
            `Attempts used: ${MAX_ATTEMPTS - attemptsLeft} of ${MAX_ATTEMPTS}`;
        document.getElementById('win-time').textContent = 
            `Time: ${formatTime(timeTaken)}`;
            
        const secretCodeDiv = document.getElementById('win-secret-code');
        secretCodeDiv.innerHTML = '';
        secretCode.forEach(color => {
            const peg = document.createElement('div');
            peg.className = 'guess-peg';
            peg.style.background = COLORS[color];
            secretCodeDiv.appendChild(peg);
        });
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Start game button
    document.getElementById('start-game').addEventListener('click', startGame);

    // Rules buttons
    document.getElementById('rules-button').addEventListener('click', showRules);
    document.getElementById('in-game-rules').addEventListener('click', showRules);

    // Close rules modal
    document.getElementById('close-rules').addEventListener('click', hideRules);

    // Close modal when clicking outside
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

    // Share score button
    document.getElementById('share-score').addEventListener('click', () => {
        const attempts = MAX_ATTEMPTS - attemptsLeft;
        const time = formatTime(gameEndTime - gameStartTime);
        const text = `I solved Mastermind in ${attempts} attempts and ${time}! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mastermind Score',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text)
                .then(() => alert('Score copied to clipboard!'))
                .catch(() => alert('Unable to copy score'));
        }
    });

    // Allow removing last color by clicking on current guess pegs
    document.querySelector('.current-guess').addEventListener('click', () => {
        if (currentGuess.length > 0) {
            currentGuess.pop();
            updateUI();
        }
    });
});