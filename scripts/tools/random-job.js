function initializeRandomJob(panel) {
    const jobCategorySelect = panel.querySelector('#job-category');
    const generateJobButton = panel.querySelector('#generate-job-button');
    const jobResultDisplay = panel.querySelector('#job-result');

    // Fetch the JSON data
    fetch('assets/libraries/Random/RandomJob.json')
        .then(response => response.json())
        .then(data => {
            // Create the "Select Category" option
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'Select Category';
            jobCategorySelect.appendChild(defaultOption);

            // Populate the job category dropdown with options
            const categories = data.categories;
            for (const category in categories) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                jobCategorySelect.appendChild(option);
            }

            // Generate the job based on user selection
            generateJobButton.addEventListener('click', () => {
                const selectedCategory = jobCategorySelect.value;

                let job = '';

                if (selectedCategory === 'all') {
                    // If "Select Category" is chosen, pull from all available categories
                    const allJobs = [];
                    for (const category in categories) {
                        allJobs.push(...categories[category].jobs);
                    }
                    job = getRandomJob(allJobs);
                } else {
                    // Pull from the selected category
                    job = getRandomJob(categories[selectedCategory].jobs);
                }

                jobResultDisplay.textContent = job;
            });

            // Function to get a random job from an array
            function getRandomJob(jobArray) {
                return jobArray[Math.floor(Math.random() * jobArray.length)];
            }
        })
        .catch(err => console.error("Error loading jobs:", err));
}
