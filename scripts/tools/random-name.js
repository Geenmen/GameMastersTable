function initializeRandomName(panel) {
    const nameStyleSelect = panel.querySelector('#name-style');
    const firstNameCheckbox = panel.querySelector('#first-name-checkbox');
    const lastNameCheckbox = panel.querySelector('#last-name-checkbox');
    const generateButton = panel.querySelector('#generate-name-button');
    const resultDisplay = panel.querySelector('#name-result');
    const nameHistoryList = panel.querySelector('#name-history-list');

    let nameHistory = [];

    // Fetch the JSON data
    fetch('assets/libraries/Random/RandomName.json')
        .then(response => response.json())
        .then(data => {
            // Create the "Select Category" option
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'All Categories';
            nameStyleSelect.appendChild(defaultOption);

            // Populate the name style dropdown with other options
            const styles = data.styles;
            for (const style in styles) {
                const option = document.createElement('option');
                option.value = style;
                option.textContent = style.charAt(0).toUpperCase() + style.slice(1);
                nameStyleSelect.appendChild(option);
            }

            // Generate the name based on user selection
            generateButton.addEventListener('click', () => {
                const selectedStyle = nameStyleSelect.value;
                const includeFirstName = firstNameCheckbox.checked;
                const includeLastName = lastNameCheckbox.checked;

                if (!includeFirstName && !includeLastName) {
                    resultDisplay.textContent = "Please select at least one name type.";
                    return;
                }

                let firstName = '';
                let lastName = '';

                if (selectedStyle === 'all') {
                    // If "Select Category" is chosen, pull from all available categories
                    const allFirstNames = [];
                    const allLastNames = [];
                    for (const style in styles) {
                        if (includeFirstName) {
                            allFirstNames.push(...styles[style].firstNames);
                        }
                        if (includeLastName) {
                            allLastNames.push(...styles[style].lastNames);
                        }
                    }
                    firstName = includeFirstName ? getRandomName(allFirstNames) : '';
                    lastName = includeLastName ? getRandomName(allLastNames) : '';
                } else {
                    // Pull from the selected category
                    firstName = includeFirstName ? getRandomName(styles[selectedStyle].firstNames) : '';
                    lastName = includeLastName ? getRandomName(styles[selectedStyle].lastNames) : '';
                }

                const fullName = `${firstName} ${lastName}`.trim();
                resultDisplay.textContent = fullName;

                // Update the name history
                updateNameHistory(fullName);
            });

            // Function to get a random name from an array
            function getRandomName(nameArray) {
                return nameArray[Math.floor(Math.random() * nameArray.length)];
            }

            // Function to update the name history
            function updateNameHistory(name) {
                nameHistory.unshift(name);
                if (nameHistory.length > 10) {
                    nameHistory.pop(); // Keep only the last 10 names
                }
                renderNameHistory();
            }

            // Function to render the name history
            function renderNameHistory() {
                nameHistoryList.innerHTML = '';
                nameHistory.forEach((name, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${index + 1}. ${name}`;
                    nameHistoryList.appendChild(listItem);
                });
            }
        })
        .catch(err => console.error("Error loading names:", err));
}
