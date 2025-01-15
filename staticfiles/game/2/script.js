// Check level progress
document.addEventListener('DOMContentLoaded', function() {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (2 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
    initializeGame();
});

// Game Configuration
const GAME_CONFIG = {
    words: [
        {
            word: "OBFUSCATION",
            hint: "The act of making something unclear or difficult to understand",
            display: "O_F__C_T__N"
        },
        {
            word: "NONCE",
            hint: "A number used only once in cryptographic communication",
            display: "N_N_E"
        },
        {
            word: "STEGANOGRAPHY",
            hint: "The practice of concealing messages within other data",
            display: "ST_G_N_GR__HY"
        }
    ],
    timeLimit: 300, // 5 minutes
    pointsPerWord: 100,
    timeBonus: 10, // points per second remaining
    maxAttempts: 5 // per word
};

// Game State
let gameState = {
    currentWordIndex: 0,
    attempts: 0,
    score: 0,
    timeRemaining: GAME_CONFIG.timeLimit,
    timer: null,
    gameRunning: false,
    hintsUsed: 0
};

function initializeGame() {
    setupEventListeners();
    resetGameState();
}

function setupEventListeners() {
    // Input field enter key handler
    document.getElementById('guess-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });

    // Input field focus handler
    document.getElementById('guess-input').addEventListener('focus', function() {
        this.classList.remove('error');
    });
}

function resetGameState() {
    gameState = {
        currentWordIndex: 0,
        attempts: 0,
        score: 0,
        timeRemaining: GAME_CONFIG.timeLimit,
        timer: null,
        gameRunning: true,
        hintsUsed: 0
    };

    loadCurrentWord();
    startTimer();
    updateDisplay();
}

function loadCurrentWord() {
    const currentWord = GAME_CONFIG.words[gameState.currentWordIndex];
    document.getElementById('word-display').textContent = currentWord.display;
    document.getElementById('hint').textContent = currentWord.hint;
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').maxLength = currentWord.word.length;
}

function startTimer() {
    clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        if (gameState.timeRemaining > 0) {
            gameState.timeRemaining--;
            updateTimerDisplay();
            
            if (gameState.timeRemaining === 0) {
                gameOver(false);
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function checkGuess() {
    if (!gameState.gameRunning) return;

    const input = document.getElementById('guess-input').value.toUpperCase();
    const currentWord = GAME_CONFIG.words[gameState.currentWordIndex].word;
    const message = document.getElementById('message');
    const inputField = document.getElementById('guess-input');

    // Check word length
    if (input.length !== currentWord.length) {
        message.textContent = `The word should be ${currentWord.length} letters long!`;
        message.className = 'message error';
        inputField.classList.add('error');
        return;
    }

    gameState.attempts++;
    updateDisplay();

    if (input === currentWord) {
        handleCorrectGuess();
    } else {
        handleIncorrectGuess();
    }
}

function handleCorrectGuess() {
    const message = document.getElementById('message');
    message.textContent = "Correct! Well done!";
    message.className = 'message success';

    // Calculate points
    const attemptBonus = Math.max(0, GAME_CONFIG.pointsPerWord - (gameState.attempts * 10));
    gameState.score += GAME_CONFIG.pointsPerWord + attemptBonus;

    gameState.currentWordIndex++;
    gameState.attempts = 0;

    if (gameState.currentWordIndex < GAME_CONFIG.words.length) {
        setTimeout(() => {
            loadCurrentWord();
            message.className = 'message';
        }, 1500);
    } else {
        gameOver(true);
    }

    updateDisplay();
}

function handleIncorrectGuess() {
    const message = document.getElementById('message');
    message.textContent = "Incorrect. Try again!";
    message.className = 'message error';

    if (gameState.attempts >= GAME_CONFIG.maxAttempts) {
        gameOver(false);
    }
}

function showHint() {
    if (!gameState.gameRunning) return;

    const currentWord = GAME_CONFIG.words[gameState.currentWordIndex].word;
    const message = document.getElementById('message');
    
    gameState.hintsUsed++;
    message.textContent = `Word Length: ${currentWord.length} letters`;
    message.className = 'message';
}

function gameOver(isWin) {
    gameState.gameRunning = false;
    clearInterval(gameState.timer);

    if (isWin) {
        showWinScreen();
    } else {
        showGameOverScreen();
    }
}

function showWinScreen() {
    const timeBonus = gameState.timeRemaining * GAME_CONFIG.timeBonus;
    const finalScore = gameState.score + timeBonus;
    const accuracy = calculateAccuracy();

    document.getElementById('accuracy-rating').textContent = `${accuracy}%`;
    document.getElementById('time-bonus').textContent = `+${timeBonus}`;
    document.getElementById('final-score').textContent = finalScore;

    document.getElementById('winMessage').style.display = 'block';
    document.querySelector('.next-level-button').style.display = 'block';

    completeLevel(2);
}

function showGameOverScreen() {
    const message = document.getElementById('message');
    message.textContent = "Game Over! Too many attempts or time's up!";
    message.className = 'message error';
    
    document.getElementById('guess-input').disabled = true;
}

function calculateAccuracy() {
    const totalAttempts = gameState.attempts + (gameState.currentWordIndex * GAME_CONFIG.maxAttempts);
    const minPossibleAttempts = GAME_CONFIG.words.length;
    return Math.round((minPossibleAttempts / Math.max(totalAttempts, 1)) * 100);
}

function updateDisplay() {
    document.getElementById('attempts').textContent = gameState.attempts;
    document.getElementById('score').textContent = gameState.score;
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initializeGame);