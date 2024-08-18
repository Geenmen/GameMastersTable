function initializeOrderTracker(panel) {
    const characterNameInput = panel.querySelector('#character-name-input');
    const addCharacterBtn = panel.querySelector('#add-character-btn');
    const turnOrderList = panel.querySelector('#turn-order-list');
    const nextTurnBtn = panel.querySelector('#next-turn-btn');
    let currentTurnIndex = 0;

    // Add character to the turn order
    addCharacterBtn.addEventListener('click', () => {
        const name = characterNameInput.value.trim();
        if (name) {
            addCharacterToOrder(name);
            characterNameInput.value = ''; // Clear the input
        }
    });

    // Function to add a character to the list
    function addCharacterToOrder(name) {
        const li = document.createElement('li');
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        nameSpan.className = 'character-name';
        nameSpan.contentEditable = true;

        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.className = 'move-up-btn';

        const downBtn = document.createElement('button');
        downBtn.textContent = '↓';
        downBtn.className = 'move-down-btn';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.className = 'remove-btn';

        li.appendChild(nameSpan);
        li.appendChild(upBtn);
        li.appendChild(downBtn);
        li.appendChild(removeBtn);

        turnOrderList.appendChild(li);

        // Move character up in the order
        upBtn.addEventListener('click', () => {
            const prev = li.previousElementSibling;
            if (prev) {
                turnOrderList.insertBefore(li, prev);
            }
        });

        // Move character down in the order
        downBtn.addEventListener('click', () => {
            const next = li.nextElementSibling;
            if (next) {
                turnOrderList.insertBefore(next, li);
            }
        });

        // Remove character from the order
        removeBtn.addEventListener('click', () => {
            li.remove();
            if (turnOrderList.children.length === 0) {
                currentTurnIndex = 0; // Reset turn index if no characters left
            }
            updateTurnHighlight(); // Ensure turn highlight updates if necessary
        });

        // Enable in-place editing for the character name
        nameSpan.addEventListener('blur', () => {
            if (nameSpan.textContent.trim() === '') {
                nameSpan.textContent = 'Unnamed Character'; // Default name if left blank
            }
        });

        updateTurnHighlight(); // Ensure the first character added is highlighted as current
    }

    // Function to update the turn highlight
    function updateTurnHighlight() {
        const items = turnOrderList.children;
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('current-turn'); // Remove the highlight from all items
        }
        if (items.length > 0) {
            items[currentTurnIndex].classList.add('current-turn'); // Add highlight to the current item
        }
    }

    // Advance to the next turn
    nextTurnBtn.addEventListener('click', () => {
        const items = turnOrderList.children;
        if (items.length > 0) {
            currentTurnIndex = (currentTurnIndex + 1) % items.length;
            updateTurnHighlight();
        }
    });

    // Initialize the first highlight if the list already has characters (e.g., from previous session)
    if (turnOrderList.children.length > 0) {
        updateTurnHighlight();
    }
}
