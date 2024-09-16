function initializeRandomJob(panel) {
    const jobCategorySelect = panel.querySelector('#job-category');
    const generateJobButton = panel.querySelector('#generate-job-button');
    const jobResultDisplay = panel.querySelector('#job-result');
    const jobHistoryDisplay = panel.querySelector('#job-history');

    let jobHistory = []; // Array to store job history

    // Fetch the JSON data
    fetch('assets/libraries/Random/RandomJob.json')
        .then(response => response.json())
        .then(data => {
            // Create the "All Categories" option
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'All Categories';
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
                    // Pull from all available categories
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

                // Add the job to the history and cap it at 10 entries
                jobHistory.push(job);
                if (jobHistory.length > 10) {
                    jobHistory.shift(); // Remove the oldest entry
                }
                updateJobHistory();
            });

            // Function to get a random job from an array
            function getRandomJob(jobArray) {
                return jobArray[Math.floor(Math.random() * jobArray.length)];
            }

            // Function to update the job history display
            function updateJobHistory() {
                // Clear the current content
                jobHistoryDisplay.innerHTML = '';

                // Create a list element
                const ul = document.createElement('ul');
                ul.classList.add('history-list');

                // Display the most recent jobs at the top
                jobHistory.slice().reverse().forEach((job) => {
                    const li = document.createElement('li');
                    li.textContent = job;
                    ul.appendChild(li);
                });

                jobHistoryDisplay.appendChild(ul);
            }
        })
        .catch(err => console.error("Error loading jobs:", err));
}
