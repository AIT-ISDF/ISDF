document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const startPage = document.getElementById('start-page');
    const puzzle = document.getElementById('puzzle');
    const shuffleButton = document.getElementById('shuffle-button');
    const restartButton = document.getElementById('restart-button');
    const message = document.getElementById('message');
    const size = 4;
    let tiles = [];

    // Function to create the puzzle grid
    function createPuzzle() {
        tiles = [...Array(size * size).keys()].slice(1);
        tiles.push(null); // Empty tile
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

    // Function to shuffle the tiles
    function shuffleTiles() {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        updatePuzzle();
        message.textContent = '';
        restartButton.classList.add('hidden');
    }

    // Function to move a tile
    function moveTile(index) {
        const emptyIndex = tiles.indexOf(null);
        const validMoves = [
            emptyIndex - 1, emptyIndex + 1,
            emptyIndex - size, emptyIndex + size
        ];

        if (validMoves.includes(index) && Math.abs(emptyIndex - index) !== 3) {
            [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
            updatePuzzle();
            checkWin();
        }
    }

    // Function to update the puzzle grid
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

    // Function to check if the puzzle is solved
    function checkWin() {
        if (tiles.slice(0, -1).every((tile, index) => tile === index + 1)) {
            message.textContent = 'Congratulations! You solved the puzzle!';
            restartButton.classList.remove('hidden');
        } else if (tiles.includes(null)) {
            message.textContent = 'Keep going!';
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
    });

    // Initialize the puzzle
    createPuzzle();
});
