/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const feedback = document.getElementById('feedback');
    const size = 9;

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
            return;
        }

        // Validate rows, columns, and 3x3 subgrids
        if (validateSudoku(grid)) {
            feedback.textContent = 'Sudoku is correct!';
        } else {
            feedback.textContent = 'Sudoku is incorrect.';
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

    // Event listener for checking the answer
    document.getElementById('check-answer').addEventListener('click', checkAnswer);

    // Initialize the board with the sample puzzle
    createBoard(puzzle);
});
