let factionEntries = {}; // Changed from an array to an object

function startFactionCreation() {
    document.getElementById('FactionManager-createFactionBtn').style.display = 'none';
    document.getElementById('FactionManager-formContainer').style.display = 'block';
}

function nextStep(step) {
    const currentStep = step - 1;
    document.getElementById(`FactionManager-step${currentStep}`).style.display = 'none';
    document.getElementById(`FactionManager-step${step}`).style.display = 'block';
}

function prevStep(step) {
    const currentStep = step + 1;
    document.getElementById(`FactionManager-step${currentStep}`).style.display = 'none';
    document.getElementById(`FactionManager-step${step}`).style.display = 'block';
}

function submitFactionForm() {
    const factionName = document.getElementById('FactionManager-factionName').value;

    if (!factionName) {
        alert('Faction Name is required!');
        return;
    }

    // Check if faction name already exists
    if (factionEntries.hasOwnProperty(factionName)) {
        alert('Faction Name already exists. Please choose a different name.');
        return;
    }

    const factionData = {
        factionType: document.querySelector('input[name="factionType"]:checked').value,
        factionMotto: document.getElementById('FactionManager-factionMotto').value,
        factionDescription: document.getElementById('FactionManager-factionDescription').value,
        factionResources: Array.from(document.querySelectorAll('input[name="factionResources"]:checked')).map(checkbox => checkbox.value),
        factionScale: document.querySelector('input[name="factionScale"]:checked').value,
        factionAlignment: document.querySelector('input[name="factionAlignment"]:checked').value,
        membershipRanking: document.querySelector('input[name="membershipRanking"]:checked').value
    };

    // Store faction data using the faction name as the key
    factionEntries[factionName] = factionData;

    alert('Faction Created!');
    resetForm();
    updateCarousel();
}

function resetForm() {
    document.getElementById('FactionManager-form').reset();
    document.getElementById('FactionManager-createFactionBtn').style.display = 'block';
    document.getElementById('FactionManager-formContainer').style.display = 'none';
    // Reset to step 1
    document.getElementById('FactionManager-step8').style.display = 'none';
    document.getElementById('FactionManager-step1').style.display = 'block';
}

const carouselContainer = document.getElementById('carousel');

// Function to update the carousel
function updateCarousel() {
    // Clear the existing carousel content
    carouselContainer.innerHTML = '';

    // Only display carousel if factionEntries is not empty
    if (Object.keys(factionEntries).length > 0) {
        const carousel = document.createElement('div');
        carousel.classList.add('carousel-container');

        Object.keys(factionEntries).forEach(factionName => {
            const faction = factionEntries[factionName];
            const page = document.createElement('div');
            page.classList.add('carousel-page');

            const table = document.createElement('table');
            table.classList.add('card-table');

            table.innerHTML = `
                <tr><th colspan="2">${factionName}</th></tr>
                <tr><th>Alignment</th><td>${faction.factionAlignment}</td></tr>
                <tr><th>Description</th><td>${faction.factionDescription}</td></tr>
                <tr><th>Motto</th><td>${faction.factionMotto}</td></tr>
                <tr><th>Resources</th><td>${faction.factionResources.join(', ')}</td></tr>
                <tr><th>Scale</th><td>${faction.factionScale}</td></tr>
                <tr><th>Type</th><td>${faction.factionType}</td></tr>
                <tr><th>Membership Ranking</th><td>${faction.membershipRanking}</td></tr>
            `;

            page.appendChild(table);
            carousel.appendChild(page);
        });

        carouselContainer.appendChild(carousel);
    }
}

// Call the function to initially load the carousel
updateCarousel();
