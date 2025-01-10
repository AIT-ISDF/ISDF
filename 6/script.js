// Level access check
document.addEventListener('DOMContentLoaded', () => {
    // Check level access
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (6 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }

    // Event Listeners
    document.getElementById('play-button').addEventListener('click', () => {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        initializeGame();
        createGrid();
    });

    document.getElementById('restart').addEventListener('click', () => {
        restartGame();
    });

    document.getElementById('restart-over').addEventListener('click', () => {
        restartGame();
    });

    // Prevent context menu from showing on right-click
    document.addEventListener('contextmenu', e => e.preventDefault());
});

// Game Constants
const GRID_SIZE = 10;
const MINE_COUNT = 15;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

// Game Variables
let mineLocations = [];
let cells = [];
let gameOver = false;
let flagsPlaced = 0;
let correctFlags = 0;
let revealedCells = 0;
let timer = 0;
let timerInterval;

// Game Functions
function initializeGame() {
    mineLocations = [];
    cells = [];
    gameOver = false;
    flagsPlaced = 0;
    correctFlags = 0;
    revealedCells = 0;
    timer = 0;
    generateMines();
}

function generateMines() {
    while (mineLocations.length < MINE_COUNT) {
        const position = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
        if (!mineLocations.includes(position)) {
            mineLocations.push(position);
        }
    }
}

function createGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    cells = [];
    gameOver = false;

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleLeftClick);
        cell.addEventListener('contextmenu', handleRightClick);
        gridElement.appendChild(cell);
        cells.push(cell);
    }
    updateFlagsCounter();
    startTimer();
}

function handleLeftClick(event) {
    if (gameOver) return;
    const cell = event.target;
    const index = parseInt(cell.dataset.index);

    if (cell.classList.contains('flag')) return;

    if (mineLocations.includes(index)) {
        gameOver = true;
        revealAllMines();
        showGameOver(false, 'You hit a mine!');
    } else {
        revealCell(index);
    }
}

function handleRightClick(event) {
    event.preventDefault();
    if (gameOver) return;

    const cell = event.target;
    const index = parseInt(cell.dataset.index);
    if (cell.classList.contains('revealed')) return;

    if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.textContent = '';
        flagsPlaced--;
        if (mineLocations.includes(index)) {
            correctFlags--;
        }
    } else if (flagsPlaced < MINE_COUNT) {
        cell.classList.add('flag');
        cell.textContent = 'O';
        flagsPlaced++;
        if (mineLocations.includes(index)) {
            correctFlags++;
            checkWinCondition();
        }
    }
    updateFlagsCounter();
}

function revealCell(index) {
    const cell = cells[index];
    if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

    cell.classList.add('revealed');
    revealedCells++;
    
    const mineCount = countAdjacentMines(index);
    if (mineCount > 0) {
        cell.textContent = mineCount;
        cell.classList.add(`n${mineCount}`);
    } else {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                    const newIndex = newRow * GRID_SIZE + newCol;
                    revealCell(newIndex);
                }
            }
        }
    }
    checkWinCondition();
}

function countAdjacentMines(index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                const checkIndex = newRow * GRID_SIZE + newCol;
                if (mineLocations.includes(checkIndex)) {
                    count++;
                }
            }
        }
    }
    return count;
}

function checkWinCondition() {
    // Win by correctly flagging all mines
    if (correctFlags === MINE_COUNT && flagsPlaced === MINE_COUNT) {
        showGameOver(true, 'You won by correctly flagging all mines!');
        return;
    }

    // Win by revealing all non-mine cells
    const revealedNonMines = revealedCells;
    const totalNonMines = TOTAL_CELLS - MINE_COUNT;
    if (revealedNonMines === totalNonMines) {
        showGameOver(true, 'You won by revealing all safe cells!');
        return;
    }
}

function showGameOver(won, message) {
    clearInterval(timerInterval);
    gameOver = true;

    if (won) {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('level-complete').classList.remove('hidden');
        document.querySelector('.next-level-button').style.display = 'block';
        completeLevel(6);

        // Show correct flags
        mineLocations.forEach(index => {
            const cell = cells[index];
            if (cell.classList.contains('flag')) {
                cell.classList.add('correct-flag');
            }
        });
    } else {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        
        document.getElementById('game-over-text').textContent = 'Game Over!';
        document.getElementById('final-time').textContent = `Time: ${timer}s`;
        document.getElementById('result-message').textContent = message || '';

        revealAllMines();
    }
}

function revealAllMines() {
    mineLocations.forEach(index => {
        const cell = cells[index];
        if (!cell.classList.contains('flag')) {
            cell.classList.add('mine');
            cell.textContent = '💣';
        } else {
            cell.classList.add('correct-flag');
        }
    });

    cells.forEach((cell, index) => {
        if (cell.classList.contains('flag') && !mineLocations.includes(index)) {
            cell.classList.add('wrong-flag');
        }
    });
}

function updateFlagsCounter() {
    document.getElementById('flags-left').textContent = `Flags: ${MINE_COUNT - flagsPlaced}`;
}

function startTimer() {
    clearInterval(timerInterval);
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('time').textContent = `Time: ${timer}s`;
    }, 1000);
}

// Level Navigation Functions
function returnToLevels() {
    window.location.href = '../index.html';
}

function goToNextLevel() {
    window.location.href = '../7/index.html';
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

function restartGame() {
    document.getElementById('level-complete').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.querySelector('.next-level-button').style.display = 'none';
    initializeGame();
    createGrid();
}