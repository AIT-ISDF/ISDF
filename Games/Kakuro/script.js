class KakuroGame {
    constructor() {
        this.selectedCell = null;
        this.puzzle = this.generatePuzzle();
        this.solution = this.generateSolution();
        this.playerGrid = this.initializePlayerGrid();
        this.isComplete = false;
    }

    generatePuzzle() {
        // Sample 8x8 Kakuro puzzle
        // 0: blocked cell, -1: empty cell, Array: [down sum, right sum]
        return [
            [0, 0, [0,4], [0,10], [0,16], 0, [0,24], [0,17]],
            [0, [16,4], -1, -1, -1, [0,24], -1, -1],
            [[0,23], -1, -1, -1, -1, -1, -1, -1],
            [[0,16], -1, -1, -1, [16,3], -1, -1, 0],
            [[0,20], -1, -1, -1, -1, -1, -1, [0,15]],
            [0, [16,12], -1, -1, -1, -1, -1, -1],
            [[0,17], -1, -1, -1, [0,12], -1, -1, 0],
            [[0,11], -1, -1, 0, [0,7], -1, -1, 0]
        ];
    }

    generateSolution() {
        // Sample solution corresponding to the puzzle
        return [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 3, 2, 0, 9, 8],
            [0, 5, 7, 4, 3, 2, 1, 1],
            [0, 8, 5, 3, 0, 1, 2, 0],
            [0, 9, 2, 4, 1, 3, 1, 0],
            [0, 0, 3, 4, 5, 7, 8, 9],
            [0, 9, 8, 7, 0, 5, 7, 0],
            [0, 2, 9, 0, 0, 3, 4, 0]
        ];
    }

    initializePlayerGrid() {
        return Array(8).fill().map(() => Array(8).fill(0));
    }

    createGrid() {
        const grid = document.getElementById('kakuro-grid');
        grid.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (this.puzzle[i][j] === 0) {
                    cell.classList.add('blocked');
                } else if (Array.isArray(this.puzzle[i][j])) {
                    cell.classList.add('clue');
                    if (this.puzzle[i][j][0] > 0) {
                        const downClue = document.createElement('div');
                        downClue.className = 'clue-down';
                        downClue.textContent = this.puzzle[i][j][0];
                        cell.appendChild(downClue);
                    }
                    if (this.puzzle[i][j][1] > 0) {
                        const rightClue = document.createElement('div');
                        rightClue.className = 'clue-right';
                        rightClue.textContent = this.puzzle[i][j][1];
                        cell.appendChild(rightClue);
                    }
                } else {
                    cell.classList.add('empty');
                    cell.addEventListener('click', () => this.selectCell(i, j));
                }

                grid.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        if (this.puzzle[row][col] !== -1) return;

        // Remove previous selection
        if (this.selectedCell) {
            document.querySelector(`[data-row="${this.selectedCell.row}"][data-col="${this.selectedCell.col}"]`)
                .classList.remove('selected');
        }

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('selected');
        this.selectedCell = { row, col };
    }

    handleNumberInput(num) {
        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        if (num === 0) {
            // Clear cell
            this.playerGrid[row][col] = 0;
            document.querySelector(`[data-row="${row}"][data-col="${col}"]`).textContent = '';
        } else {
            // Set number
            this.playerGrid[row][col] = num;
            document.querySelector(`[data-row="${row}"][data-col="${col}"]`).textContent = num;
        }

        this.validateMove(row, col);
        this.checkWin();
    }

    validateMove(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.remove('error', 'valid');

        if (this.playerGrid[row][col] === this.solution[row][col]) {
            cell.classList.add('valid');
        } else {
            cell.classList.add('error');
        }
    }

    checkWin() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.puzzle[i][j] === -1 && this.playerGrid[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        this.handleWin();
        return true;
    }

    handleWin() {
        if (this.isComplete) return;
        this.isComplete = true;
        
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('win-screen').classList.remove('hidden');
        this.createSparkles();
    }

    createSparkles() {
        const container = document.querySelector('.sparkles');
        container.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(sparkle);
        }
    }

    restart() {
        this.playerGrid = this.initializePlayerGrid();
        this.selectedCell = null;
        this.isComplete = false;
        this.createGrid();
    }
}

// Initialize game and handle events
document.addEventListener('DOMContentLoaded', () => {
    const game = new KakuroGame();

    // Function to start the game
    function startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        game.createGrid();
    }

    // Start game button
    document.getElementById('start-game').addEventListener('click', startGame);

    // Number pad buttons
    document.querySelectorAll('.num-btn').forEach(button => {
        button.addEventListener('click', () => {
            const num = parseInt(button.dataset.num);
            game.handleNumberInput(num);
        });
    });

    // Rules button
    document.getElementById('rules-btn').addEventListener('click', () => {
        document.getElementById('rules-modal').classList.remove('hidden');
    });

    // Close rules modal
    document.getElementById('close-rules').addEventListener('click', () => {
        document.getElementById('rules-modal').classList.add('hidden');
        if (!document.getElementById('game-screen').classList.contains('hidden')) {
            return; // If game is already running, just close the modal
        }
        startGame(); // Start game only if we're on the start screen
    });

    // Click outside modal to close
    document.getElementById('rules-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('rules-modal')) {
            document.getElementById('rules-modal').classList.add('hidden');
            if (!document.getElementById('game-screen').classList.contains('hidden')) {
                return; // If game is already running, just close the modal
            }
            startGame(); // Start game only if we're on the start screen
        }
    });

    // Restart button
    document.getElementById('restart').addEventListener('click', () => {
        game.restart();
    });

    // Play again button
    document.getElementById('play-again').addEventListener('click', () => {
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        game.restart();
    });

    // New game button
    document.getElementById('new-game').addEventListener('click', () => {
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
    });

    // Keyboard input
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            game.handleNumberInput(parseInt(e.key));
        }
    });
});