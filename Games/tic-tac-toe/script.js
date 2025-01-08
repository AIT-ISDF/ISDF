// Select elements
const gameStatus = document.getElementById('gameStatus');
const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');

// Game variables
let gameActive = true;
let currentPlayer = 'X'; // Player is always 'X', computer is 'O'
let gameState = ['', '', '', '', '', '', '', '', ''];

// Winning conditions
const winningConditions = [
    [0, 1, 2],  // Top row
    [3, 4, 5],  // Middle row
    [6, 7, 8],  // Bottom row
    [0, 3, 6],  // First column
    [1, 4, 7],  // Second column
    [2, 5, 8],  // Third column
    [0, 4, 8],  // Diagonal from top-left
    [2, 4, 6]   // Diagonal from top-right
];

// Messages
const winningMessage = (player) => `Player ${player} has won! 🎉`;
const drawMessage = () => `Game ended in a draw! 🤝`;
const playerTurn = () => `Your turn.`;
const computerTurn = () => `Computer's turn...`;

// Display initial message
gameStatus.innerText = playerTurn();

// Functions

function handleCellPlayed(clickedCell, index) {
    gameState[index] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add('disabled'); // Prevent clicking again
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
            break;
        }
    }

    if (roundWon) {
        gameStatus.innerText = winningMessage(currentPlayer);
        gameActive = false;
        return true;
    }

    // Check for draw
    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        gameStatus.innerText = drawMessage();
        gameActive = false;
        return true;
    }

    return false;
}

function handlePlayerClick(event) {
    const clickedCell = event.target;
    const index = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[index] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    handleCellPlayed(clickedCell, index);

    const isGameOver = handleResultValidation();
    if (isGameOver) return;

    // Switch to computer's turn
    currentPlayer = 'O';
    gameStatus.innerText = computerTurn();

    setTimeout(() => {
        handleComputerTurn();
    }, 500); // Delay for realism
}

function handleComputerTurn() {
    if (!gameActive) return;

    const bestMove = findBestMove();
    const computerCell = cells[bestMove];

    handleCellPlayed(computerCell, bestMove);

    const isGameOver = handleResultValidation();
    if (isGameOver) return;

    // Switch back to player's turn
    currentPlayer = 'X';
    gameStatus.innerText = playerTurn();
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
    for (let i = 0; i < corners.length; i++) {
        if (gameState[corners[i]] === '') {
            return corners[i];
        }
    }

    // 5. Take any available side
    const sides = [1, 3, 5, 7];
    for (let i = 0; i < sides.length; i++) {
        if (gameState[sides[i]] === '') {
            return sides[i];
        }
    }

    // If no moves left, return -1 (should not reach here)
    return -1;
}

function handleRestartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
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

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handlePlayerClick));
restartButton.addEventListener('click', handleRestartGame);