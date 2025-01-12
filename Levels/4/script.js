// script.js
document.addEventListener('DOMContentLoaded', function() {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (4 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
});
// Get DOM elements
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const gameCanvas = document.getElementById('game-canvas');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScore = document.getElementById('final-score');
const ctx = gameCanvas.getContext('2d');

// Game variables
let gameLoop;
let distanceInterval; // New variable to store distance interval
let distance = 0;
const maxDistance = 200; // Changed from 1000 to 200
let obstacles = [];
let bird = {
    x: 150,
    y: 250,
    width: 40,
    height: 40,
    speed: 5
};

// Set canvas size
gameCanvas.width = 800;
gameCanvas.height = 600;

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Key controls
let keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function startGame() {
    // Hide start screen and show canvas
    startScreen.classList.add('hidden');
    gameCanvas.style.display = 'block';
    gameOverScreen.classList.add('hidden');

    // Reset game variables
    distance = 0;
    obstacles = [];
    bird.y = 250;

    // Start game loop
    gameLoop = setInterval(update, 1000 / 60);
    
    // Start distance counter
    distanceInterval = setInterval(() => {
        distance++;
        // Check if player has won
        if (distance >= maxDistance) {
            gameOver(true); // Pass true to indicate a win
        }
    }, 1000);

    // Start spawning obstacles
    setInterval(spawnObstacle, 2000);
}

function spawnObstacle() {
    const gap = 200;
    const minHeight = 50;
    const maxHeight = gameCanvas.height - gap - minHeight;
    const height1 = Math.random() * (maxHeight - minHeight) + minHeight;

    obstacles.push({
        x: gameCanvas.width,
        y: 0,
        width: 50,
        height: height1
    });

    obstacles.push({
        x: gameCanvas.width,
        y: height1 + gap,
        width: 50,
        height: gameCanvas.height - height1 - gap
    });
}

function update() {
    // Move bird
    if (keys['ArrowUp']) {
        bird.y -= bird.speed;
    }
    if (keys['ArrowDown']) {
        bird.y += bird.speed;
    }

    // Keep bird in bounds
    if (bird.y < 0) bird.y = 0;
    if (bird.y + bird.height > gameCanvas.height) {
        bird.y = gameCanvas.height - bird.height;
    }

    // Move obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= 2;
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Check collisions
    obstacles.forEach(obstacle => {
        if (checkCollision(bird, obstacle)) {
            gameOver(false); // Pass false to indicate a loss
        }
    });

    // Draw everything
    draw();
}

function checkCollision(bird, obstacle) {
    return bird.x < obstacle.x + obstacle.width &&
           bird.x + bird.width > obstacle.x &&
           bird.y < obstacle.y + obstacle.height &&
           bird.y + bird.height > obstacle.y;
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw obstacles
    ctx.fillStyle = 'green';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw distance
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Distance: ${distance}/${maxDistance}`, 10, 30); // Modified to show progress
}
function returnToLevels() {
    window.location.href = '../index.html';
}

function goToNextLevel() {
    window.location.href = '../5/index.html';
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

function gameOver(isWin) {
    // Clear all intervals
    clearInterval(gameLoop);
    clearInterval(distanceInterval);
    
    if (isWin) {
        // Show win message and complete level
        document.getElementById('winMessage').style.display = 'block';
        document.querySelector('.next-level-button').style.display = 'block';
        completeLevel(4);
    } else {
        // Show game over screen
        gameCanvas.style.display = 'none';
        gameOverScreen.classList.remove('hidden');
        const gameOverTitle = gameOverScreen.querySelector('h2');
        gameOverTitle.textContent = 'Game Over';
        gameOverTitle.style.color = 'white';
        finalScore.textContent = distance;
    }
}

function restartGame() {
    startGame();
}