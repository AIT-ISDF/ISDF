document.addEventListener('DOMContentLoaded', () => {
    // Check level access
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (5 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }

    const board = document.getElementById('sudoku-board');
    const feedback = document.getElementById('feedback');
    const winMessage = document.getElementById('winMessage');
    const nextLevelButton = document.querySelector('.next-level-button');
    const size = 9;
    let isCompleted = false;

    // Sample Sudoku puzzle (moderate difficulty)
    const puzzle = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    // Function to create the Sudoku grid
    function createBoard(puzzle) {
        board.innerHTML = '';  // Clear the board
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;

                // Set initial puzzle values
                if (puzzle[i][j] !== 0) {
                    input.value = puzzle[i][j];
                    input.disabled = true;  // Disable input for initial numbers
                }

                input.addEventListener('input', handleInput);
                board.appendChild(input);
            }
        }
    }

    // Restrict input to numbers 1-9
    function handleInput(event) {
        const value = event.target.value;
        if (!/^[1-9]$/.test(value)) {
            event.target.value = '';
        }
    }

    // Function to check if the Sudoku is complete and valid
    function checkAnswer() {
        const cells = Array.from(board.children);
        const grid = [];

        // Convert input values into a 2D array
        for (let i = 0; i < size; i++) {
            grid.push(cells.slice(i * size, (i + 1) * size).map(cell => parseInt(cell.value) || 0));
        }

        // Check if Sudoku is complete
        if (grid.flat().includes(0)) {
            feedback.textContent = 'Sudoku is not complete.';
            feedback.style.color = '#ff3333';
            return;
        }

        // Validate the solution
        if (validateSudoku(grid)) {
            feedback.textContent = 'Sudoku is correct!';
            feedback.style.color = '#4CAF50';
            if (!isCompleted) {
                isCompleted = true;
                completeLevel(5);
                winMessage.style.display = 'block';
                nextLevelButton.style.display = 'block';
            }
        } else {
            feedback.textContent = 'Sudoku is incorrect.';
            feedback.style.color = '#ff3333';
        }
    }

    // Function to validate the Sudoku grid
    function validateSudoku(grid) {
        const isValidBlock = (block) => {
            const set = new Set(block.filter(num => num > 0));
            return set.size === block.length;
        };

        for (let i = 0; i < size; i++) {
            // Check rows and columns
            const row = grid[i];
            const col = grid.map(row => row[i]);

            if (!isValidBlock(row) || !isValidBlock(col)) {
                return false;
            }

            // Check 3x3 subgrids
            if (i % 3 === 0) {
                for (let j = 0; j < size; j += 3) {
                    const subgrid = [
                        ...grid[i].slice(j, j + 3),
                        ...grid[i + 1].slice(j, j + 3),
                        ...grid[i + 2].slice(j, j + 3)
                    ];
                    if (!isValidBlock(subgrid)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Level navigation functions


    function completeLevel(levelNumber) {
        const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
        if (levelNumber === currentProgress) {
            localStorage.setItem('levelProgress', (currentProgress + 1).toString());
        }
    }

    // Add highlighting for incorrect entries
    function highlightErrors() {
        const cells = Array.from(board.children);
        cells.forEach(cell => {
            cell.classList.remove('error');
        });

        const grid = [];
        for (let i = 0; i < size; i++) {
            grid.push(cells.slice(i * size, (i + 1) * size).map(cell => parseInt(cell.value) || 0));
        }

        // Check for duplicates in rows, columns, and subgrids
        for (let i = 0; i < size; i++) {
            checkDuplicatesInRow(i, cells);
            checkDuplicatesInColumn(i, cells);
            if (i % 3 === 0) {
                for (let j = 0; j < size; j += 3) {
                    checkDuplicatesInSubgrid(i, j, cells);
                }
            }
        }
    }

    function checkDuplicatesInRow(row, cells) {
        const numbers = new Map();
        for (let col = 0; col < size; col++) {
            const cell = cells[row * size + col];
            const value = cell.value;
            if (value) {
                if (numbers.has(value)) {
                    cell.classList.add('error');
                    cells[row * size + numbers.get(value)].classList.add('error');
                } else {
                    numbers.set(value, col);
                }
            }
        }
    }

    function checkDuplicatesInColumn(col, cells) {
        const numbers = new Map();
        for (let row = 0; row < size; row++) {
            const cell = cells[row * size + col];
            const value = cell.value;
            if (value) {
                if (numbers.has(value)) {
                    cell.classList.add('error');
                    cells[numbers.get(value) * size + col].classList.add('error');
                } else {
                    numbers.set(value, row);
                }
            }
        }
    }

    function checkDuplicatesInSubgrid(startRow, startCol, cells) {
        const numbers = new Map();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = cells[(startRow + i) * size + (startCol + j)];
                const value = cell.value;
                if (value) {
                    if (numbers.has(value)) {
                        cell.classList.add('error');
                        const [prevI, prevJ] = numbers.get(value);
                        cells[(startRow + prevI) * size + (startCol + prevJ)].classList.add('error');
                    } else {
                        numbers.set(value, [i, j]);
                    }
                }
            }
        }
    }

    // Event listener for checking the answer
    document.getElementById('check-answer').addEventListener('click', () => {
        highlightErrors();
        checkAnswer();
    });

    // Initialize the board with the sample puzzle
    createBoard(puzzle);
});