function initializeNotepad(panelContainer) {
    const panelId = panelContainer.id;

    // Target the textarea within the specific panel's container
    const textarea = panelContainer.querySelector('.notepad-textarea');

    // Use the panelId to create a unique key for storing notes in localStorage
    const storageKey = `notepadContent_${panelId}`;

    // Load saved notes from localStorage for this specific panel
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
        textarea.value = savedNotes;
    }

    // Save notes to localStorage on input, specific to this panel
    textarea.addEventListener('input', function () {
        localStorage.setItem(storageKey, textarea.value);
    });
}
