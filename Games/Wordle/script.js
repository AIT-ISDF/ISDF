// List of words (expanded for more difficulty)
const wordList = [
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
    'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'allow', 'alone', 'alter',
    'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'argue', 'arise', 'array',
    'aside', 'asset', 'audio', 'audit', 'avoid', 'award', 'aware', 'badly', 'baker', 'bases',
    'basic', 'basis', 'beach', 'began', 'begin', 'begun', 'being', 'below', 'bench', 'birth',
    'black', 'blame', 'blind', 'block', 'blood', 'board', 'brain', 'brand', 'bread', 'break',
    'breed', 'brief', 'bring', 'broad', 'broke', 'brown', 'build', 'built', 'catch', 'cause',
    'chain', 'chair', 'chart', 'check', 'chief', 'child', 'china', 'choir', 'civil', 'claim',
    'class', 'clean', 'clear', 'climb', 'clock', 'close', 'coach', 'coach', 'coast', 'could',
    'count', 'court', 'cover', 'craft', 'crash', 'cream', 'crime', 'cross', 'crowd', 'crown',
    'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth',
    'doing', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress', 'drill', 'drink',
    'drive', 'dying', 'eager', 'early', 'earth', 'eight', 'elite', 'enemy', 'enjoy', 'enter',
    'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false',
    'fault', 'favor', 'fever', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first',
    'fixed', 'flash', 'fleet', 'floor', 'focus', 'force', 'forge', 'forth', 'forty', 'forum',
    'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant',
    'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'great',
    'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harry',
    'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human', 'ideal', 'image',
    'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'known',
    'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave',
    'legal', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'logic', 'loose',
    'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match',
    'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model',
    'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie', 'music', 'needs',
    'nerve', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur',
    'ocean', 'offer', 'often', 'order', 'other', 'ought', 'paint', 'panel', 'paper', 'party',
    'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place', 'plain',
    'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime',
    'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite',
    'radio', 'raise', 'reach', 'ready', 'refer', 'right', 'rival', 'river', 'robot', 'roger',
    'roman', 'rough', 'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score',
    'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell',
    'shift', 'shirt', 'shock', 'shoot', 'shore', 'short', 'shown', 'sight', 'since', 'sixth',
    'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke',
    'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend',
    'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state',
    'steam', 'steel', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story',
    'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table',
    'taken', 'taste', 'taxes', 'teach', 'teeth', 'terry', 'texas', 'thank', 'theft', 'their',
    'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw',
    'throw', 'tight', 'times', 'tired', 'title', 'today', 'topic', 'total', 'touch', 'tough',
    'tower', 'track', 'trade', 'train', 'treat', 'trend', 'trial', 'tried', 'tries', 'truck',
    'truly', 'trust', 'truth', 'twice', 'under', 'undue', 'union', 'unity', 'until', 'upper',
    'upset', 'urban', 'usage', 'usual', 'vague', 'valid', 'value', 'video', 'visit', 'vital',
    'voice', 'virus', 'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while', 'white',
    'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would',
    'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth'
];

// Select a random word from the list
let targetWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

// Constants
const rows = 6;
const cols = 5;

// Track current position
let currentRow = 0;
let currentCol = 0;

// Game status
let gameOver = false;

// Create the game grid
function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear any existing tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement('div');
            tile.id = `tile-${r}-${c}`;
            tile.classList.add('tile');
            grid.appendChild(tile);
        }
    }
}

// Create the on-screen keyboard
function createKeyboard() {
    const keyboardLayout = [
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ];

    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = ''; // Clear existing keys

    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        row.split('').forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.textContent = key;
            keyButton.classList.add('key');
            keyButton.id = `key-${key}`;
            keyButton.addEventListener('click', () => handleKeyPress(key));
            rowDiv.appendChild(keyButton);
        });
        keyboard.appendChild(rowDiv);
    });

    // Add Enter and Backspace keys
    const enterKey = document.createElement('button');
    enterKey.textContent = 'Enter';
    enterKey.classList.add('key', 'wide-key');
    enterKey.addEventListener('click', () => handleKeyPress('Enter'));
    keyboard.appendChild(enterKey);

    const backspaceKey = document.createElement('button');
    backspaceKey.textContent = '←';
    backspaceKey.classList.add('key', 'wide-key');
    backspaceKey.addEventListener('click', () => handleKeyPress('Backspace'));
    keyboard.appendChild(backspaceKey);
}

