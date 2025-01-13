document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 400; // Width and height of the puzzle board
    const pieceSize = 100; // Width and height of each piece
    const puzzleBoard = document.getElementById("puzzle-board");
    const piecesContainer = document.getElementById("pieces-container");
    let puzzlePieces = [];
  
    // Create Puzzle Pieces
    function createPuzzle(imageUrl) {
      // Array to track piece positions
      const positions = [];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          positions.push({ x: x * pieceSize, y: y * pieceSize });
        }
      }
      shuffleArray(positions); // Randomize positions
  
      positions.forEach((pos, index) => {
        const piece = document.createElement("div");
        piece.classList.add("piece");
        piece.style.width = `${pieceSize}px`;
        piece.style.height = `${pieceSize}px`;
  
        // Set background image to match part of the puzzle
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `-${(index % 4) * pieceSize}px -${
          Math.floor(index / 4) * pieceSize
        }px`;
  
        // Set correct position as data attributes
        piece.dataset.correctX = (index % 4) * pieceSize;
        piece.dataset.correctY = Math.floor(index / 4) * pieceSize;
  
        // Place in container initially
        piece.style.left = `${pos.x}px`;
        piece.style.top = `${pos.y}px`;
        piece.draggable = true; // Make it draggable
        piece.addEventListener("dragstart", dragStart);
        piece.addEventListener("dragend", dragEnd);
  
        piecesContainer.appendChild(piece);
        puzzlePieces.push(piece);
      });
    }
  
    // Drag-and-Drop Handlers
    let draggedPiece = null;
  
    function dragStart(event) {
      draggedPiece = event.target;
      draggedPiece.classList.add("dragging");
      setTimeout(() => (draggedPiece.style.display = "none"), 0);
    }
  
    function dragEnd(event) {
      draggedPiece.style.display = "block";
      draggedPiece.classList.remove("dragging");
      draggedPiece = null;
      checkCompletion();
    }
  
    // Shuffle Array Helper
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    // Check Completion
    function checkCompletion() {
      let isComplete = true;
      puzzlePieces.forEach((piece) => {
        const left = parseInt(piece.style.left, 10);
        const top = parseInt(piece.style.top, 10);
        const correctX = parseInt(piece.dataset.correctX, 10);
        const correctY = parseInt(piece.dataset.correctY, 10);
        if (left !== correctX || top !== correctY) {
          isComplete = false;
        }
      });
  
      if (isComplete) {
        setTimeout(() => alert("Congratulations! Puzzle Completed!"), 100);
      }
    }
  
    // Initialize Puzzle
    createPuzzle("https://www.example.com/image.jpg"); // Replace with your puzzle image URL
  });
  