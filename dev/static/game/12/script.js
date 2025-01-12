document.addEventListener('DOMContentLoaded', function() {
    const currentProgress = parseInt(localStorage.getItem('levelProgress') || '1');
    if (12 > currentProgress) {
        window.location.href = '../index.html';
        return;
    }

    initializeGame();
});

// Game Configuration
const GAME_CONFIG = {
    timeLimit: 180, // 3 minutes in seconds
    gridSize: 8,
    maxErrors: 3,
    components: [
        {
            type: 'powerSource',
            voltage: 12,
            maxConnections: 2,
            sprite: 'power-source.png'
        },
        {
            type: 'transformer',
            ratio: 0.5,
            maxConnections: 4,
            sprite: 'transformer.png'
        },
        {
            type: 'capacitor',
            capacity: 1000,
            maxConnections: 2,
            sprite: 'capacitor.png'
        },
        {
            type: 'resistor',
            resistance: 100,
            maxConnections: 2,
            sprite: 'resistor.png'
        },
        {
            type: 'diode',
            maxConnections: 2,
            sprite: 'diode.png'
        }
    ],
    requiredVoltages: [
        { node: [3, 4], target: 5, tolerance: 0.2 },
        { node: [6, 7], target: 3.3, tolerance: 0.1 },
        { node: [2, 5], target: 9, tolerance: 0.5 }
    ]
};

// Game State
let gameState = {
    running: false,
    timeRemaining: GAME_CONFIG.timeLimit,
    errors: 0,
    components: [],
    connections: [],
    selectedComponent: null,
    voltages: new Array(GAME_CONFIG.gridSize * GAME_CONFIG.gridSize).fill(0),
    timer: null
};
// Component Management
function createComponentTray() {
    const tray = document.querySelector('.component-tray');
    GAME_CONFIG.components.forEach(component => {
        const componentElement = createComponentElement(component);
        tray.appendChild(componentElement);
    });
}

function createComponentElement(component) {
    const element = document.createElement('div');
    element.className = 'component';
    element.draggable = true;
    element.dataset.type = component.type;
    
    const sprite = document.createElement('img');
    sprite.src = `{% static 'game/12/images/${component.sprite}' %}`;
    sprite.alt = component.type;
    
    const label = document.createElement('span');
    label.textContent = component.type;
    
    element.appendChild(sprite);
    element.appendChild(label);
    
    return element;
}

function createCircuitGrid() {
    const grid = document.querySelector('.circuit-grid');
    for (let i = 0; i < GAME_CONFIG.gridSize * GAME_CONFIG.gridSize; i++) {
        const cell = createGridCell(i);
        grid.appendChild(cell);
    }
}

function createGridCell(index) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = index;
    
    // Add connection points
    const connectionPoints = document.createElement('div');
    connectionPoints.className = 'connection-points';
    ['top', 'right', 'bottom', 'left'].forEach(direction => {
        const point = document.createElement('div');
        point.className = `connection-point ${direction}`;
        point.dataset.direction = direction;
        connectionPoints.appendChild(point);
    });
    
    cell.appendChild(connectionPoints);
    return cell;
}

// Drag and Drop Handlers
function handleDragStart(e) {
    if (!gameState.running) return;
    
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    if (!gameState.running) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    if (!gameState.running) return;
    
    e.preventDefault();
    const componentType = e.dataTransfer.getData('text/plain');
    const cell = e.target.closest('.grid-cell');
    
    if (cell && !cell.hasComponent) {
        placeComponent(componentType, cell);
    }
}

function placeComponent(type, cell) {
    const component = GAME_CONFIG.components.find(c => c.type === type);
    if (!component) return;
    
    const componentInstance = {
        ...component,
        id: generateUniqueId(),
        position: parseInt(cell.dataset.index),
        connections: []
    };
    
    gameState.components.push(componentInstance);
    renderComponent(componentInstance, cell);
    cell.hasComponent = true;
}

// Connection Management
function handleCellClick(e) {
    if (!gameState.running) return;
    
    const cell = e.target.closest('.grid-cell');
    const connectionPoint = e.target.closest('.connection-point');
    
    if (!connectionPoint) return;
    
    if (!gameState.selectedComponent) {
        selectConnectionPoint(cell, connectionPoint);
    } else {
        tryCreateConnection(cell, connectionPoint);
    }
}

function selectConnectionPoint(cell, point) {
    const component = findComponentInCell(cell);
    if (!component || component.connections.length >= component.maxConnections) return;
    
    gameState.selectedComponent = {
        component,
        point: point.dataset.direction,
        cell
    };
    point.classList.add('selected');
}