// Handle key press
function handleKeyPress(key) {
    if (gameOver) return;

    if (key === 'Enter') {
        if (currentCol === cols) {
            const guess = getCurrentGuess();
            revealTiles(guess);
            currentRow++;
            currentCol = 0;
        } else {
            showMessage('Not enough letters');
        }
    } else if (key === 'Backspace') {
        if (currentCol > 0) {
            currentCol--;
            updateTile('', currentRow, currentCol);
        }
    } else {
        if (currentCol < cols && /^[a-zA-Z]$/.test(key)) {
            updateTile(key, currentRow, currentCol);
            currentCol++;
        }
    }
}

// Get the current guess as a string
function getCurrentGuess() {
    let guess = '';
    for (let c = 0; c < cols; c++) {
        const tile = document.getElementById(`tile-${currentRow}-${c}`);
        guess += tile.textContent;
    }
    return guess.toUpperCase();
}

// Update the tile with a letter
function updateTile(letter, row, col) {
    const tile = document.getElementById(`tile-${row}-${col}`);
    tile.textContent = letter.toUpperCase();
    tile.classList.remove('flip');
}

// Reveal tiles with color feedback
function revealTiles(guess) {
    const rowTiles = [];
    const letterCount = {};
    for (let letter of targetWord) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: correct positions
    for (let c = 0; c < cols; c++) {
        const tile = document.getElementById(`tile-${currentRow}-${c}`);
        const letter = tile.textContent.toUpperCase();
        rowTiles.push({ tile, letter });

        if (letter === targetWord[c]) {
            tile.classList.add('correct');
            updateKeyboardKey(letter, 'correct');
            letterCount[letter]--;
        }
    }

    // Second pass: present letters
    for (let i = 0; i < rowTiles.length; i++) {
        const { tile, letter } = rowTiles[i];
        if (!tile.classList.contains('correct')) {
            if (targetWord.includes(letter) && letterCount[letter] > 0) {
                tile.classList.add('present');
                updateKeyboardKey(letter, 'present');
                letterCount[letter]--;
            } else {
                tile.classList.add('absent');
                updateKeyboardKey(letter, 'absent');
            }
        }
    }

    // Check for win/loss
    if (guess === targetWord) {
        showMessage('Congratulations! You guessed the word!');
        gameOver = true;
    } else if (currentRow === rows - 1) {
        showMessage(`Game Over! The word was: ${targetWord}`);
        gameOver = true;
    }
}

// Update the keyboard key's color
function updateKeyboardKey(key, status) {
    const keyButton = document.getElementById(`key-${key.toLowerCase()}`);
    if (keyButton) {
        const oldStatus = keyButton.getAttribute('data-status');
        if (oldStatus !== 'correct') { // Do not downgrade 'correct' to 'present' or 'absent'
            keyButton.classList.remove('correct', 'present', 'absent');
            keyButton.classList.add(status);
            keyButton.setAttribute('data-status', status);
        }
    }
}

// Show a message to the player
function showMessage(msg) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 2000);
}

// Restart Game
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);

function restartGame() {
    // Reset variables
    currentRow = 0;
    currentCol = 0;
    gameOver = false;

    // Generate a new word
    targetWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

    // Clear grid and recreate
    createGrid();

    // Reset keyboard
    createKeyboard();

    // Clear message
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = '';
}

// Listen for physical keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (gameOver) return;
    if (key === 'Enter' || key === 'Backspace' || /^[a-zA-Z]$/.test(key)) {
        handleKeyPress(key.toLowerCase());
    }
});

// Initialize the game
createGrid();
createKeyboard();