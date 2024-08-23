function initializeBeastiary(panel) {
    const crSelect = panel.querySelector('#cr-select');
    const loadCreaturesBtn = panel.querySelector('#load-creatures-btn');
    const creatureListContainer = panel.querySelector('#creature-list-container');
    const creatureList = panel.querySelector('#creature-list');
    const creatureDetailsContainer = panel.querySelector('#creature-details-container');
    const creatureImage = panel.querySelector('#creature-image');
    const creatureInfo = panel.querySelector('.creature-info');

    let creaturesData = {};  // To store the creatures.json data

    // Fetch the initial creatures.json
    fetch('assets/libraries/Beastiary/creatures.json')
        .then(response => response.json())
        .then(data => {
            creaturesData = data;
            populateCRDropdown(creaturesData);
            ensureResetButton(panel); // Ensure reset button is there
        })
        .catch(err => console.error('Error loading creatures.json:', err));

    // Populate the CR dropdown based on the creatures.json content
    function populateCRDropdown(data) {
        const crLevels = Object.keys(data);
        crLevels.forEach(cr => {
            const option = document.createElement('option');
            option.value = cr;
            option.textContent = `Challenge Rating ${cr.slice(2)}`;
            crSelect.appendChild(option);
        });
    }

    loadCreaturesBtn.addEventListener('click', () => {
        const selectedCR = crSelect.value;
        if (selectedCR) {
            loadCreaturesForCR(selectedCR);
        }
    });

    function loadCreaturesForCR(cr) {
        creatureList.innerHTML = '';
        creatureListContainer.style.display = 'block';
        creatureDetailsContainer.style.display = 'none';

        const creatures = creaturesData[cr] || [];
        creatures.forEach(creature => {
            const listItem = document.createElement('li');
            listItem.textContent = creature.name;
            listItem.addEventListener('click', () => loadCreatureDetails(creature.jsonPath, creature.imagePath));
            creatureList.appendChild(listItem);
        });
    }

    function loadCreatureDetails(jsonPath, imagePath) {
        console.log(`Fetching JSON from path: ${jsonPath}`);  // Log the path for debugging
        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayCreatureDetails(data, imagePath);
            })
            .catch(err => {
                console.error(`Error loading creature details from ${jsonPath}:`, err);
            });
    }

    function displayCreatureDetails(data, imagePath) {
        const details = [];

        // Set creature image, use default if none found
        creatureImage.src = imagePath || 'assets/libraries/Beastiary/default-creature-GMT.png';

        details.push(`<h2>${data.creature_name}</h2>`);
        if (data.type) details.push(`<p><strong>Type:</strong> ${data.type}</p>`);
        if (data.alignment) details.push(`<p><strong>Alignment:</strong> ${data.alignment}</p>`);
        if (data.description) details.push(`<p><strong>Description:</strong> ${data.description}</p>`);

        // Add more details as needed, such as abilities, stats, etc.
        if (data.armor_class) details.push(`<p><strong>Armor Class:</strong> ${data.armor_class}</p>`);
        if (data.hit_points) details.push(`<p><strong>Hit Points:</strong> ${data.hit_points}</p>`);
        if (data.speed) {
            const speeds = Object.entries(data.speed).map(([type, value]) => `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`).join(', ');
            details.push(`<p><strong>Speed:</strong> ${speeds}</p>`);
        }

        // Add ability scores, saving throws, skills, etc.
        const abilityScores = data.ability_scores || {};
        if (Object.values(abilityScores).some(score => score)) {
            details.push('<div class="ability-scores"><h3>Ability Scores</h3>');
            for (const [ability, value] of Object.entries(abilityScores)) {
                if (value) details.push(`<p>${ability.charAt(0).toUpperCase() + ability.slice(1)}: ${value}</p>`);
            }
            details.push('</div>');
        }

        // Display the creature details
        creatureInfo.innerHTML = details.join('');
        creatureDetailsContainer.style.display = 'block';
        creatureListContainer.style.display = 'none'; // Hide the list after selection
    }

    // Ensure Reset Button is added after content is loaded
    function ensureResetButton(panel) {
        let resetBtn = panel.querySelector('#bestiary-reset-btn');

        // If the reset button doesn't exist, create it
        if (!resetBtn) {
            resetBtn = document.createElement('button');
            resetBtn.id = 'bestiary-reset-btn';
            resetBtn.textContent = 'Reset';
            panel.querySelector('.bestiary-header').appendChild(resetBtn);
        }

        // Reset button functionality
        resetBtn.addEventListener('click', () => {
            resetPanel(); // Reset functionality
        });
    }

    // Soft reset function
    function resetPanel() {
        creatureListContainer.style.display = 'none';
        creatureDetailsContainer.style.display = 'none';
        crSelect.value = '';
    }
}
