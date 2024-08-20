function initializeStatTracker(panel) {
    const statList = panel.querySelector('#stat-list');
    const addCharacterBtn = panel.querySelector('#add-character-btn');
    const statModal = panel.querySelector('#stat-modal');
    const closeModalBtn = panel.querySelector('.close-modal');
    const statNameInput = panel.querySelector('#stat-name');
    const confirmAddStatBtn = panel.querySelector('#confirm-add-stat');
    let currentStatBlocksContainer = null; // To keep track of where to add the stat block

    // Ensure modal is hidden by default
    statModal.style.display = 'none';

    // Add Character Button Event Listener
    addCharacterBtn.addEventListener('click', addCharacter);

    function addCharacter() {
        const characterEntry = document.createElement('div');
        characterEntry.className = 'character-entry';

        characterEntry.innerHTML = `
            <div class="character-header">
                <input type="text" class="character-name" placeholder="Character Name" />
                <button class="delete-character" title="Delete Character">🗑️</button>
            </div>
            <div class="character-details">
                <div class="character-status">
                    <label><input type="radio" name="status-${Date.now()}" value="Active" checked> Active</label>
                    <label><input type="radio" name="status-${Date.now()}" value="Resting"> Resting</label>
                    <label><input type="radio" name="status-${Date.now()}" value="Incapacitated"> Incapacitated</label>
                    <label><input type="radio" name="status-${Date.now()}" value="Stable"> Stable</label>
                    <label><input type="radio" name="status-${Date.now()}" value="Dying"> Dying</label>
                    <label><input type="radio" name="status-${Date.now()}" value="Injured"> Injured</label>
                </div>
                <div class="stat-blocks">
                    <button class="add-stat-block" title="Add Stat Block">Add Stat Block</button>
                </div>
            </div>
        `;

        // Add event listener to delete character
        characterEntry.querySelector('.delete-character').addEventListener('click', () => {
            characterEntry.remove();
        });

        // Add event listener to show modal for adding stat block
        characterEntry.querySelector('.add-stat-block').addEventListener('click', () => {
            currentStatBlocksContainer = characterEntry.querySelector('.stat-blocks');
            showStatModal();
        });

        // Append the character entry to the list
        statList.appendChild(characterEntry);
    }

    function showStatModal() {
        statModal.style.display = 'block';
    }

    function closeStatModal() {
        statModal.style.display = 'none';
        statNameInput.value = ''; // Clear the input field after closing
    }

    closeModalBtn.addEventListener('click', closeStatModal);

    window.addEventListener('click', (event) => {
        if (event.target == statModal) {
            closeStatModal();
        }
    });

    confirmAddStatBtn.addEventListener('click', () => {
        const statName = statNameInput.value.trim();
        if (statName) {
            addStatBlock(currentStatBlocksContainer, statName);
            closeStatModal();
        }
    });

    function addStatBlock(statBlocksContainer, statName) {
        const statBlock = document.createElement('div');
        statBlock.className = 'stat-block';

        statBlock.innerHTML = `
            <button class="stat-decrement">-</button>
            <span class="stat-name">${statName}</span>
            <span class="stat-value">0</span>
            <button class="stat-increment">+</button>
            <button class="delete-stat" title="Delete Stat">🗑️</button>
        `;

        // Add event listeners for increment and decrement buttons
        statBlock.querySelector('.stat-decrement').addEventListener('click', () => {
            const statValue = statBlock.querySelector('.stat-value');
            let currentValue = parseInt(statValue.textContent);
            statValue.textContent = Math.max(currentValue - 1, 0); // Prevent negative values
        });

        statBlock.querySelector('.stat-increment').addEventListener('click', () => {
            const statValue = statBlock.querySelector('.stat-value');
            let currentValue = parseInt(statValue.textContent);
            statValue.textContent = currentValue + 1;
        });

        // Add event listener to delete stat block
        statBlock.querySelector('.delete-stat').addEventListener('click', () => {
            statBlock.remove();
        });

        // Insert the stat block before the "Add Stat Block" button
        statBlocksContainer.insertBefore(statBlock, statBlocksContainer.querySelector('.add-stat-block'));
    }
}
