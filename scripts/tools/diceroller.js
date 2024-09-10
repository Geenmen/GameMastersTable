function initializeDiceRoller(panel) {
    const diceTypeSelect = panel.querySelector('#dice-type');
    const customDiceInput = panel.querySelector('#custom-dice-input');
    const diceCountInput = panel.querySelector('#dice-count');
    const rollButton = panel.querySelector('#roll-button');
    const diceIcon = panel.querySelector('#dice-icon');
    const rollResult = panel.querySelector('#roll-result');
    const rollHistory = panel.querySelector('#roll-history');
    const decrementBtn = panel.querySelector('#decrement-btn');
    const incrementBtn = panel.querySelector('#increment-btn');

    let history = [];

    // Check if all required elements are found
    if (!diceTypeSelect || !customDiceInput || !diceCountInput || !rollButton || !diceIcon || !rollResult || !rollHistory || !decrementBtn || !incrementBtn) {
        console.error('Error: One or more elements could not be found within the panel.');
        return;
    }

    // Toggle visibility of the custom dice input field
    diceTypeSelect.addEventListener('change', () => {
        if (diceTypeSelect.value === 'custom') {
            customDiceInput.style.display = 'block';
        } else {
            customDiceInput.style.display = 'none';
        }
    });

    // Roll Button Click Event
    rollButton.addEventListener('click', () => {
        const diceType = diceTypeSelect.value === 'custom' ? parseInt(customDiceInput.value) : parseInt(diceTypeSelect.value);
        const diceCount = parseInt(diceCountInput.value);

        if (isNaN(diceType) || diceType <= 0) {
            alert('Please enter a valid number of sides.');
            return;
        }

        if (diceCount <= 0) {
            alert('Please enter a valid number of dice.');
            return;
        }

        // Add a separate spin class for rotation and pulsate for scaling
        diceIcon.classList.add('spin', 'pulsate');

        setTimeout(() => {
            // Remove the animations
            diceIcon.classList.remove('spin', 'pulsate');

            let total = 0;
            let resultText = `${diceCount}d${diceType}: `;

            for (let i = 0; i < diceCount; i++) {
                const roll = Math.floor(Math.random() * diceType) + 1;
                total += roll;
                resultText += (i > 0 ? ', ' : '') + roll;
            }

            resultText += ` (Total: ${total})`;

            rollResult.textContent = resultText;
            addToHistory(resultText);
        }, 2000 + Math.random() * 3000); // Random delay between 2 to 5 seconds
    });

    // Add to History
    function addToHistory(result) {
        history.unshift(result);
        if (history.length > 10) {
            history.pop();
        }
        renderHistory();
    }

    // Render History
    function renderHistory() {
        rollHistory.innerHTML = '';
        history.forEach((item) => {
            const p = document.createElement('p');
            p.textContent = `${item}`;
            rollHistory.appendChild(p);
        });
    }

    // Decrement Button
    decrementBtn.addEventListener('click', () => {
        let currentValue = parseInt(diceCountInput.value);
        if (currentValue > 1) {
            diceCountInput.value = currentValue - 1;
        }
    });

    // Increment Button
    incrementBtn.addEventListener('click', () => {
        let currentValue = parseInt(diceCountInput.value);
        diceCountInput.value = currentValue + 1;
    });
}