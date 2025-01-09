document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 5; // 5x5 grid
    const board = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-btn');
    let tiles = [];
  
    // Create the game board
    function createBoard() {
      board.innerHTML = '';
      tiles = [];
      for (let row = 0; row < boardSize; row++) {
        const rowArray = [];
        for (let col = 0; col < boardSize; col++) {
          const tile = document.createElement('div');
          tile.classList.add('tile');
          tile.dataset.row = row;
          tile.dataset.col = col;
          tile.addEventListener('click', toggleTile);
          board.appendChild(tile);
          rowArray.push(tile);
        }
        tiles.push(rowArray);
        console.log(tiles); // Debugging: Log tiles array
      }
      randomizeBoard();
    }
  
    // Toggle a tile and its neighbors
    function toggleTile(event) {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
  
      toggleLight(row, col);
      toggleLight(row - 1, col); // Top neighbor
      toggleLight(row + 1, col); // Bottom neighbor
      toggleLight(row, col - 1); // Left neighbor
      toggleLight(row, col + 1); // Right neighbor
  
      if (checkWin()) {
        setTimeout(() => alert('You win!'), 100);
      }
    }
  
    // Toggle light state (on/off)
    function toggleLight(row, col) {
      if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
        const tile = tiles[row][col];
        tile.classList.toggle('off');
      }
    }
  
    // Randomize the board
    function randomizeBoard() {
      const moves = Math.floor(Math.random() * 20) + 10; // Randomize 10–30 moves
      for (let i = 0; i < moves; i++) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        toggleTile({ target: tiles[row][col] });
      }
    }
  
    // Check if all tiles are "off"
    function checkWin() {
      return tiles.flat().every(tile => tile.classList.contains('off'));
    }
  
    // Reset the game
    resetButton.addEventListener('click', createBoard);
  
    // Initialize the game
    createBoard();
  });
  