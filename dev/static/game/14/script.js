// Check level progress
document.addEventListener('DOMContentLoaded', function() {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (14 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
    initializeGame();
});

// Game Configuration
const GAME_CONFIG = {
    boardSize: 8,
    timeLimit: 180, // 3 minutes
    pieces: {
        player: {
            knights: 3,
            queens: 2
        },
        ai: {
            knights: 3,
            queens: 2
        }
    },
    difficulties: {
        easy: { depth: 2, timePerMove: 1000 },
        medium: { depth: 3, timePerMove: 800 },
        hard: { depth: 4, timePerMove: 600 }
    }
};

// Game State
let gameState = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    selectedPiece: null,
    playerTurn: true,
    difficulty: 'medium',
    remainingTime: GAME_CONFIG.timeLimit,
    playerPieces: { ...GAME_CONFIG.pieces.player },
    aiPieces: { ...GAME_CONFIG.pieces.ai },
    moveHistory: [],
    timer: null,
    gameRunning: false
};

// Initialize Game
function initializeGame() {
    setupEventListeners();
    createBoard();
    updatePieceCount();
}

function setupEventListeners() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    
    // Difficulty selection
    document.querySelectorAll('.difficulty-buttons button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.difficulty-buttons button').forEach(b => 
                b.classList.remove('selected'));
            e.target.classList.add('selected');
            gameState.difficulty = e.target.dataset.difficulty;
        });
    });
}

function createBoard() {
    const board = document.querySelector('.chess-board');
    board.innerHTML = '';

    for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
        for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', () => handleSquareClick(row, col));
            square.addEventListener('dragover', handleDragOver);
            square.addEventListener('drop', (e) => handleDrop(e, row, col));
            board.appendChild(square);
        }
    }
}

function startGame() {
    gameState.gameRunning = true;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');
    startTimer();
}

function startTimer() {
    const timerCircle = document.querySelector('.timer-circle');
    const circumference = 2 * Math.PI * 28; // r=28 from SVG
    timerCircle.style.strokeDasharray = circumference;
    
    gameState.timer = setInterval(() => {
        gameState.remainingTime--;
        updateTimerDisplay();
        
        if (gameState.remainingTime <= 0) {
            gameOver(false);
        }
    }, 1000);
}

// Piece Movement Logic
function isValidMove(piece, startRow, startCol, endRow, endCol) {
    if (piece === 'knight') {
        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    } else if (piece === 'queen') {
        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);
        return rowDiff === colDiff || rowDiff === 0 || colDiff === 0;
    }
    return false;
}

function getAttackedSquares(piece, row, col) {
    const attacked = new Set();
    
    if (piece === 'knight') {
        const moves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        moves.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (isOnBoard(newRow, newCol)) {
                attacked.add(`${newRow},${newCol}`);
            }
        });
    } else if (piece === 'queen') {
        // Horizontal, vertical, and diagonal moves
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        directions.forEach(([dRow, dCol]) => {
            let newRow = row + dRow;
            let newCol = col + dCol;
            while (isOnBoard(newRow, newCol)) {
                attacked.add(`${newRow},${newCol}`);
                newRow += dRow;
                newCol += dCol;
            }
        });
    }
    return attacked;
}

function isOnBoard(row, col) {
    return row >= 0 && row < GAME_CONFIG.boardSize && 
           col >= 0 && col < GAME_CONFIG.boardSize;
}

function handleSquareClick(row, col) {
    if (!gameState.gameRunning || !gameState.playerTurn) return;

    if (gameState.selectedPiece) {
        tryPlacePiece(row, col);
    } else {
        selectPiece(row, col);
    }
}

function tryPlacePiece(row, col) {
    if (!isValidPlacement(row, col)) {
        showValidationModal("Invalid placement! Square is under attack.");
        return;
    }

    placePiece(gameState.selectedPiece, row, col, 'player');
    gameState.selectedPiece = null;
    clearHighlights();
    updatePieceCount();
    
    if (checkWinCondition()) {
        gameOver(true);
    } else {
        gameState.playerTurn = false;
        setTimeout(makeAIMove, GAME_CONFIG.difficulties[gameState.difficulty].timePerMove);
    }
}

