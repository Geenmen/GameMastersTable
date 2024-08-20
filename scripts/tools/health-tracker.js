function initializeHealthTracker(panelContainer) {
    const characterList = panelContainer.querySelector('#character-list');
    const htAddNamedCharacterBtn = panelContainer.querySelector('#add-named-character');
    const htAddGenericCharacterBtn = panelContainer.querySelector('#add-generic-character');
    const htModal = panelContainer.querySelector('#healthtracker-modal');
    const htCloseModal = panelContainer.querySelector('.ht-close-modal');
    const htCharacterForm = panelContainer.querySelector('#healthtracker-character-form');

    // Log the elements to see if they are correctly found
    console.log('characterList:', characterList);
    console.log('htAddNamedCharacterBtn:', htAddNamedCharacterBtn);
    console.log('htAddGenericCharacterBtn:', htAddGenericCharacterBtn);
    console.log('htModal:', htModal);
    console.log('htCloseModal:', htCloseModal);
    console.log('htCharacterForm:', htCharacterForm);

    // Check if all required elements are found
    if (!characterList || !htAddNamedCharacterBtn || !htAddGenericCharacterBtn || !htModal || !htCloseModal || !htCharacterForm) {
        console.error('Error: One or more elements could not be found within the panel.');
        return;
    }

    let genericCounter = 1;

    // Open the modal for adding a named character
    htAddNamedCharacterBtn.addEventListener('click', () => {
        panelContainer.querySelector('#ht-character-name').value = ''; // Clear name field for named character
        showHtModal();
    });

    // Open the modal for adding a generic character
    htAddGenericCharacterBtn.addEventListener('click', () => {
        panelContainer.querySelector('#ht-character-name').value = `Generic Character ${genericCounter++}`;
        showHtModal();
    });

    // Close the modal when the close button is clicked
    htCloseModal.addEventListener('click', () => {
        closeHtModal();
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == htModal) {
            closeHtModal();
        }
    });

    // Handle the form submission to add a character
    htCharacterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = panelContainer.querySelector('#ht-character-name').value;
        const maxHealth = parseInt(panelContainer.querySelector('#ht-character-max-health').value);
        const currentHealth = parseInt(panelContainer.querySelector('#ht-character-current-health').value);
        const status = panelContainer.querySelector('input[name="ht-status"]:checked').value;

        if (name && !isNaN(maxHealth) && !isNaN(currentHealth) && status) {
            addCharacter(name, maxHealth, currentHealth, status);
        }

        closeHtModal();
    });

    // Function to show the modal
    function showHtModal() {
        htModal.style.display = 'block';
    }

    // Function to close the modal
    function closeHtModal() {
        htModal.style.display = 'none';
    }

    // Function to add a character to the list
    function addCharacter(name, maxHealth, currentHealth, status) {
        const characterEntry = document.createElement('div');
        characterEntry.className = 'character-entry';

        const healthPercentage = (currentHealth / maxHealth) * 100;

        characterEntry.innerHTML = `
            <input type="text" class="character-name" value="${name}" />
            <div class="character-health">
                <button class="health-btn decrement-btn">-</button>
                <div class="health-bar" style="background: linear-gradient(to right, var(--health-color) ${healthPercentage}%, var(--empty-health-color) ${healthPercentage}%);"></div>
                <span class="health-text">${currentHealth} / ${maxHealth}</span>
                <button class="health-btn increment-btn">+</button>
            </div>
            <div class="character-status">
                <label><input type="radio" name="status-${name}" value="Friendly" ${status === 'Friendly' ? 'checked' : ''}> Friendly</label>
                <label><input type="radio" name="status-${name}" value="Neutral" ${status === 'Neutral' ? 'checked' : ''}> Neutral</label>
                <label><input type="radio" name="status-${name}" value="Aggressive" ${status === 'Aggressive' ? 'checked' : ''}> Aggressive</label>
                <label><input type="radio" name="status-${name}" value="Incapacitated" ${status === 'Incapacitated' ? 'checked' : ''}> Incapacitated</label>
                <label><input type="radio" name="status-${name}" value="Player" ${status === 'Player' ? 'checked' : ''}> Player</label>
            </div>
            <button class="delete-btn">🗑️</button>
        `;

        const decrementBtn = characterEntry.querySelector('.decrement-btn');
        const incrementBtn = characterEntry.querySelector('.increment-btn');
        const healthText = characterEntry.querySelector('.health-text');
        const healthBar = characterEntry.querySelector('.health-bar');

        decrementBtn.addEventListener('click', () => {
            if (currentHealth > 0) {
                currentHealth--;
                updateHealthDisplay();
            }
        });

        incrementBtn.addEventListener('click', () => {
            if (currentHealth < maxHealth) {
                currentHealth++;
                updateHealthDisplay();
            }
        });

        function updateHealthDisplay() {
            const healthPercentage = (currentHealth / maxHealth) * 100;
            healthBar.style.background = `linear-gradient(to right, var(--health-color) ${healthPercentage}%, var(--empty-health-color) ${healthPercentage}%)`;
            healthText.textContent = `${currentHealth} / ${maxHealth}`;
        }

        const deleteBtn = characterEntry.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            characterEntry.remove();
        });

        characterList.appendChild(characterEntry);
    }
}