function tryCreateConnection(cell, point) {
    const targetComponent = findComponentInCell(cell);
    if (!targetComponent || 
        targetComponent.id === gameState.selectedComponent.component.id ||
        targetComponent.connections.length >= targetComponent.maxConnections) {
        cancelConnection();
        return;
    }
    
    createConnection(gameState.selectedComponent, {
        component: targetComponent,
        point: point.dataset.direction,
        cell
    });
}

function createConnection(start, end) {
    const connection = {
        id: generateUniqueId(),
        start: {
            componentId: start.component.id,
            point: start.point
        },
        end: {
            componentId: end.component.id,
            point: end.point
        }
    };
    
    gameState.connections.push(connection);
    start.component.connections.push(connection.id);
    end.component.connections.push(connection.id);
    
    renderConnection(connection);
    clearConnectionSelection();
}

// Rendering Functions
function renderComponent(component, cell) {
    const componentElement = document.createElement('div');
    componentElement.className = 'placed-component';
    componentElement.dataset.componentId = component.id;
    
    const sprite = document.createElement('img');
    sprite.src = `{% static 'game/12/images/${component.sprite}' %}`;
    sprite.alt = component.type;
    
    componentElement.appendChild(sprite);
    cell.appendChild(componentElement);
}

function renderConnection(connection) {
    const startCell = findCellByComponentId(connection.start.componentId);
    const endCell = findCellByComponentId(connection.end.componentId);
    
    const wire = createWireElement(
        getConnectionPointCoordinates(startCell, connection.start.point),
        getConnectionPointCoordinates(endCell, connection.end.point)
    );
    
    document.querySelector('.circuit-grid').appendChild(wire);
}

function createWireElement(start, end) {
    const wire = document.createElement('div');
    wire.className = 'wire';
    
    const length = calculateDistance(start, end);
    const angle = calculateAngle(start, end);
    
    wire.style.width = `${length}px`;
    wire.style.transform = `rotate(${angle}deg)`;
    wire.style.left = `${start.x}px`;
    wire.style.top = `${start.y}px`;
    
    return wire;
}

// Utility Functions
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function findComponentInCell(cell) {
    const index = parseInt(cell.dataset.index);
    return gameState.components.find(c => c.position === index);
}

function findCellByComponentId(componentId) {
    const component = gameState.components.find(c => c.id === componentId);
    return document.querySelector(`.grid-cell[data-index="${component.position}"]`);
}

function getConnectionPointCoordinates(cell, direction) {
    const rect = cell.getBoundingClientRect();
    const gridRect = document.querySelector('.circuit-grid').getBoundingClientRect();
    
    const point = cell.querySelector(`.connection-point.${direction}`);
    const pointRect = point.getBoundingClientRect();
    
    return {
        x: pointRect.left - gridRect.left + pointRect.width / 2,
        y: pointRect.top - gridRect.top + pointRect.height / 2
    };
}

function calculateDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + 
        Math.pow(point2.y - point1.y, 2)
    );
}

function calculateAngle(point1, point2) {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
}

function calculateVoltageEfficiency() {
    let totalDeviation = 0;
    let measurementPoints = 0;
    
    GAME_CONFIG.requiredVoltages.forEach(req => {
        const actualVoltage = gameState.voltages[req.node[0] * GAME_CONFIG.gridSize + req.node[1]];
        totalDeviation += Math.abs(actualVoltage - req.target) / req.target;
        measurementPoints++;
    });
    
    return Math.max(0, 100 - (totalDeviation / measurementPoints) * 100);
}

function updateStatusDisplay() {
    // Update time display
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    document.querySelector('.time-value').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update error counter
    document.querySelector('.error-value').textContent = 
        `${gameState.errors}/${GAME_CONFIG.maxErrors}`;
    
    // Update voltage meter
    updateVoltageMeter();
}

function updateVoltageMeter() {
    const averageVoltage = gameState.voltages.reduce((a, b) => a + b, 0) / gameState.voltages.length;
    const percentage = (averageVoltage / 12) * 100; // 12V is max voltage
    
    document.querySelector('.meter-value').textContent = `${averageVoltage.toFixed(1)}V`;
    document.querySelector('.meter-fill').style.width = `${percentage}%`;
}

function clearConnectionSelection() {
    if (gameState.selectedComponent) {
        const point = gameState.selectedComponent.cell
            .querySelector(`.connection-point.${gameState.selectedComponent.point}`);
        point.classList.remove('selected');
        gameState.selectedComponent = null;
    }
}

function cancelConnection() {
    clearConnectionSelection();
}

// Error Handling
function handleError(message) {
    gameState.errors++;
    updateStatusDisplay();
    
    if (gameState.errors >= GAME_CONFIG.maxErrors) {
        gameOver(false);
    }
    
    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 3000);
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initializeGame);