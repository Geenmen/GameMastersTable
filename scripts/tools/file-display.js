function initializeFileDisplay(panel) {
    const fileInput = panel.querySelector('#file-input');
    const addFilesBtn = panel.querySelector('#add-files-btn');
    const fileDisplay = panel.querySelector('.file-display');
    const prevBtn = panel.querySelector('#prev-btn');
    const nextBtn = panel.querySelector('#next-btn');
    const indicatorContainer = panel.querySelector('.indicator-container');

    let files = [];
    let currentIndex = 0;

    // Event listener for the Add Files button
    addFilesBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Event listener for when files are selected
    fileInput.addEventListener('change', () => {
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            files.push(selectedFile);
            currentIndex = files.length - 1; // Set current index to the last added file
            updateIndicators(); // Update the progress indicators
            displayFile(currentIndex);
        }
    });

    // Event listener for the Previous button
    prevBtn.addEventListener('click', () => {
        if (files.length > 0) {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : files.length - 1;
            displayFile(currentIndex);
            updateIndicators(); // Update the progress indicators
        }
    });

    // Event listener for the Next button
    nextBtn.addEventListener('click', () => {
        if (files.length > 0) {
            currentIndex = (currentIndex < files.length - 1) ? currentIndex + 1 : 0;
            displayFile(currentIndex);
            updateIndicators(); // Update the progress indicators
        }
    });

    // Function to display the current file
    function displayFile(index) {
        const file = files[index];
        const fileURL = URL.createObjectURL(file);
        fileDisplay.innerHTML = ''; // Clear previous content

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            files.splice(index, 1); // Remove file from the array
            updateIndicators(); // Update the progress indicators
            if (files.length === 0) {
                fileDisplay.innerHTML = ''; // Clear the display if no files are left
            } else {
                currentIndex = (index >= files.length) ? files.length - 1 : index;
                displayFile(currentIndex); // Display the next file, or the previous if last was deleted
            }
        });

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = fileURL;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            fileDisplay.appendChild(img);
        } else if (file.type === 'application/pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = fileURL;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            fileDisplay.appendChild(iframe);
        }

        fileDisplay.appendChild(deleteBtn); // Add the delete button to the display
    }

    // Function to update the progress indicators
    function updateIndicators() {
        indicatorContainer.innerHTML = ''; // Clear previous indicators

        files.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator-tab';
            if (index === currentIndex) {
                indicator.classList.add('active'); // Highlight the active indicator
            }
            indicatorContainer.appendChild(indicator);
        });
    }
}