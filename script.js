document.addEventListener('DOMContentLoaded', function() {
    // Initialize level progress if not exists
    if (!localStorage.getItem('levelProgress')) {
        localStorage.setItem('levelProgress', '1');
    }

    const currentLevel = parseInt(localStorage.getItem('levelProgress'));
    setupLevels(currentLevel);
    setupScrollAnimations();
});

function setupScrollAnimations() {
    const boxes = document.querySelectorAll('.box');
    const sectionTitles = document.querySelectorAll('.section-title');
    
    function checkElements() {
        const triggerBottom = window.innerHeight * 0.8;

        sectionTitles.forEach(title => {
            const titleTop = title.getBoundingClientRect().top;
            if (titleTop < triggerBottom) {
                title.classList.add('visible');
            }
        });

        boxes.forEach(box => {
            const boxTop = box.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                box.classList.add('visible');
            }
        });
    }

    checkElements();
    window.addEventListener('scroll', checkElements);
}

function setupLevels(currentLevel) {
    const levelBoxes = document.querySelectorAll('.box');
    
    levelBoxes.forEach((box) => {
        const levelNumber = parseInt(box.getAttribute('data-level'));
        const href = box.getAttribute('data-href');
        
        // Add visual indication for locked levels
        if (levelNumber > currentLevel) {
            box.classList.add('locked');
        }
        
        box.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if the level is locked
            if (levelNumber > currentLevel) {
                showLockMessage(levelNumber);
                return;
            }
            
            // Only allow navigation if the level is unlocked
            if (href && levelNumber <= currentLevel) {
                window.location.href = href;
            }
        });
    });
}

function showLockMessage(levelNumber) {
    const existingModal = document.querySelector('.level-lock-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'level-lock-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Level Locked!</h2>
            <p>Please complete Level ${levelNumber - 1} to unlock this level.</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Function to check if a level is unlocked
function isLevelUnlocked(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress'));
    return levelNumber <= currentProgress;
}

// Function to complete a level (call this from your game files)
function completeLevel(levelNumber) {
    const currentProgress = parseInt(localStorage.getItem('levelProgress'));
    if (levelNumber === currentProgress) {
        localStorage.setItem('levelProgress', (currentProgress + 1).toString());
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.level-lock-modal');
        if (modal) modal.remove();
    }
});

// Add this to clear progress for testing (remove in production)
function resetProgress() {
    localStorage.setItem('levelProgress', '1');
    location.reload();
}