// Select elements
document.addEventListener('DOMContentLoaded', function() {
    // Check if this level is unlocked
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (1 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
});
const gameStatus = document.getElementById('gameStatus');
const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');
const nextLevelButton = document.querySelector('.next-level-button');
const winMessage = document.getElementById('winMessage');

// Game variables
let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let playerWins = false;

// Winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Messages
const winningMessage = (player) => `Player ${player} has won! 🎉`;
const drawMessage = () => `Game ended in a draw! 🤝`;
const playerTurn = () => `Your turn.`;
const computerTurn = () => `Computer's turn...`;

// Display initial message
gameStatus.innerText = playerTurn();

function handleCellPlayed(clickedCell, index) {
    gameState[index] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add('disabled');
}

function handleResultValidation() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            highlightWinningCells(winCondition);
            if (a === 'X') {
                playerWins = true;
                onGameWin();
            }
            break;
        }
    }

    if (roundWon) {
        gameStatus.innerText = winningMessage(currentPlayer);
        gameActive = false;
        return true;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        gameStatus.innerText = drawMessage();
        gameActive = false;
        return true;
    }

    return false;
}

function findBestMove() {
    // 1. Check if computer can win in the next move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const values = [gameState[a], gameState[b], gameState[c]];
        const oCount = values.filter(v => v === 'O').length;
        const emptyIndex = [a, b, c].find(index => gameState[index] === '');

        if (oCount === 2 && emptyIndex !== undefined) {
            return emptyIndex;
        }
    }

    // 2. Check if player can win in the next move, block them
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const values = [gameState[a], gameState[b], gameState[c]];
        const xCount = values.filter(v => v === 'X').length;
        const emptyIndex = [a, b, c].find(index => gameState[index] === '');

        if (xCount === 2 && emptyIndex !== undefined) {
            return emptyIndex;
        }
    }

    // 3. Take the center if available
    if (gameState[4] === '') {
        return 4;
    }

    // 4. Take a corner if available
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (gameState[corner] === '') {
            return corner;
        }
    }

    // 5. Take any available side
    const sides = [1, 3, 5, 7];
    for (let side of sides) {
        if (gameState[side] === '') {
            return side;
        }
    }

    return -1;
}

function handlePlayerClick(event) {
    const clickedCell = event.target;
    const index = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[index] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    handleCellPlayed(clickedCell, index);
    
    if (handleResultValidation()) {
        return;
    }

    currentPlayer = 'O';
    gameStatus.innerText = computerTurn();

    setTimeout(() => {
        handleComputerTurn();
    }, 500);
}

function handleComputerTurn() {
    if (!gameActive) return;

    const bestMove = findBestMove();
    if (bestMove !== -1) {
        const computerCell = cells[bestMove];
        handleCellPlayed(computerCell, bestMove);
        
        if (handleResultValidation()) {
            return;
        }

        currentPlayer = 'X';
        gameStatus.innerText = playerTurn();
    }
}

function handleRestartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    playerWins = false;
    nextLevelButton.style.display = 'none';
    winMessage.style.display = 'none';
    gameStatus.innerText = playerTurn();
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('disabled', 'win');
    });
}

function highlightWinningCells(winCondition) {
    winCondition.forEach(idx => {
        cells[idx].classList.add('win');
    });
}

function onGameWin() {
    if (playerWins) {
        completeLevel(1);
        nextLevelButton.style.display = 'block';
        winMessage.style.display = 'block';
    }
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
        // Show next level button only after setting the progress
        nextLevelButton.style.display = 'block';
    }
}
function returnToLevels() {
    window.location.href = '../index.html';
}

function goToNextLevel() {
    window.location.href = '../2/index.html?level=2';
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handlePlayerClick));
restartButton.addEventListener('click', handleRestartGame);

// Initialize level progress if not exists
if (!localStorage.getItem('levelProgress')) {
    localStorage.setItem('levelProgress', '1');
}