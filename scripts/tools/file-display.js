function initializeFileDisplay(panel) {
    const fileInput = panel.querySelector('#file-input');
    const addFilesBtn = panel.querySelector('#add-files-btn');
    const fileDisplay = panel.querySelector('.file-display');
    const prevBtn = panel.querySelector('#prev-btn');
    const nextBtn = panel.querySelector('#next-btn');

    let files = [];
    let currentIndex = 0;

    addFilesBtn.addEventListener('click', () => {
        const selectedFiles = Array.from(fileInput.files);
        files = files.concat(selectedFiles);
        if (files.length > 0) {
            displayFile(currentIndex);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (files.length > 0) {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : files.length - 1;
            displayFile(currentIndex);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (files.length > 0) {
            currentIndex = (currentIndex < files.length - 1) ? currentIndex + 1 : 0;
            displayFile(currentIndex);
        }
    });

    function displayFile(index) {
        const file = files[index];
        const fileURL = URL.createObjectURL(file);
        fileDisplay.innerHTML = '';

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
    }
}
