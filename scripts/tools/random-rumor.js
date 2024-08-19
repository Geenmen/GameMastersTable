function initializeRandomRumor(panel) {
    const rumorDisplay = panel.querySelector('#rumor-display');
    const fetchRandomBtn = panel.querySelector('#fetch-random-btn');
    const fetchCategoryBtn = panel.querySelector('#fetch-category-btn');
    const fetchSourceBtn = panel.querySelector('#fetch-source-btn');
    const categorySelect = panel.querySelector('#category-select');
    const sourceSelect = panel.querySelector('#source-select');

    fetch('assets/libraries/Random/RandomRumor.json')
        .then(response => response.json())
        .then(data => {
            let rumors = data;

            // Populate category and source dropdowns
            populateDropdowns(rumors);

            fetchRandomBtn.addEventListener('click', () => {
                displayRandomRumor(rumors);
            });

            fetchCategoryBtn.addEventListener('click', () => {
                const selectedCategory = categorySelect.value;
                if (selectedCategory) {
                    const filteredRumors = rumors.filter(rumor => rumor.category === selectedCategory);
                    displayRandomRumor(filteredRumors);
                } else {
                    alert('Please select a category.');
                }
            });

            fetchSourceBtn.addEventListener('click', () => {
                const selectedSource = sourceSelect.value;
                if (selectedSource) {
                    const filteredRumors = rumors.filter(rumor => rumor.source === selectedSource);
                    displayRandomRumor(filteredRumors);
                } else {
                    alert('Please select a source.');
                }
            });
        })
        .catch(err => {
            console.error('Failed to load rumors:', err);
            rumorDisplay.textContent = 'Failed to load rumors.';
        });

    function populateDropdowns(rumors) {
        const categories = [...new Set(rumors.map(rumor => rumor.category))];
        const sources = [...new Set(rumors.map(rumor => rumor.source))];

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        sources.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            option.textContent = source;
            sourceSelect.appendChild(option);
        });
    }

    function displayRandomRumor(rumors) {
        if (rumors.length === 0) {
            rumorDisplay.innerHTML = '<p>No rumors found.</p>';
            return;
        }

        const randomIndex = Math.floor(Math.random() * rumors.length);
        const selectedRumor = rumors[randomIndex];

        rumorDisplay.innerHTML = `
            <p><strong>Rumor:</strong> ${selectedRumor.text}</p>
            <p><strong>Category:</strong> ${selectedRumor.category}</p>
            <p><strong>Source:</strong> ${selectedRumor.source}</p>
        `;
    }
}
