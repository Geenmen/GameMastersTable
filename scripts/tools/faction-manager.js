function initializeFactionManager(panel) {
    let factions = [];
    let currentFactionIndex = 0;

    const factionList = panel.querySelector('#faction-list');
    const factionDetails = panel.querySelector('#faction-details');
    const factionFormContainer = panel.querySelector('#faction-form-container');
    const factionForm = panel.querySelector('#faction-form');
    const factionFormSubmit = panel.querySelector('#faction-form-submit');
    const factionFormCancel = panel.querySelector('#faction-form-cancel');
    const editFactionBtn = panel.querySelector('#edit-faction-btn');

    panel.querySelector('#create-faction-btn').addEventListener('click', function () {
        factionFormContainer.style.display = 'block';
        factionDetails.style.display = 'none';
        factionForm.reset();
    });

    factionFormCancel.addEventListener('click', function () {
        factionFormContainer.style.display = 'none';
        factionDetails.style.display = 'block';
    });

    factionFormSubmit.addEventListener('click', function () {
        const factionData = {
            name: panel.querySelector('#faction-name').value,
            type: panel.querySelector('#faction-type').value,
            description: panel.querySelector('#faction-description').value,
            resources: Array.from(panel.querySelectorAll('#faction-resources input[type="checkbox"]:checked')).map(el => el.value),
            politicalScale: panel.querySelector('#faction-political-scale').value,
            alignment: panel.querySelector('input[name="alignment"]:checked').value,
        };

        if (editFactionBtn.dataset.editing === 'true') {
            factions[currentFactionIndex] = factionData;
            editFactionBtn.dataset.editing = 'false';
            editFactionBtn.disabled = true;
        } else {
            factions.push(factionData);
        }

        factionForm.reset();
        factionFormContainer.style.display = 'none';
        factionDetails.style.display = 'block';
        updateFactionList();
    });

    function updateFactionList() {
        factionList.innerHTML = '';
        factions.forEach((faction, index) => {
            const factionItem = document.createElement('div');
            factionItem.className = 'faction-item';
            factionItem.textContent = faction.name;
            factionItem.addEventListener('click', () => {
                currentFactionIndex = index;
                displayFactionDetails(faction);
                editFactionBtn.disabled = false;
            });
            factionList.appendChild(factionItem);
        });
    }

function displayFactionDetails(faction) {
    factionDetails.innerHTML = `
        <h4>${faction.name}</h4>
        <p><strong>Type:</strong> ${faction.type}</p>
        <p><strong>Description:</strong> ${faction.description}</p>
        <p><strong>Resources:</strong> ${faction.resources.join(', ')}</p>
        <p><strong>Political Scale:</strong> ${faction.politicalScale}</p>
        <p><strong>Alignment:</strong> ${faction.alignment}</p>
        <button id="arrange-members-btn">Arrange Faction Members</button>
    `;

    // Add event listener to the new "Arrange Faction Members" button
    const arrangeMembersBtn = panel.querySelector('#arrange-members-btn');
    arrangeMembersBtn.addEventListener('click', function () {
        openMemberManagementSection(faction);
    });
}

function openMemberManagementSection(faction) {
    const layoutSelection = document.createElement('div');
    layoutSelection.id = 'layout-selection';
    layoutSelection.className = 'layout-selection';
    
    layoutSelection.innerHTML = `
        <h3>Select Member Layout for ${faction.name}</h3>
        <div id="layout-options">
            <button class="layout-option" data-layout="pyramid">Pyramid</button>
            <button class="layout-option" data-layout="monarchy">Monarchy</button>
            <button class="layout-option" data-layout="diarchy">Diarchy</button>
            <button class="layout-option" data-layout="council">Council</button>
            <button class="layout-option" data-layout="collective">Collective</button>
            <button class="layout-option" data-layout="hive">Hive</button>
            <button class="layout-option" data-layout="guild">Guild</button>
            <button class="layout-option" data-layout="tribe">Tribe</button>
            <button class="layout-option" data-layout="syndicate">Syndicate</button>
        </div>
    `;

    panel.appendChild(layoutSelection);

    const layoutButtons = layoutSelection.querySelectorAll('.layout-option');
    layoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLayout = button.getAttribute('data-layout');
            displaySelectedLayout(faction, selectedLayout);
        });
    });
}

