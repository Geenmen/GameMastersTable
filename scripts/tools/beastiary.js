function initializeBeastiary(panel) {
    const crSelect = panel.querySelector('#cr-select');
    const loadCreaturesBtn = panel.querySelector('#load-creatures-btn');
    const creatureListContainer = panel.querySelector('#creature-list-container');
    const creatureList = panel.querySelector('#creature-list');
    const creatureDetailsContainer = panel.querySelector('#creature-details-container');
    const creatureImage = panel.querySelector('#creature-image');
    const creatureInfo = panel.querySelector('.creature-info');
    const bestiaryModal = panel.querySelector('#bestiary-modal');
    const bestiaryModalClose = panel.querySelector('#bestiary-modal-close');

    let creaturesData = {};  // To store the creatures.json data

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
        creatureList.innerHTML = '';
        creatureListContainer.style.display = 'block';

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
                openBestiaryModal(); // Open the modal when creature details are displayed
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

        if (data.armor_class) details.push(`<p><strong>Armor Class:</strong> ${data.armor_class}</p>`);
        if (data.hit_points) details.push(`<p><strong>Hit Points:</strong> ${data.hit_points}</p>`);
        if (data.speed) {
            const speeds = Object.entries(data.speed).map(([type, value]) => `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`).join(', ');
            details.push(`<p><strong>Speed:</strong> ${speeds}</p>`);
        }

        const abilityScores = data.ability_scores || {};
        if (Object.values(abilityScores).some(score => score)) {
            details.push('<div class="ability-scores"><h3>Ability Scores</h3>');
            for (const [ability, value] of Object.entries(abilityScores)) {
                if (value) details.push(`<p>${ability.charAt(0).toUpperCase() + ability.slice(1)}: ${value}</p>`);
            }
            details.push('</div>');
        }

        const savingThrows = data.saving_throws || {};
        if (Object.values(savingThrows).some(throwValue => throwValue)) {
            details.push('<div class="saving-throws"><h3>Saving Throws</h3>');
            for (const [throwName, value] of Object.entries(savingThrows)) {
                if (value) details.push(`<p>${throwName.charAt(0).toUpperCase() + throwName.slice(1)}: ${value}</p>`);
            }
            details.push('</div>');
        }

        const skills = data.skills || {};
        if (Object.values(skills).some(skillValue => skillValue)) {
            details.push('<div class="skills"><h3>Skills</h3>');
            for (const [skill, value] of Object.entries(skills)) {
                if (value) details.push(`<p>${skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${value}</p>`);
            }
            details.push('</div>');
        }

        if (data.damage_resistances) {
            details.push(`<div class="damage-resistances"><h3>Damage Resistances</h3><p>${data.damage_resistances}</p></div>`);
        }

        if (data.damage_immunities) {
            details.push(`<div class="damage-immunities"><h3>Damage Immunities</h3><p>${data.damage_immunities}</p></div>`);
        }

        if (data.condition_immunities) {
            details.push(`<div class="condition-immunities"><h3>Condition Immunities</h3><p>${data.condition_immunities}</p></div>`);
        }

        const senses = data.senses || {};
        if (Object.values(senses).some(senseValue => senseValue)) {
            details.push('<div class="senses"><h3>Senses</h3>');
            for (const [sense, value] of Object.entries(senses)) {
                if (value) details.push(`<p>${sense.charAt(0).toUpperCase() + sense.slice(1)}: ${value}</p>`);
            }
            details.push('</div>');
        }

        if (data.languages) {
            details.push(`<div class="languages-cr"><h3>Languages</h3><p>${data.languages}</p></div>`);
        }

        if (data.challenge_rating) {
            details.push(`<div class="languages-cr"><h3>Challenge Rating</h3><p>${data.challenge_rating}</p></div>`);
        }

        if (data.tamable) {
            details.push(`<p><strong>Tamable:</strong> ${data.tamable ? 'Yes' : 'No'}</p>`);
        }

        if (data.lair_type) {
            details.push(`<p><strong>Lair Type:</strong> ${data.lair_type}</p>`);
        }

        const sections = ['traits', 'actions', 'reactions', 'legendary_actions', 'lair_actions', 'regional_effects'];

        for (const section of sections) {
            if (data[section] && data[section].length > 0) {
                details.push(`<div class="traits-actions"><h3>${section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>`);
                details.push(data[section].map(item => `<p><strong>${item.name}:</strong> ${item.description}</p>`).join(''));
                details.push('</div>');
            }
        }

        creatureInfo.innerHTML = details.join('');
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

    // Ensure Reset Button is added after content is loaded
    ensureResetButton(panel);
}

// Function to ensure the reset button is available
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

// Soft reset function to clear and reset the panel
function resetPanel() {
    creatureListContainer.style.display = 'none';
    creatureDetailsContainer.style.display = 'none';
    crSelect.value = '';
    creatureList.innerHTML = ''; // Clear the creature list
}