function makeAIMove() {
    const move = calculateBestMove(
        gameState.board,
        GAME_CONFIG.difficulties[gameState.difficulty].depth
    );
    
    if (move) {
        placePiece(move.piece, move.row, move.col, 'ai');
        updatePieceCount();
        
        if (checkWinCondition()) {
            gameOver(false);
        } else {
            gameState.playerTurn = true;
        }
    }
}

function calculateBestMove(board, depth) {
    // Minimax algorithm implementation
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
        for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
            if (isValidPlacement(row, col)) {
                // Try placing each available piece
                ['knight', 'queen'].forEach(piece => {
                    if (gameState.aiPieces[piece + 's'] > 0) {
                        board[row][col] = { piece, owner: 'ai' };
                        const score = minimax(board, depth - 1, false);
                        board[row][col] = null;
                        
                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = { piece, row, col };
                        }
                    }
                });
            }
        }
    }
    
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (depth === 0 || checkWinCondition()) {
        return evaluatePosition(board);
    }
    
    if (isMaximizing) {
        let maxScore = -Infinity;
        forEachValidMove(board, 'ai', (row, col, piece) => {
            board[row][col] = { piece, owner: 'ai' };
            maxScore = Math.max(maxScore, minimax(board, depth - 1, false));
            board[row][col] = null;
        });
        return maxScore;
    } else {
        let minScore = Infinity;
        forEachValidMove(board, 'player', (row, col, piece) => {
            board[row][col] = { piece, owner: 'player' };
            minScore = Math.min(minScore, minimax(board, depth - 1, true));
            board[row][col] = null;
        });
        return minScore;
    }
}

function evaluatePosition(board) {
    let score = 0;
    const playerTerritory = calculateTerritory('player');
    const aiTerritory = calculateTerritory('ai');
    
    score += (aiTerritory - playerTerritory) * 10;
    score += countPieces('ai') * 5;
    score -= countPieces('player') * 5;
    
    return score;
}

function calculateTerritory(player) {
    const attacked = new Set();
    
    for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
        for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.owner === player) {
                const squares = getAttackedSquares(piece.piece, row, col);
                squares.forEach(square => attacked.add(square));
            }
        }
    }
    
    return attacked.size;
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.remainingTime / 60);
    const seconds = gameState.remainingTime % 60;
    document.querySelector('.timer-value').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const timerCircle = document.querySelector('.timer-circle');
    const circumference = 2 * Math.PI * 28;
    const offset = circumference * (1 - gameState.remainingTime / GAME_CONFIG.timeLimit);
    timerCircle.style.strokeDashoffset = offset;
}

function updatePieceCount() {
    document.querySelector('.knight span').textContent = 
        `×${gameState.playerPieces.knights}`;
    document.querySelector('.queen span').textContent = 
        `×${gameState.playerPieces.queens}`;
    
    updateTerritoryControl();
}

function updateTerritoryControl() {
    const playerTerritory = calculateTerritory('player');
    const aiTerritory = calculateTerritory('ai');
    const total = GAME_CONFIG.boardSize * GAME_CONFIG.boardSize;
    
    const playerPercentage = (playerTerritory / total) * 100;
    const aiPercentage = (aiTerritory / total) * 100;
    
    document.querySelector('.player-control').style.width = `${playerPercentage}%`;
    document.querySelector('.ai-control').style.width = `${aiPercentage}%`;
    document.querySelector('.control-percentage').textContent = 
        `${Math.round(playerPercentage)}%`;
}

function gameOver(playerWon) {
    clearInterval(gameState.timer);
    gameState.gameRunning = false;
    
    if (playerWon) {
        document.getElementById('winMessage').style.display = 'block';
        document.querySelector('.next-level-button').style.display = 'block';
        completeLevel(14);
    } else {
        document.getElementById('game-board').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

function restartGame() {
    gameState = {
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        selectedPiece: null,
        playerTurn: true,
        difficulty: gameState.difficulty,
        remainingTime: GAME_CONFIG.timeLimit,
        playerPieces: { ...GAME_CONFIG.pieces.player },
        aiPieces: { ...GAME_CONFIG.pieces.ai },
        moveHistory: [],
        timer: null,
        gameRunning: false
    };
    
    clearHighlights();
    updatePieceCount();
    startGame();
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initializeGame);