class TowerOfHanoi {
    constructor() {
        this.selectedDisk = null;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.numberOfDisks = 5; // Fixed to 5 disks
        this.towers = [[], [], []];
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#FFD93D', 
            '#6C5CE7', '#A8E6CF'
        ];
    }

    initializeGame() {
        this.moves = 0;
        this.selectedDisk = null;
        this.towers = [[], [], []];
        this.updateMovesDisplay();
        this.startTimer();

        // Create disks and add to first tower
        for (let i = this.numberOfDisks - 1; i >= 0; i--) {
            const disk = {
                size: i + 1,
                element: this.createDiskElement(i)
            };
            this.towers[0].push(disk);
        }

        this.updateTowersDisplay();
    }

    createDiskElement(index) {
        const disk = document.createElement('div');
        disk.className = 'disk';
        const width = 160 - (index * 25); // Decreasing width for each smaller disk
        disk.style.width = `${width}px`;
        disk.style.backgroundColor = this.colors[index];
        return disk;
    }

    updateTowersDisplay() {
        const towerElements = document.querySelectorAll('.tower');
        
        // Clear all towers
        towerElements.forEach(tower => {
            const disks = tower.querySelectorAll('.disk');
            disks.forEach(disk => disk.remove());
        });

        // Update each tower
        this.towers.forEach((tower, towerIndex) => {
            const towerElement = document.getElementById(`tower${towerIndex + 1}`);
            tower.forEach((disk, diskIndex) => {
                const diskElement = disk.element;
                diskElement.style.bottom = `${diskIndex * 35 + 30}px`; // Stack disks
                towerElement.appendChild(diskElement);
            });
        });
    }

    handleDiskClick(towerIndex) {
        if (this.selectedDisk === null) {
            // Select a disk if it's the top disk of the tower
            if (this.towers[towerIndex].length > 0) {
                this.selectedDisk = towerIndex;
                const topDisk = this.towers[towerIndex][this.towers[towerIndex].length - 1].element;
                topDisk.classList.add('selected-disk');
            }
        } else {
            // Attempt to move the selected disk
            this.moveDisk(this.selectedDisk, towerIndex);
        }
    }

    moveDisk(fromTower, toTower) {
        if (this.isValidMove(fromTower, toTower)) {
            const disk = this.towers[fromTower].pop();
            this.towers[toTower].push(disk);
            this.moves++;
            this.updateMovesDisplay();
            
            // Remove selection highlight
            disk.element.classList.remove('selected-disk');
            
            this.updateTowersDisplay();
            
            // Check for win
            if (this.checkWin()) {
                this.handleWin();
            }
        }
        
        // Clear selection
        if (this.selectedDisk !== null) {
            const topDisk = this.towers[fromTower][this.towers[fromTower].length - 1]?.element;
            if (topDisk) {
                topDisk.classList.remove('selected-disk');
            }
        }
        this.selectedDisk = null;
    }

    isValidMove(fromTower, toTower) {
        if (fromTower === toTower) return false;
        if (this.towers[fromTower].length === 0) return false;

        const movingDisk = this.towers[fromTower][this.towers[fromTower].length - 1];
        const targetDisk = this.towers[toTower][this.towers[toTower].length - 1];

        return !targetDisk || movingDisk.size < targetDisk.size;
    }

    checkWin() {
        return this.towers[2].length === this.numberOfDisks;
    }

    handleWin() {
        clearInterval(this.timerInterval);
        const minMoves = Math.pow(2, this.numberOfDisks) - 1;
        
        document.getElementById('final-moves').textContent = `Moves: ${this.moves}`;
        document.getElementById('final-time').textContent = 
            `Time: ${document.getElementById('timer').textContent.split(': ')[1]}`;
        
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('win-screen').classList.remove('hidden');
    }

    updateMovesDisplay() {
        document.getElementById('moves').textContent = `Moves: ${this.moves}`;
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.startTime = new Date();
        this.timerInterval = setInterval(() => {
            const currentTime = new Date();
            const timeDiff = Math.floor((currentTime - this.startTime) / 1000);
            const minutes = Math.floor(timeDiff / 60);
            const seconds = timeDiff % 60;
            document.getElementById('timer').textContent = 
                `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

// Game initialization and event listeners
document.addEventListener('DOMContentLoaded', () => {
    const game = new TowerOfHanoi();

    // Start game button
    document.getElementById('start-game').addEventListener('click', () => {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        game.initializeGame();
    });

    // Tower click handlers
    document.querySelectorAll('.tower').forEach((tower, index) => {
        tower.addEventListener('click', () => game.handleDiskClick(index));
    });

    // Restart button
    document.getElementById('restart').addEventListener('click', () => {
        game.initializeGame();
    });

    // Play again button
    document.getElementById('play-again').addEventListener('click', () => {
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        game.initializeGame();
    });

    // New game button
    document.getElementById('new-game').addEventListener('click', () => {
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
    });
});