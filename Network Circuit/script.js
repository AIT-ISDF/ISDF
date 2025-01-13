const svgAssets = {
  'line-horizontal': 'assets/line-horizontal.svg',
  'line-vertical': 'assets/line-vertical.svg',
  'corner': 'assets/corner.svg',
  't-shape': 'assets/t-shape.svg',
  'server': 'assets/server.svg',
  'computer': 'assets/computer.svg',
};

const tileTypes = [
  { name: 'line-horizontal', connections: { top: false, right: true, bottom: false, left: true } },
  { name: 'line-vertical', connections: { top: true, right: false, bottom: true, left: false } },
  { name: 'corner', connections: { top: true, right: true, bottom: false, left: false } },
  { name: 't-shape', connections: { top: true, right: true, bottom: true, left: false } },
  { name: 'server', connections: { top: true, right: true, bottom: true, left: true } },
  { name: 'computer', connections: { top: true, right: false, bottom: false, left: false } },
];

const rows = 6;
const cols = 6;

const grid = document.getElementById('grid');
const resetButton = document.getElementById('reset');
const moveCountDisplay = document.getElementById('move-count');
const timerDisplay = document.getElementById('timer');

let tiles = [];
let moveCount = 0;
let timerInterval;
let startTime;

// Initialize grid
function createGrid() {
  grid.innerHTML = '';
  tiles = [];
  moveCount = 0;
  moveCountDisplay.textContent = moveCount;

  for (let i = 0; i < rows * cols; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    const type = i === 0 ? tileTypes[4] : i === rows * cols - 1 ? tileTypes[5] : tileTypes[Math.floor(Math.random() * 4)];
    const img = document.createElement('img');
    img.src = svgAssets[type.name];
    img.style.width = '48px';
    img.style.height = '48px';
    img.style.margin = '6px'; // Aligns tile graphics perfectly
    tile.appendChild(img);

    const rotation = Math.floor(Math.random() * 4) * 90;
    tile.style.transform = `rotate(${rotation}deg)`;
    tile.dataset.rotation = rotation;
    tile.dataset.type = type.name;

    tile.addEventListener('click', () => {
      rotateTile(tile);
      incrementMoveCount();
    });

    tiles.push({ element: tile, type, rotation });
    grid.appendChild(tile);
  }

  updateFlow();
  startTimer();
}

// Rotate tile
function rotateTile(tile) {
  tile.dataset.rotation = (parseInt(tile.dataset.rotation) + 90) % 360;
  tile.style.transform = `rotate(${tile.dataset.rotation}deg)`;
  updateFlow();
}

// Update flow
function updateFlow() {
  tiles.forEach(tile => tile.element.classList.remove('connected'));
  const visited = new Set();

  function traverse(index) {
    if (visited.has(index)) return;
    visited.add(index);

    const tile = tiles[index];
    tile.element.classList.add('connected');

    const row = Math.floor(index / cols);
    const col = index % cols;

    const neighbors = [
      { dir: 'top', neighbor: row > 0 ? index - cols : null },
      { dir: 'right', neighbor: col < cols - 1 ? index + 1 : null },
      { dir: 'bottom', neighbor: row < rows - 1 ? index + cols : null },
      { dir: 'left', neighbor: col > 0 ? index - 1 : null },
    ];

    neighbors.forEach(({ dir, neighbor }) => {
      if (neighbor === null) return;
      const neighborTile = tiles[neighbor];
      if (isConnected(tile, neighborTile, dir)) traverse(neighbor);
    });
  }

  traverse(0);
}

// Check connection
function isConnected(tile, neighbor, dir) {
  const directions = ['top', 'right', 'bottom', 'left'];
  const rotation = parseInt(tile.element.dataset.rotation) / 90;
  const neighborRotation = parseInt(neighbor.element.dataset.rotation) / 90;

  const currentConnections = Object.entries(tile.type.connections).map(([key, value], i) => ({
    key: directions[(i + rotation) % 4],
    value,
  }));

  const neighborConnections = Object.entries(neighbor.type.connections).map(([key, value], i) => ({
    key: directions[(i + neighborRotation) % 4],
    value,
  }));

  const current = currentConnections.find(c => c.key === dir)?.value;
  const opposite = neighborConnections.find(c => c.key === oppositeDir(dir))?.value;

  return current && opposite;
}

// Get opposite direction
function oppositeDir(dir) {
  const mapping = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
  return mapping[dir];
}

// Start timer
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  startTime = Date.now();

  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

// Increment move count
function incrementMoveCount() {
  moveCount++;
  moveCountDisplay.textContent = moveCount;
}

// Reset game
resetButton.addEventListener('click', createGrid);

// Start game
createGrid();
