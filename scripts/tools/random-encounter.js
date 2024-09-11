function initializeRandomEncounter(panel) {
    const encounterSettingSelect = panel.querySelector('#encounter-setting');
    const generateButton = panel.querySelector('#generate-encounter-button');
    const resultDisplay = panel.querySelector('#encounter-result');
    const encounterHistoryList = panel.querySelector('#encounter-history-list');

    let encounterHistory = [];

    // Fetch the JSON data
    fetch('assets/libraries/Random/RandomEncounters.json')
        .then(response => response.json())
        .then(data => {
            // Create the "All Settings" option
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'All Settings';
            encounterSettingSelect.appendChild(defaultOption);

            // Populate the setting dropdown with unique options
            const settings = [...new Set(data.encounters.map(encounter => encounter.setting))];
            settings.forEach(setting => {
                const option = document.createElement('option');
                option.value = setting;
                option.textContent = setting.charAt(0).toUpperCase() + setting.slice(1);
                encounterSettingSelect.appendChild(option);
            });

            // Generate the encounter based on user selection
            generateButton.addEventListener('click', () => {
                const selectedSetting = encounterSettingSelect.value;
                let filteredEncounters = data.encounters;

                if (selectedSetting !== 'all') {
                    filteredEncounters = filteredEncounters.filter(encounter => encounter.setting === selectedSetting);
                }

                if (filteredEncounters.length === 0) {
                    resultDisplay.textContent = "No encounters available for the selected setting.";
                    return;
                }

                const randomEncounter = getRandomEncounter(filteredEncounters);
                displayEncounter(randomEncounter);

                // Update the encounter history
                updateEncounterHistory(randomEncounter);
            });

            // Function to get a random encounter from an array
            function getRandomEncounter(encounterArray) {
                return encounterArray[Math.floor(Math.random() * encounterArray.length)];
            }

            // Function to display the current encounter
            function displayEncounter(encounter) {
                resultDisplay.innerHTML = `
                    <h4>${encounter.title}</h4>
                    <p><strong>Setting:</strong> ${encounter.setting}</p>
                    <p>${encounter.description}</p>
                `;
            }

            // Function to update the encounter history
            function updateEncounterHistory(encounter) {
                encounterHistory.unshift(encounter);
                if (encounterHistory.length > 10) {
                    encounterHistory.pop(); // Keep only the last 10 encounters
                }
                renderEncounterHistory();
            }

            // Function to render the encounter history
            function renderEncounterHistory() {
                encounterHistoryList.innerHTML = '';
                encounterHistory.forEach((encounter, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<strong>${index + 1}. ${encounter.title}</strong> - ${encounter.setting}: ${encounter.description}`;
                    encounterHistoryList.appendChild(listItem);
                });
            }
        })
        .catch(err => console.error("Error loading encounters:", err));
}
