// Check level progress
document.addEventListener('DOMContentLoaded', function() {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (13 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
    initializeGame();
});

// Game Configuration
const GAME_CONFIG = {
    timeLimit: 300, // 5 minutes in seconds
    gridSize: 15,
    maxHints: 3,
    words: [
        {
            word: "ALGORITHM",
            clue: "Step-by-step procedure for calculations",
            direction: "across",
            startX: 3,
            startY: 2
        },
        {
            word: "DATABASE",
            clue: "Organized collection of data",
            direction: "down",
            startX: 5,
            startY: 1
        },
        {
            word: "FUNCTION",
            clue: "Named block of reusable code",
            direction: "across",
            startX: 2,
            startY: 5
        },
        {
            word: "VARIABLE",
            clue: "Named storage location",
            direction: "down",
            startX: 8,
            startY: 3
        },
        {
            word: "INTERFACE",
            clue: "Point of interaction between components",
            direction: "across",
            startX: 1,
            startY: 8
        }
    ],
    pointsPerWord: 100,
    timeBonus: 10, // points per second remaining
};

// Game State
let gameState = {
    running: false,
    timeRemaining: GAME_CONFIG.timeLimit,
    hintsRemaining: GAME_CONFIG.maxHints,
    score: 0,
    solvedWords: [],
    selectedWord: null,
    timer: null,
    currentLetters: [],
    gridState: Array(GAME_CONFIG.gridSize).fill(null).map(() => 
        Array(GAME_CONFIG.gridSize).fill({ letter: '', solved: false }))
};

// Initialize Game
function initializeGame() {
    setupEventListeners();
    createGrid();
    createClues();
    shuffleWords();
}

function setupEventListeners() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('confirm-hint').addEventListener('click', useHint);
    document.getElementById('cancel-hint').addEventListener('click', closeHintModal);
}

function createGrid() {
    const grid = document.querySelector('.word-grid');
    grid.innerHTML = '';

    for (let y = 0; y < GAME_CONFIG.gridSize; y++) {
        for (let x = 0; x < GAME_CONFIG.gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', () => handleCellClick(x, y));
            grid.appendChild(cell);
        }
    }
}

function createClues() {
    const acrossClues = document.getElementById('across-clues');
    const downClues = document.getElementById('down-clues');
    
    acrossClues.innerHTML = '';
    downClues.innerHTML = '';

    GAME_CONFIG.words.forEach((word, index) => {
        const clueElement = document.createElement('div');
        clueElement.className = 'clue-item';
        clueElement.dataset.wordIndex = index;
        clueElement.textContent = `${index + 1}. ${word.clue}`;
        clueElement.addEventListener('click', () => selectWord(index));

        if (word.direction === 'across') {
            acrossClues.appendChild(clueElement);
        } else {
            downClues.appendChild(clueElement);
        }
    });
}

function shuffleWords() {
    GAME_CONFIG.words.forEach(word => {
        word.scrambled = shuffleString(word.word);
    });
}

function shuffleString(str) {
    return str.split('')
        .sort(() => Math.random() - 0.5)
        .join('');
}

function startGame() {
    gameState.running = true;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');
    
    startTimer();
    displayScrambledWords();
}

function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 0) {
            gameOver(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    document.querySelector('.timer-value').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function displayScrambledWords() {
    const letterBank = document.querySelector('.letter-tiles');
    letterBank.innerHTML = '';

    GAME_CONFIG.words.forEach(word => {
        if (!gameState.solvedWords.includes(word.word)) {
            const wordContainer = document.createElement('div');
            wordContainer.className = 'scrambled-word';
            
            word.scrambled.split('').forEach(letter => {
                const tile = createLetterTile(letter);
                wordContainer.appendChild(tile);
            });
            
            letterBank.appendChild(wordContainer);
        }
    });
}

function createLetterTile(letter) {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.textContent = letter;
    tile.draggable = true;
    tile.addEventListener('dragstart', handleDragStart);
    tile.addEventListener('dragend', handleDragEnd);
    return tile;
}

function handleCellClick(x, y) {
    if (!gameState.running) return;

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell.classList.contains('fixed')) return;

    if (gameState.selectedWord) {
        // Handle letter placement
        placeLetter(x, y);
    }
}

function selectWord(wordIndex) {
    if (!gameState.running) return;

    gameState.selectedWord = GAME_CONFIG.words[wordIndex];
    highlightSelectedWord();
}

function highlightSelectedWord() {
    // Remove previous highlights
    document.querySelectorAll('.grid-cell.active').forEach(cell => {
        cell.classList.remove('active');
    });

    if (!gameState.selectedWord) return;

    const { startX, startY, direction, word } = gameState.selectedWord;
    const length = word.length;

    for (let i = 0; i < length; i++) {
        const x = direction === 'across' ? startX + i : startX;
        const y = direction === 'across' ? startY : startY + i;
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) cell.classList.add('active');
    }
}

