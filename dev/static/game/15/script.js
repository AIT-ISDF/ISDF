// Check level progress
document.addEventListener('DOMContentLoaded', function() {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (15 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }
    initializeGame();
});

const PUZZLES = [
    {
        level: 1,
        nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        relationships: [
            'B is a child of A',
            'C is a child of A',
            'D is a child of B',
            'E is a child of B',
            'F is a child of C',
            'G is a child of C'
        ],
        root: 'A'
    },
    {
        level: 2,
        nodes: ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'],
        relationships: [
            'Q is a child of P',
            'R is a child of P',
            'S is a child of Q',
            'T is a child of Q',
            'U is a child of R',
            'V is a child of R',
            'W is a child of S'
        ],
        root: 'P'
    },
    {
        level: 3,
        nodes: ['X', 'Y', 'Z', 'W', 'V', 'M', 'N', 'O', 'K'],
        relationships: [
            'Y is a child of X',
            'Z is a child of X',
            'W is a child of Y',
            'V is a child of Y',
            'M is a child of Z',
            'N is a child of Z',
            'O is a child of W',
            'K is a child of M'
        ],
        root: 'X'
    }
];

// Keep all the previous JavaScript game logic
// Update the win condition to use the win message and level progression:

function handleWin() {
    clearInterval(gameState.timer);
    
    const timeBonus = Math.max(0, 300 - gameState.timeElapsed);
    const finalScore = 1000 + timeBonus;

    document.getElementById('final-time').textContent = 
        `${Math.floor(gameState.timeElapsed / 60)}:${(gameState.timeElapsed % 60).toString().padStart(2, '0')}`;
    document.getElementById('final-score').textContent = finalScore;

    document.getElementById('winMessage').style.display = 'block';
    document.querySelector('.next-level-button').style.display = 'block';

    completeLevel(15);
}

function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

// Update the checkSolution function to use handleWin:

function checkSolution() {
    if (!gameState.selectedNode) {
        showMessage('Please select a root node first!', 'error');
        return;
    }

    const currentPuzzle = PUZZLES[gameState.currentLevel];

    if (gameState.selectedNode === currentPuzzle.root) {
        const selectedElement = document.querySelector('.node.selected');
        selectedElement.classList.add('root');

        if (gameState.currentLevel === PUZZLES.length - 1) {
            handleWin();
        } else {
            showMessage('Correct! Moving to next level...', 'success');
            setTimeout(() => {
                loadLevel(gameState.currentLevel + 1);
            }, 1500);
        }
    } else {
        showMessage('Incorrect! Starting over...', 'error');
        setTimeout(() => {
            loadLevel(0);
        }, 1500);
    }
}