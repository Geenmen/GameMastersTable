function initializeBeastiary(panel) {
    const crSelect = panel.querySelector('#cr-select');
    const loadCreaturesBtn = panel.querySelector('#load-creatures-btn');
    const creatureGridContainer = panel.querySelector('#creature-grid-container');
    const bestiaryModal = panel.querySelector('#bestiary-modal');
    const bestiaryModalClose = panel.querySelector('#bestiary-modal-close');
    const creatureDetails = panel.querySelector('.creature-details');

    let creaturesData = {}; // To store the creatures.json data

    // Fetch the initial creatures.json
    fetch('assets/libraries/Beastiary/creatures.json')
        .then(response => response.json())
        .then(data => {
            creaturesData = data;
            populateCRDropdown(creaturesData);
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
        creatureGridContainer.innerHTML = '';
        creatureGridContainer.style.display = 'grid';

        const creatures = creaturesData[cr] || [];
        creatures.forEach(creature => {
            const card = document.createElement('div');
            card.classList.add('creature-card');

            const img = document.createElement('img');
            img.src = creature.imagePath || 'assets/libraries/Beastiary/default-creature-GMT.png';
            img.alt = creature.name.replace(/_/g, ' ');

            const name = document.createElement('h3');
            name.textContent = creature.name.replace(/_/g, ' ');

            card.appendChild(img);
            card.appendChild(name);

            card.addEventListener('click', () => loadCreatureDetails(creature.jsonPath, creature.imagePath));

            creatureGridContainer.appendChild(card);
        });
    }

    function loadCreatureDetails(jsonPath, imagePath) {
        fetch(jsonPath)
            .then(response => response.json())
            .then(data => {
                displayCreatureDetails(data, imagePath);
                openBestiaryModal();
            })
            .catch(err => console.error(`Error loading creature details from ${jsonPath}:`, err));
    }

    function displayCreatureDetails(data, imagePath) {
        creatureDetails.innerHTML = '';

        // Creature Image
        const img = document.createElement('img');
        img.src = imagePath || 'assets/libraries/Beastiary/default-creature-GMT.png';
        img.alt = data.creature_name.replace(/_/g, ' ');

        // Creature Name
        const name = document.createElement('h2');
        name.textContent = data.creature_name.replace(/_/g, ' ');

        // Basic Info
        const basicInfo = document.createElement('p');
        basicInfo.innerHTML = `<strong>Type:</strong> ${data.type ? data.type.replace(/_/g, ' ') : 'Unknown'} | <strong>Alignment:</strong> ${data.alignment || 'Unknown'}`;

        creatureDetails.appendChild(img);
        creatureDetails.appendChild(name);
        creatureDetails.appendChild(basicInfo);

        // Compact Stats
        const statsList = document.createElement('p');
        statsList.innerHTML = `
            <strong>AC:</strong> ${data.armor_class || 'N/A'}, 
            <strong>HP:</strong> ${data.hit_points || 'N/A'}, 
            <strong>Speed:</strong> ${formatSpeed(data.speed)}
        `;
        creatureDetails.appendChild(statsList);

        // Ability Scores
        if (data.ability_scores) {
            const abilities = document.createElement('p');
            abilities.innerHTML = formatAbilityScores(data.ability_scores);
            creatureDetails.appendChild(abilities);
        }

        // Traits, Actions, etc.
        const sections = ['traits', 'actions', 'reactions', 'legendary_actions'];

        sections.forEach(section => {
            if (data[section] && data[section].length > 0) {
                const sectionTitle = document.createElement('h3');
                sectionTitle.textContent = formatSectionTitle(section);

                creatureDetails.appendChild(sectionTitle);

                data[section].forEach(item => {
                    const itemElement = document.createElement('p');
                    itemElement.innerHTML = `<strong>${item.name.replace(/_/g, ' ')}:</strong> ${item.description}`;
                    creatureDetails.appendChild(itemElement);
                });
            }
        });
    }

    function openBestiaryModal() {
        bestiaryModal.style.display = 'flex';
    }

    function closeBestiaryModal() {
        bestiaryModal.style.display = 'none';
    }

    bestiaryModalClose.addEventListener('click', closeBestiaryModal);

    // Close the modal if the user clicks outside of the content
    bestiaryModal.addEventListener('click', (e) => {
        if (e.target === bestiaryModal) {
            closeBestiaryModal();
        }
    });

    // Reset Button functionality
    ensureResetButton(panel);

    function ensureResetButton(panel) {
        const resetBtn = panel.querySelector('#bestiary-reset-btn');
        resetBtn.addEventListener('click', () => {
            resetPanel();
        });
    }

    function resetPanel() {
        creatureGridContainer.style.display = 'none';
        crSelect.value = '';
        creatureGridContainer.innerHTML = '';
    }

    // Utility functions
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function formatSectionTitle(section) {
        return section
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    function formatSpeed(speedObj) {
        if (!speedObj) return 'N/A';
        return Object.entries(speedObj)
            .map(([type, value]) => `${capitalize(type)} ${value}`)
            .join(', ');
    }

    function formatAbilityScores(abilityScores) {
        return Object.entries(abilityScores)
            .map(([ability, score]) => `<strong>${ability.toUpperCase()}:</strong> ${score}`)
            .join(', ');
    }
}
