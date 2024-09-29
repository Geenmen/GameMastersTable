let factionEntries = {}; // Changed from an array to an object
let currentCarouselIndex = 0; // Keep track of the current faction index

function startFactionCreation() {
    document.getElementById('FactionManager-createFactionBtn').style.display = 'none';
    document.getElementById('FactionManager-formContainer').style.display = 'block';
    document.getElementById('carousel').style.display = 'none'; // Hide the carousel
    updateProgressBar(1); // Initialize progress bar
    showStep(1);
}

function nextStep(step) {
    const currentStep = step - 1;
    showStep(step);
    updateProgressBar(step);
}

function prevStep(step) {
    const currentStep = step + 1;
    showStep(step);
    updateProgressBar(step);
}

function showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.FactionManager-step');
    steps.forEach(stepDiv => stepDiv.classList.remove('active'));

    // Show the current step
    document.getElementById(`FactionManager-step${step}`).classList.add('active');
}

function updateProgressBar(step) {
    const progress = document.getElementById('form-progress');
    const totalSteps = 8;
    const percent = ((step - 1) / (totalSteps - 1)) * 100;
    progress.style.width = `${percent}%`;
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
    document.getElementById('carousel').style.display = 'block'; // Show the carousel
    // Reset to step 1
    showStep(1);
    updateProgressBar(1);
}

const carouselContainer = document.getElementById('carousel');

function updateCarousel() {
    // Clear the existing carousel content
    carouselContainer.innerHTML = '';

    // Get the faction names
    const factionNames = Object.keys(factionEntries);

    // Only display carousel if factionEntries is not empty
    if (factionNames.length > 0) {
        carouselContainer.style.display = 'block'; // Ensure carousel is visible

        // Create the page content container
        const pageContent = document.createElement('div');
        pageContent.id = 'carousel-page-content';
        carouselContainer.appendChild(pageContent);

        // Create navigation buttons
        const navButtons = document.createElement('div');
        navButtons.id = 'carousel-nav-buttons';

        const prevButton = document.createElement('button');
        prevButton.id = 'carousel-prev';
        prevButton.textContent = 'Previous';
        navButtons.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.id = 'carousel-next';
        nextButton.textContent = 'Next';
        navButtons.appendChild(nextButton);

        carouselContainer.appendChild(navButtons);

        // Initialize current index
        currentCarouselIndex = 0;

        // Function to display the current page
        function showCarouselPage(index) {
            const factionName = factionNames[index];
            const faction = factionEntries[factionName];

            pageContent.innerHTML = ''; // Clear previous content

            const table = document.createElement('table');
            table.classList.add('card-table');

            table.innerHTML = `
                <tr><th colspan="2">${factionName}</th></tr>
                <tr><th>Type</th><td>${faction.factionType}</td></tr>
                <tr><th>Motto</th><td>${faction.factionMotto}</td></tr>
                <tr><th>Description</th><td>${faction.factionDescription}</td></tr>
                <tr><th>Resources</th><td>${faction.factionResources.join(', ')}</td></tr>
                <tr><th>Scale</th><td>${faction.factionScale}</td></tr>
                <tr><th>Alignment</th><td>${faction.factionAlignment}</td></tr>
                <tr><th>Membership Ranking</th><td>${faction.membershipRanking}</td></tr>
            `;

            pageContent.appendChild(table);
        }

        // Show the first page
        showCarouselPage(currentCarouselIndex);

        // Event listeners for buttons
        prevButton.addEventListener('click', function () {
            currentCarouselIndex = (currentCarouselIndex - 1 + factionNames.length) % factionNames.length;
            showCarouselPage(currentCarouselIndex);
        });

        nextButton.addEventListener('click', function () {
            currentCarouselIndex = (currentCarouselIndex + 1) % factionNames.length;
            showCarouselPage(currentCarouselIndex);
        });
    } else {
        carouselContainer.style.display = 'none'; // Hide if no factions
    }
}

// Call the function to initially load the carousel
updateCarousel();
