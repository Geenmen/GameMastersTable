function initializeWheelOfNames(panel) {
    const nameInput = panel.querySelector('#name-input');
    const occurrenceInput = panel.querySelector('#occurrence-input');
    const addNameButton = panel.querySelector('#add-name-button');
    const nameList = panel.querySelector('.name-list');
    const spinButton = panel.querySelector('#spin-button');
    const resetButton = panel.querySelector('#reset-button');
    const scrollArea = panel.querySelector('.scroll-area');

    let namesArray = [];

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

        // Shuffle the names array for random order display
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
        }, 2000 + Math.random() * 3000); // Random delay between 2 to 5 seconds
    });

    // Function to reset the wheel of names
    resetButton.addEventListener('click', () => {
        namesArray = []; // Clear the names array
        nameList.innerHTML = ''; // Clear the name list display
        scrollArea.innerHTML = ''; // Clear the wheel display
        scrollArea.style.animation = 'none'; // Stop any ongoing animation
    });
}