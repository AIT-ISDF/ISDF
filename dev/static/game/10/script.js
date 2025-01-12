document.addEventListener('DOMContentLoaded', () => {
    // Check level access
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (10 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }

    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const startPage = document.getElementById('start-page');
    const puzzle = document.getElementById('puzzle');
    const shuffleButton = document.getElementById('shuffle-button');
    const restartButton = document.getElementById('restart-button');
    const message = document.getElementById('message');
    const levelComplete = document.getElementById('level-complete');
    const size = 4;
    let tiles = [];
    let isGameWon = false;

    // Function to create the puzzle grid
    function createPuzzle() {
        tiles = [...Array(size * size).keys()].slice(1);
        tiles.push(null);
        puzzle.innerHTML = '';
        tiles.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            if (tile) {
                tileElement.textContent = tile;
            } else {
                tileElement.classList.add('empty');
            }
            tileElement.addEventListener('click', () => moveTile(index));
            puzzle.appendChild(tileElement);
        });
    }

    function shuffleTiles() {
        do {
            for (let i = tiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
            }
        } while (!isSolvable());

        updatePuzzle();
        message.textContent = '';
        restartButton.classList.add('hidden');
        isGameWon = false;
    }

    function isSolvable() {
        let inversions = 0;
        const tilesCopy = tiles.filter(tile => tile !== null);
        
        for (let i = 0; i < tilesCopy.length - 1; i++) {
            for (let j = i + 1; j < tilesCopy.length; j++) {
                if (tilesCopy[i] > tilesCopy[j]) inversions++;
            }
        }

        const emptyRowFromBottom = Math.floor((tiles.indexOf(null) / size)) + 1;
        return (inversions + emptyRowFromBottom) % 2 === 0;
    }

    function moveTile(index) {
        if (isGameWon) return;

        const emptyIndex = tiles.indexOf(null);
        const validMoves = [
            emptyIndex - 1, emptyIndex + 1,
            emptyIndex - size, emptyIndex + size
        ];

        if (validMoves.includes(index) && 
            !(emptyIndex % size === 0 && index % size === size - 1) && 
            !(emptyIndex % size === size - 1 && index % size === 0)) {
            
            [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
            updatePuzzle();
            checkWin();
        }
    }

    function updatePuzzle() {
        Array.from(puzzle.children).forEach((tile, index) => {
            tile.textContent = tiles[index];
            if (tiles[index]) {
                tile.classList.remove('empty');
            } else {
                tile.classList.add('empty');
            }
        });
    }

    function checkWin() {
        if (tiles.slice(0, -1).every((tile, index) => tile === index + 1)) {
            isGameWon = true;
            completeLevel(10);
            levelComplete.classList.remove('hidden');
            document.querySelector('.next-level-button').style.display = 'block';
        }
    }

    // Level navigation functions
  
    
    function completeLevel(levelNumber) {
        const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
        if (levelNumber === currentProgress) {
            localStorage.setItem('levelProgress', (currentProgress + 1).toString());
        }
    }

    // Event listeners
    startButton.addEventListener('click', () => {
        startPage.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        createPuzzle();
    });

    shuffleButton.addEventListener('click', shuffleTiles);

    restartButton.addEventListener('click', () => {
        createPuzzle();
        shuffleTiles();
        restartButton.classList.add('hidden');
        levelComplete.classList.add('hidden');
        document.querySelector('.next-level-button').style.display = 'none';
    });

    // Initialize the puzzle
    createPuzzle();
});