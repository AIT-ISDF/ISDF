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
    difficulties: {
        easy: {
            depth: 3,
            timeLimit: 240,
            maxMoves: 20
        },
        medium: {
            depth: 4,
            timeLimit: 180,
            maxMoves: 15
        },
        hard: {
            depth: 5,
            timeLimit: 120,
            maxMoves: 12
        }
    }
};

// Game State
let gameState = {
    root: null,
    selectedNode: null,
    moves: 0,
    nodes: [],
    edges: [],
    hintsRemaining: 3,
    timeRemaining: 180,
    difficulty: 'medium',
    timer: null,
    gameRunning: false
};

class TreeNode {
    constructor(value, x, y, level) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.level = level;
        this.left = null;
        this.right = null;
        this.weight = value;
    }

    updateWeight() {
        this.weight = this.value;
        if (this.left) this.weight += this.left.weight;
        if (this.right) this.weight += this.right.weight;
        return this.weight;
    }
}

// Initialize Game
function initializeGame() {
    setupEventListeners();
    setupDifficultySelection();
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

function startGame() {
    const config = GAME_CONFIG.difficulties[gameState.difficulty];
    gameState = {
        ...gameState,
        timeRemaining: config.timeLimit,
        moves: 0,
        hintsRemaining: 3,
        gameRunning: true
    };

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');
    
    createRandomTree(config.depth);
    startTimer();
    updateDisplay();
}

function createRandomTree(depth) {
    const values = generateUniqueValues(Math.pow(2, depth) - 1);
    const containerWidth = document.querySelector('.tree-container').offsetWidth;
    const containerHeight = document.querySelector('.tree-container').offsetHeight;
    
    gameState.nodes = [];
    gameState.edges = [];
    gameState.root = buildTree(values, 0, containerWidth/2, 50, 0, depth);
    updateTreeWeights(gameState.root);
}

function generateUniqueValues(count) {
    const values = [];
    while (values.length < count) {
        const value = Math.floor(Math.random() * 90) + 10; // 10-99
        if (!values.includes(value)) values.push(value);
    }
    return values;
}

function buildTree(values, index, x, y, level, maxDepth) {
    if (index >= values.length || level >= maxDepth) return null;
    
    const node = new TreeNode(values[index], x, y, level);
    gameState.nodes.push(node);

    const horizontalSpacing = 300 / (Math.pow(2, level));
    const verticalSpacing = 80;

    node.left = buildTree(values, 2*index + 1, 
        x - horizontalSpacing, y + verticalSpacing, level + 1, maxDepth);
    node.right = buildTree(values, 2*index + 2, 
        x + horizontalSpacing, y + verticalSpacing, level + 1, maxDepth);

    if (node.left) gameState.edges.push({from: node, to: node.left});
    if (node.right) gameState.edges.push({from: node, to: node.right});

    return node;
}

function updateTreeWeights(node) {
    if (!node) return 0;
    node.weight = node.value + 
        updateTreeWeights(node.left) + 
        updateTreeWeights(node.right);
    return node.weight;
}

function renderTree() {
    const container = document.getElementById('tree-container');
    container.innerHTML = '';

    // Render edges
    gameState.edges.forEach(edge => {
        const edgeElement = document.createElement('div');
        edgeElement.className = 'edge';
        
        const length = Math.sqrt(
            Math.pow(edge.to.x - edge.from.x, 2) + 
            Math.pow(edge.to.y - edge.from.y, 2)
        );
        const angle = Math.atan2(
            edge.to.y - edge.from.y, 
            edge.to.x - edge.from.x
        ) * 180 / Math.PI;

        edgeElement.style.width = `${length}px`;
        edgeElement.style.left = `${edge.from.x}px`;
        edgeElement.style.top = `${edge.from.y + 30}px`;
        edgeElement.style.transform = `rotate(${angle}deg)`;

        container.appendChild(edgeElement);
    });

    // Render nodes
    gameState.nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.textContent = node.value;
        nodeElement.style.left = `${node.x - 30}px`;
        nodeElement.style.top = `${node.y - 30}px`;
        
        if (!isBalanced(node)) {
            nodeElement.classList.add('unbalanced');
        }
        if (gameState.selectedNode === node) {
            nodeElement.classList.add('selected');
        }
        
        nodeElement.onclick = () => handleNodeClick(node);
        container.appendChild(nodeElement);
    });
}

