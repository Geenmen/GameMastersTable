function initializeBestiary(panel) {
    const crSelect = panel.querySelector('#cr-select');
    const loadCreaturesBtn = panel.querySelector('#load-creatures-btn');
    const creatureListContainer = panel.querySelector('#creature-list-container');
    const creatureList = panel.querySelector('#creature-list');
    const creatureDetailsContainer = panel.querySelector('#creature-details-container');

    // Populate the CR dropdown (1 to 30)
    for (let i = 1; i <= 30; i++) {
        const option = document.createElement('option');
        option.value = `CR${i}`;
        option.textContent = `Challenge Rating ${i}`;
        crSelect.appendChild(option);
    }

    // Load creatures when the user selects a CR and clicks the button
    loadCreaturesBtn.addEventListener('click', () => {
        const selectedCR = crSelect.value;
        if (selectedCR) {
            fetchCreatureList(selectedCR);
        }
    });

    // Function to fetch the list of creatures from the selected CR folder
    function fetchCreatureList(cr) {
        fetch(`assets/libraries/Beastiary/${cr}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Fetch as text, as we are assuming an HTML response that might list files
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const files = Array.from(doc.querySelectorAll('a')).map(link => link.href.split('/').pop());

                creatureList.innerHTML = ''; // Clear previous list
                creatureListContainer.style.display = 'block'; // Show the container

                files.forEach(file => {
                    if (file.endsWith('.json')) { // Ensure only JSON files are processed
                        const listItem = document.createElement('li');
                        listItem.textContent = file.replace('.json', ''); // Remove .json extension for display
                        listItem.addEventListener('click', () => loadCreatureDetails(cr, file));
                        creatureList.appendChild(listItem);
                    }
                });
            })
            .catch(err => console.error(`Error fetching creatures for ${cr}:`, err));
    }


    // Function to load and display creature details
    function loadCreatureDetails(cr, fileName) {
        fetch(`assets/libraries/Beastiary/${cr}/${fileName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayCreatureDetails(data);
            })
            .catch(err => console.error(`Error loading creature file: ${fileName}`, err));
    }

    // Function to display creature details in the UI
    function displayCreatureDetails(data) {
        const details = [];

        details.push(`<h2>${data.creature_name}</h2>`);

        if (data.type) details.push(`<p><strong>Type:</strong> ${data.type}</p>`);
        if (data.alignment) details.push(`<p><strong>Alignment:</strong> ${data.alignment}</p>`);

        if (data.armor_class || data.hit_points || data.speed) {
            details.push('<div class="stat-block">');
            if (data.armor_class) details.push(`<p><strong>Armor Class:</strong> ${data.armor_class}</p>`);
            if (data.hit_points) details.push(`<p><strong>Hit Points:</strong> ${data.hit_points}</p>`);

            if (data.speed) {
                const speeds = [];
                if (data.speed.walk) speeds.push(`Walk: ${data.speed.walk}`);
                if (data.speed.fly) speeds.push(`Fly: ${data.speed.fly}`);
                if (data.speed.swim) speeds.push(`Swim: ${data.speed.swim}`);
                if (data.speed.climb) speeds.push(`Climb: ${data.speed.climb}`);
                if (data.speed.burrow) speeds.push(`Burrow: ${data.speed.burrow}`);
                if (speeds.length > 0) details.push(`<p><strong>Speed:</strong> ${speeds.join(', ')}</p>`);
            }

            details.push('</div>');
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

        const sections = ['traits', 'actions', 'reactions', 'legendary_actions', 'lair_actions', 'regional_effects'];

        for (const section of sections) {
            if (data[section] && data[section].length > 0) {
                details.push(`<div class="traits-actions"><h3>${section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>`);
                details.push(data[section].map(item => `<p><strong>${item.name}:</strong> ${item.description}</p>`).join(''));
                details.push('</div>');
            }
        }

        creatureDetailsContainer.innerHTML = details.join('');
        creatureDetailsContainer.style.display = 'block';
    }

}