function placeLetter(x, y) {
    if (!gameState.currentLetters.length) return;

    const letter = gameState.currentLetters[0];
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    
    cell.textContent = letter;
    gameState.gridState[y][x].letter = letter;
    
    checkWordCompletion();
}

function checkWordCompletion() {
    if (!gameState.selectedWord) return;

    const { startX, startY, direction, word } = gameState.selectedWord;
    let currentWord = '';

    for (let i = 0; i < word.length; i++) {
        const x = direction === 'across' ? startX + i : startX;
        const y = direction === 'across' ? startY : startY + i;
        currentWord += gameState.gridState[y][x].letter;
    }

    if (currentWord === word) {
        handleWordSolved(word);
    }
}

function handleWordSolved(word) {
    gameState.solvedWords.push(word);
    gameState.score += GAME_CONFIG.pointsPerWord;
    updateScore();

    // Mark cells as solved
    const wordConfig = GAME_CONFIG.words.find(w => w.word === word);
    markWordAsSolved(wordConfig);

    if (gameState.solvedWords.length === GAME_CONFIG.words.length) {
        gameOver(true);
    }
}

function markWordAsSolved(wordConfig) {
    const { startX, startY, direction, word } = wordConfig;
    
    for (let i = 0; i < word.length; i++) {
        const x = direction === 'across' ? startX + i : startX;
        const y = direction === 'across' ? startY : startY + i;
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        cell.classList.add('solved');
        gameState.gridState[y][x].solved = true;
    }

    // Mark clue as solved
    const clueElement = document.querySelector(`.clue-item[data-word-index="${GAME_CONFIG.words.indexOf(wordConfig)}"]`);
    clueElement.classList.add('solved');
}

function useHint() {
    if (gameState.hintsRemaining <= 0 || !gameState.selectedWord) return;

    gameState.hintsRemaining--;
    document.querySelector('.hints-value').textContent = gameState.hintsRemaining;

    // Reveal a random unsolved letter
    revealHintLetter();
    closeHintModal();
}

function revealHintLetter() {
    const { startX, startY, direction, word } = gameState.selectedWord;
    const unsolvedIndices = [];

    for (let i = 0; i < word.length; i++) {
        const x = direction === 'across' ? startX + i : startX;
        const y = direction === 'across' ? startY : startY + i;
        if (!gameState.gridState[y][x].solved) {
            unsolvedIndices.push(i);
        }
    }

    if (unsolvedIndices.length > 0) {
        const randomIndex = unsolvedIndices[Math.floor(Math.random() * unsolvedIndices.length)];
        const x = direction === 'across' ? startX + randomIndex : startX;
        const y = direction === 'across' ? startY : startY + randomIndex;
        
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        cell.textContent = word[randomIndex];
        gameState.gridState[y][x].letter = word[randomIndex];
        gameState.gridState[y][x].solved = true;
        cell.classList.add('hint');
    }
}

function gameOver(isWin) {
    clearInterval(gameState.timer);
    gameState.running = false;

    if (isWin) {
        const timeBonus = gameState.timeRemaining * GAME_CONFIG.timeBonus;
        gameState.score += timeBonus;
        
        document.getElementById('accuracy-rating').textContent = 
            `${Math.round((gameState.solvedWords.length / GAME_CONFIG.words.length) * 100)}%`;
        document.getElementById('time-bonus').textContent = `+${timeBonus}`;
        document.getElementById('win-score').textContent = gameState.score;
        
        document.getElementById('winMessage').style.display = 'block';
        document.querySelector('.next-level-button').style.display = 'block';
        completeLevel(13);
    } else {
        document.getElementById('words-completed').textContent = gameState.solvedWords.length;
        document.getElementById('time-elapsed').textContent = 
            `${Math.floor((GAME_CONFIG.timeLimit - gameState.timeRemaining) / 60)}:${((GAME_CONFIG.timeLimit - gameState.timeRemaining) % 60).toString().padStart(2, '0')}`;
        document.getElementById('final-score').textContent = gameState.score;
        
        document.getElementById('game-board').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
}

function updateScore() {
    document.querySelector('.score-value').textContent = gameState.score;
}

function restartGame() {
    gameState = {
        running: false,
        timeRemaining: GAME_CONFIG.timeLimit,
        hintsRemaining: GAME_CONFIG.maxHints,
        score: 0,
        solvedWords: [],
        selectedWord: null,
        timer: null,
        currentLetters: [],
        gridState: Array(GAME_CONFIG.gridSize).fill(null).map(() => 
            Array(GAME_CONFIG.gridSize).fill({ letter: '', solved: false }))
    };

    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.textContent = '';
        cell.className = 'grid-cell';
    });

    document.querySelectorAll('.clue-item').forEach(clue => {
        clue.classList.remove('solved');
    });

    startGame();
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initializeGame);