function displaySelectedLayout(faction, layout) {
    const layoutSelection = panel.querySelector('#layout-selection');
    layoutSelection.style.display = 'none';

    const memberLayout = document.createElement('div');
    memberLayout.id = 'member-layout';
    memberLayout.className = 'member-layout';

    // Display layout template based on the chosen layout
    switch (layout) {
        case 'pyramid':
            memberLayout.innerHTML = renderPyramidLayout(faction);
            break;
        case 'monarchy':
            memberLayout.innerHTML = renderMonarchyLayout(faction);
            break;
        case 'diarchy':
            memberLayout.innerHTML = renderDiarchyLayout(faction);
            break;
        case 'council':
            memberLayout.innerHTML = renderCouncilLayout(faction);
            break;
        case 'collective':
            memberLayout.innerHTML = renderCollectiveLayout(faction);
            break;
        case 'hive':
            memberLayout.innerHTML = renderHiveLayout(faction);
            break;
        case 'guild':
            memberLayout.innerHTML = renderGuildLayout(faction);
            break;
        case 'tribe':
            memberLayout.innerHTML = renderTribeLayout(faction);
            break;
        case 'syndicate':
            memberLayout.innerHTML = renderSyndicateLayout(faction);
            break;
        default:
            console.error('Unknown layout selected');
    }

    panel.appendChild(memberLayout);

    // Now we will add the interactivity for adding members
    addMemberInteractivity(faction, layout);
}

function addMemberInteractivity(faction, layout) {
    const nodes = panel.querySelectorAll('.member-node');
    nodes.forEach(node => {
        node.addEventListener('click', function() {
            const memberId = node.getAttribute('data-member-id');
            manageMember(faction, memberId);
        });
    });
}

function manageMember(faction, memberId) {
    // Implement logic to add/edit member details
    console.log(`Managing member: ${memberId} in faction: ${faction.name}`);
}

// Example render functions for layouts (these need to be fully implemented)

function renderPyramidLayout(faction) {
    return `
        <div class="layout-pyramid">
            <!-- Render pyramid layout with clickable nodes -->
        </div>
    `;
}

function renderMonarchyLayout(faction) {
    return `
        <div class="layout-monarchy">
            <!-- Render monarchy layout with clickable nodes -->
        </div>
    `;
}

// Implement similar functions for other layouts


    panel.querySelector('#edit-faction-btn').addEventListener('click', function () {
        const faction = factions[currentFactionIndex];
        panel.querySelector('#faction-name').value = faction.name;
        panel.querySelector('#faction-type').value = faction.type;
        panel.querySelector('#faction-description').value = faction.description;
        panel.querySelectorAll('#faction-resources input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = faction.resources.includes(checkbox.value);
        });
        panel.querySelector('#faction-political-scale').value = faction.politicalScale;
        panel.querySelector(`input[name="alignment"][value="${faction.alignment}"]`).checked = true;

        factionFormContainer.style.display = 'block';
        factionDetails.style.display = 'none';
        editFactionBtn.dataset.editing = 'true';
    });

    panel.querySelector('#delete-faction-btn').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this faction?')) {
            factions.splice(currentFactionIndex, 1);
            currentFactionIndex = Math.max(0, currentFactionIndex - 1);
            updateFactionList();
            if (factions.length > 0) {
                displayFactionDetails(factions[currentFactionIndex]);
            } else {
                factionDetails.innerHTML = '';
                editFactionBtn.disabled = true;
            }
        }
    });

    panel.querySelector('#import-faction-btn').addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const importedFactions = JSON.parse(e.target.result);
                    if (Array.isArray(importedFactions)) {
                        factions = factions.concat(importedFactions);
                        updateFactionList();
                        if (factions.length > 0) {
                            displayFactionDetails(factions[0]);
                            editFactionBtn.disabled = false;
                        }
                    } else {
                        alert('Invalid file format. Please upload a valid JSON file.');
                    }
                } catch (error) {
                    alert('Error importing factions: ' + error.message);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });

    // Initial call to set up the empty faction list and disable edit button
    updateFactionList();
    editFactionBtn.disabled = true;
}