function handleNodeClick(node) {
    if (!gameState.gameRunning) return;

    if (!gameState.selectedNode) {
        gameState.selectedNode = node;
    } else {
        if (gameState.selectedNode !== node) {
            swapNodes(gameState.selectedNode, node);
            gameState.moves++;
            updateDisplay();
            checkWinCondition();
        }
        gameState.selectedNode = null;
    }
    renderTree();
}

function swapNodes(node1, node2) {
    const tempValue = node1.value;
    node1.value = node2.value;
    node2.value = tempValue;
    updateTreeWeights(gameState.root);
}

function isBalanced(node) {
    if (!node) return true;
    
    const leftWeight = node.left ? node.left.weight : 0;
    const rightWeight = node.right ? node.right.weight : 0;
    
    return Math.abs(leftWeight - rightWeight) <= 1;
}

function updateDisplay() {
    document.getElementById('moves').textContent = gameState.moves;
    document.getElementById('balance').textContent = 
        `${Math.round(calculateBalanceFactor() * 100)}%`;
    document.getElementById('hint-button').textContent = 
        `Get Hint (${gameState.hintsRemaining} remaining)`;
}

function calculateBalanceFactor() {
    let balanced = 0;
    let total = 0;
    
    function checkNode(node) {
        if (!node) return;
        if (isBalanced(node)) balanced++;
        total++;
        checkNode(node.left);
        checkNode(node.right);
    }
    
    checkNode(gameState.root);
    return balanced / total;
}

function startTimer() {
    clearInterval(gameState.timer);
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
    document.getElementById('time').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showHint() {
    if (gameState.hintsRemaining <= 0) return;
    
    const unbalancedNodes = findUnbalancedNodes();
    if (unbalancedNodes.length > 0) {
        const node = unbalancedNodes[0];
        const suggestion = findBalancingSuggestion(node);
        
        document.getElementById('hint-message').textContent = suggestion;
        document.getElementById('hint-modal').classList.remove('hidden');
        gameState.hintsRemaining--;
        updateDisplay();
    }
}

function findUnbalancedNodes() {
    return gameState.nodes.filter(node => !isBalanced(node));
}

function findBalancingSuggestion(node) {
    const leftWeight = node.left ? node.left.weight : 0;
    const rightWeight = node.right ? node.right.weight : 0;
    const diff = Math.abs(leftWeight - rightWeight);
    
    return `Try balancing the node with value ${node.value}. ` +
           `Current weight difference: ${diff}`;
}

function checkWinCondition() {
    if (calculateBalanceFactor() === 1) {
        gameOver(true);
    }
}

function gameOver(isWin) {
    clearInterval(gameState.timer);
    gameState.gameRunning = false;
    
    if (isWin) {
        const config = GAME_CONFIG.difficulties[gameState.difficulty];
        const timeBonus = gameState.timeRemaining * 10;
        const moveEfficiency = Math.max(0, 1 - (gameState.moves / config.maxMoves));
        const efficiencyRating = Math.round(moveEfficiency * 100);
        
        document.getElementById('efficiency-rating').textContent = `${efficiencyRating}%`;
        document.getElementById('moves-used').textContent = gameState.moves;
        document.getElementById('time-bonus').textContent = `+${timeBonus}`;
        
        document.getElementById('winMessage').style.display = 'block';
        document.querySelector('.next-level-button').style.display = 'block';
        
        completeLevel(14);
    } else {
        document.getElementById('game-board').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-moves').textContent = gameState.moves;
        document.getElementById('final-balance').textContent = 
            `${Math.round(calculateBalanceFactor() * 100)}%`;
    }
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function restartGame() {
    startGame();
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initializeGame);