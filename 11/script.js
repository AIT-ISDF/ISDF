const BOARD_SIZE = 5;
let moves = 0;
let gameBoard = [];

function createBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameBoard = [];
    moves = 0;
    updateMovesCounter();

    // Create the initial board state
    for (let i = 0; i < BOARD_SIZE; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            gameBoard[i][j] = false;
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }

    // Randomize the initial state
    randomizeBoard();
}

function randomizeBoard() {
    for (let i = 0; i < BOARD_SIZE * 2; i++) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        toggleLights(row, col);
    }
}

function toggleLights(row, col) {
    const positions = [
        [row, col],
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1]
    ];

    positions.forEach(([r, c]) => {
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            gameBoard[r][c] = !gameBoard[r][c];
            const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            cell.classList.toggle('on');
        }
    });
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    toggleLights(row, col);
    moves++;
    updateMovesCounter();
    checkWin();
}

function updateMovesCounter() {
    document.getElementById('movesCounter').textContent = `Moves: ${moves}`;
}

function checkWin() {
    const hasWon = gameBoard.every(row => row.every(cell => !cell));
    if (hasWon) {
        document.getElementById('finalMoves').textContent = moves;
        document.getElementById('gameBoard').style.display = 'none';
        document.getElementById('movesCounter').style.display = 'none';
        document.getElementById('rulesBtn').style.display = 'none';
        document.getElementById('congratsScreen').style.display = 'block';
    }
}

function startGame() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'grid';
    document.getElementById('rulesBtn').style.display = 'inline-block';
    createBoard();
}

function restartGame() {
    document.getElementById('congratsScreen').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'grid';
    document.getElementById('movesCounter').style.display = 'block';
    document.getElementById('rulesBtn').style.display = 'inline-block';
    createBoard();
}

function showRules() {
    alert(`Rules:\n\n1. Click on cells to toggle lights\n2. Clicking a cell toggles its state and its adjacent cells\n3. Turn off all lights to win the game\n4. Try to win in minimum moves possible!`);
}
function resetGame() {
    // Add visual feedback for reset
    const board = document.getElementById('gameBoard');
    board.classList.add('reset-flash');
    
    // Remove the animation class after it completes
    setTimeout(() => {
        board.classList.remove('reset-flash');
    }, 300);

    // Reset moves counter
    moves = 0;
    updateMovesCounter();

    // Clear the board
    gameBoard = gameBoard.map(row => row.map(() => false));
    
    // Update visual state
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('on');
    });

    // Create new random pattern
    randomizeBoard();
}

// Modify the startGame function to show game controls
function startGame() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'grid';
    document.getElementById('gameControls').style.display = 'flex';
    createBoard();
}

// Modify the restartGame function to show game controls
function restartGame() {
    document.getElementById('congratsScreen').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'grid';
    document.getElementById('movesCounter').style.display = 'block';
    document.getElementById('gameControls').style.display = 'flex';
    createBoard();
}

// Modify the checkWin function to hide game controls on win
function checkWin() {
    const hasWon = gameBoard.every(row => row.every(cell => !cell));
    if (hasWon) {
        document.getElementById('finalMoves').textContent = moves;
        document.getElementById('gameBoard').style.display = 'none';
        document.getElementById('movesCounter').style.display = 'none';
        document.getElementById('gameControls').style.display = 'none';
        document.getElementById('congratsScreen').style.display = 'block';
    }
}