// Check level progress
document.addEventListener('DOMContentLoaded', function() {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (12 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
    initializeGame();
});

// Game Configuration
const GAME_CONFIG = {
    difficulties: {
        easy: {
            size: 15,
            timeLimit: 300,
            moveLimit: 100
        },
        medium: {
            size: 20,
            timeLimit: 240,
            moveLimit: 150
        },
        hard: {
            size: 25,
            timeLimit: 180,
            moveLimit: 200
        }
    }
};

// Game State
let gameState = {
    maze: [],
    playerPos: { x: 1, y: 1 },
    endPos: { x: 0, y: 0 },
    moves: 0,
    timeRemaining: 300,
    timer: null,
    gameRunning: false,
    difficulty: 'medium',
    visitedCells: new Set(),
    optimalPath: 0
};

// Initialize Game
function initializeGame() {
    setupEventListeners();
    setupDifficultySelection();
}

function setupEventListeners() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.addEventListener('keydown', handleKeyPress);

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

function startGame() {
    const config = GAME_CONFIG.difficulties[gameState.difficulty];
    
    gameState = {
        maze: [],
        playerPos: { x: 1, y: 1 },
        endPos: { x: 0, y: 0 },
        moves: 0,
        timeRemaining: config.timeLimit,
        timer: null,
        gameRunning: true,
        difficulty: gameState.difficulty,
        visitedCells: new Set(),
        optimalPath: 0
    };

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');

    generateMaze(config.size);
    calculateOptimalPath();
    startTimer();
    updateDisplay();
}

function generateMaze(size) {
    // Initialize maze with walls
    gameState.maze = Array(size).fill().map(() => Array(size).fill(1));

    function carve(x, y) {
        gameState.maze[y][x] = 0;

        // Randomize directions
        const directions = [
            [0, -2], // Up
            [2, 0],  // Right
            [0, 2],  // Down
            [-2, 0]  // Left
        ].sort(() => Math.random() - 0.5);

        for (let [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX > 0 && newX < size - 1 && 
                newY > 0 && newY < size - 1 && 
                gameState.maze[newY][newX] === 1) {
                gameState.maze[y + dy/2][x + dx/2] = 0;
                carve(newX, newY);
            }
        }
    }

    // Start carving from position (1,1)
    carve(1, 1);

    // Set start and end positions
    gameState.playerPos = { x: 1, y: 1 };
    gameState.endPos = { x: size - 2, y: size - 2 };
    
    renderMaze();
}

function calculateOptimalPath() {
    const visited = new Set();
    const queue = [{
        x: gameState.playerPos.x,
        y: gameState.playerPos.y,
        steps: 0
    }];

    while (queue.length > 0) {
        const current = queue.shift();
        const key = `${current.x},${current.y}`;

        if (current.x === gameState.endPos.x && current.y === gameState.endPos.y) {
            gameState.optimalPath = current.steps;
            break;
        }

        if (visited.has(key)) continue;
        visited.add(key);

        // Check all four directions
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (let [dx, dy] of directions) {
            const newX = current.x + dx;
            const newY = current.y + dy;

            if (isValidMove(newX, newY)) {
                queue.push({
                    x: newX,
                    y: newY,
                    steps: current.steps + 1
                });
            }
        }
    }
}

function renderMaze() {
    const mazeElement = document.getElementById('maze');
    mazeElement.style.gridTemplateColumns = `repeat(${gameState.maze.length}, 1fr)`;
    mazeElement.innerHTML = '';

    for (let y = 0; y < gameState.maze.length; y++) {
        for (let x = 0; x < gameState.maze.length; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (x === gameState.playerPos.x && y === gameState.playerPos.y) {
                cell.classList.add('player');
            } else if (x === gameState.endPos.x && y === gameState.endPos.y) {
                cell.classList.add('end');
            } else if (gameState.maze[y][x] === 1) {
                cell.classList.add('wall');
            } else if (gameState.visitedCells.has(`${x},${y}`)) {
                cell.classList.add('visited');
            }

            mazeElement.appendChild(cell);
        }
    }
}

function handleKeyPress(e) {
    if (!gameState.gameRunning) return;

    let dx = 0, dy = 0;

    switch(e.key) {
        case 'ArrowUp':
            dy = -1;
            break;
        case 'ArrowDown':
            dy = 1;
            break;
        case 'ArrowLeft':
            dx = -1;
            break;
        case 'ArrowRight':
            dx = 1;
            break;
        default:
            return;
    }

    movePlayer(dx, dy);
}

function movePlayer(dx, dy) {
    const newX = gameState.playerPos.x + dx;
    const newY = gameState.playerPos.y + dy;

    if (isValidMove(newX, newY)) {
        gameState.visitedCells.add(`${gameState.playerPos.x},${gameState.playerPos.y}`);
        gameState.playerPos = { x: newX, y: newY };
        gameState.moves++;
        
        updateDisplay();
        renderMaze();

        if (newX === gameState.endPos.x && newY === gameState.endPos.y) {
            winGame();
        }
    }
}

function isValidMove(x, y) {
    return x >= 0 && x < gameState.maze.length &&
           y >= 0 && y < gameState.maze.length &&
           gameState.maze[y][x] !== 1;
}

function startTimer() {
    clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        if (gameState.timeRemaining > 0) {
            gameState.timeRemaining--;
            updateDisplay();
            
            if (gameState.timeRemaining === 0) {
                gameOver('Time\'s up!');
            }
        }
    }, 1000);
}

function updateDisplay() {
    // Update moves
    document.getElementById('moves').textContent = gameState.moves;

    // Update timer
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function calculateEfficiency() {
    const moveEfficiency = Math.max(0, 1 - (gameState.moves - gameState.optimalPath) / gameState.optimalPath);
    const timeEfficiency = gameState.timeRemaining / GAME_CONFIG.difficulties[gameState.difficulty].timeLimit;
    return Math.round((moveEfficiency * 0.6 + timeEfficiency * 0.4) * 100);
}

function winGame() {
    gameState.gameRunning = false;
    clearInterval(gameState.timer);

    const efficiency = calculateEfficiency();
    const timeBonus = gameState.timeRemaining * 10;

    document.getElementById('efficiency-rating').textContent = `${efficiency}%`;
    document.getElementById('total-moves').textContent = gameState.moves;
    document.getElementById('time-bonus').textContent = `+${timeBonus}`;

    document.getElementById('winMessage').style.display = 'block';
    document.querySelector('.next-level-button').style.display = 'block';

    completeLevel(12);
}

function gameOver(message) {
    gameState.gameRunning = false;
    clearInterval(gameState.timer);

    document.getElementById('game-board').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');
    
    document.getElementById('final-moves').textContent = gameState.moves;
    document.getElementById('time-elapsed').textContent = formatTime(
        GAME_CONFIG.difficulties[gameState.difficulty].timeLimit - gameState.timeRemaining
    );
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

function restartGame() {
    startGame();
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initializeGame);