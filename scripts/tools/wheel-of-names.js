function initializeWheelOfNames(panel) {
    const nameInput = panel.querySelector('#name-input');
    const occurrenceInput = panel.querySelector('#occurrence-input');
    const addNameButton = panel.querySelector('#add-name-button');
    const nameList = panel.querySelector('.name-list');
    const spinButton = panel.querySelector('#spin-button');
    const resetButton = panel.querySelector('#reset-button');
    const scrollArea = panel.querySelector('.scroll-area');
    const spinsInput = panel.querySelector('#spins-input');
    const resultHistoryList = panel.querySelector('#result-history-list');

    let namesArray = [];
    let resultHistory = [];

    // Function to add names to the list
    addNameButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const occurrenceCount = parseInt(occurrenceInput.value);

        if (name && occurrenceCount > 0) {
            for (let i = 0; i < occurrenceCount; i++) {
                namesArray.push(name);
            }
            updateNameList();
            nameInput.value = '';
            occurrenceInput.value = 1;
        } else {
            alert('Please enter a valid name and occurrence count.');
        }
    });

    // Function to update the display of names in the list
    function updateNameList() {
        nameList.innerHTML = '';
        const uniqueNames = [...new Set(namesArray)];
        uniqueNames.forEach(name => {
            const count = namesArray.filter(n => n === name).length;
            const nameItem = document.createElement('div');
            nameItem.textContent = `${name} (${count})`;
            nameList.appendChild(nameItem);
        });
    }

    // Function to shuffle the names array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to spin the wheel with a looping scroll effect
    spinButton.addEventListener('click', () => {
        if (namesArray.length === 0) {
            alert('Please add some names before spinning.');
            return;
        }

        const spinsCount = parseInt(spinsInput.value);
        if (isNaN(spinsCount) || spinsCount < 1) {
            alert('Please enter a valid number of spins.');
            return;
        }

        let currentSpin = 0;

        function spinAndDisplayResult() {
            shuffleArray(namesArray);

            scrollArea.innerHTML = ''; // Clear previous display

            // Populate the scroll area with the shuffled names
            namesArray.forEach(name => {
                const scrollItem = document.createElement('div');
                scrollItem.className = 'wheel-text';
                scrollItem.textContent = name;
                scrollArea.appendChild(scrollItem);
            });

            // Clone the list to create a seamless loop
            namesArray.forEach(name => {
                const scrollItem = document.createElement('div');
                scrollItem.className = 'wheel-text';
                scrollItem.textContent = name;
                scrollArea.appendChild(scrollItem);
            });

            // Add the animation to the scroll area
            scrollArea.style.animation = 'scroll 1s linear infinite';

            // Stop the scrolling after a random time and pick a random name
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * namesArray.length);
                const selectedName = namesArray[randomIndex];

                // Stop the animation
                scrollArea.style.animation = 'none';

                // Clear the scroll area and display the selected name
                scrollArea.innerHTML = '';
                const resultItem = document.createElement('div');
                resultItem.className = 'wheel-text';
                resultItem.textContent = selectedName;
                scrollArea.appendChild(resultItem);

                // Update the result history
                updateResultHistory(selectedName);

                currentSpin++;
                if (currentSpin < spinsCount) {
                    setTimeout(spinAndDisplayResult, 1000); // Delay before next spin
                }
            }, 2000 + Math.random() * 3000); // Random delay between 2 to 5 seconds
        }

        spinAndDisplayResult(); // Start the first spin
    });

    // Function to update the result history
    function updateResultHistory(name) {
        resultHistory.unshift(name);
        if (resultHistory.length > 10) {
            resultHistory.pop(); // Keep only the last 10 results
        }
        renderResultHistory();
    }

    // Function to render the result history
    function renderResultHistory() {
        resultHistoryList.innerHTML = '';
        resultHistory.forEach((result, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${result}`;
            resultHistoryList.appendChild(listItem);
        });
    }

    // Function to reset the wheel of names
    resetButton.addEventListener('click', () => {
        namesArray = []; // Clear the names array
        nameList.innerHTML = ''; // Clear the name list display
        scrollArea.innerHTML = ''; // Clear the wheel display
        scrollArea.style.animation = 'none'; // Stop any ongoing animation
        resultHistory = []; // Clear the result history
        renderResultHistory(); // Update the history display
    });
}
