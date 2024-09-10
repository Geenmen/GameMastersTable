function initializeSoundBoard(panel) {
    const soundboardGrid = panel.querySelector('.soundboard-grid');
    const addSoundBtn = panel.querySelector('#add-sound-btn');
    const soundFileInput = panel.querySelector('#sound-file-input');
    const resetBtn = panel.querySelector('#soundboard-reset-btn');

    let sounds = []; // Array to store sound objects
    let observers = []; // Array to store MutationObservers for each sound

    // Function to create a sound button
    function createSoundButton(soundName, soundSrc) {
        const soundBtn = document.createElement('div');
        soundBtn.className = 'soundboard-btn';

        const audio = new Audio(soundSrc);

        const title = document.createElement('div');
        title.textContent = soundName;
        soundBtn.appendChild(title);

        // Create control buttons (Play/Pause)
        const controlBtns = document.createElement('div');
        controlBtns.className = 'control-btns';

        const playBtn = document.createElement('button');
        playBtn.textContent = 'Play';

        const pauseBtn = document.createElement('button');
        pauseBtn.textContent = 'Pause';
        pauseBtn.style.display = 'none';

        controlBtns.appendChild(playBtn);
        controlBtns.appendChild(pauseBtn);
        soundBtn.appendChild(controlBtns);

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const progressBarInner = document.createElement('div');
        progressBarInner.className = 'progress-bar-inner';
        progressBar.appendChild(progressBarInner);
        soundBtn.appendChild(progressBar);

        // Play button event
        playBtn.addEventListener('click', () => {
            audio.play();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        });

        // Pause button event
        pauseBtn.addEventListener('click', () => {
            audio.pause();
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        });

        // Update progress bar
        audio.addEventListener('timeupdate', () => {
            const progressPercentage = (audio.currentTime / audio.duration) * 100;
            progressBarInner.style.width = `${progressPercentage}%`;
        });

        // Reset buttons when audio ends
        audio.addEventListener('ended', () => {
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
            progressBarInner.style.width = '0';
        });

        soundboardGrid.appendChild(soundBtn);

        // Create a MutationObserver to stop audio if the soundboard is removed
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && !document.body.contains(soundBtn)) {
                    audio.pause();
                    observer.disconnect(); // Disconnect the observer when done
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        observers.push(observer);

        // Add the audio object to the sounds array
        sounds.push(audio);
    }

    // Event listener for the Add Sound button
    addSoundBtn.addEventListener('click', () => {
        soundFileInput.click();
    });

    // Event listener for file input
    soundFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            if (fileType.startsWith('audio/')) { // Check if the selected file is an audio file
                const soundName = file.name.split('.')[0];
                const soundSrc = URL.createObjectURL(file);
                createSoundButton(soundName, soundSrc);
            } else {
                alert("Please select a valid audio file.");
            }
        }
    });

    // Event listener for reset button
    resetBtn.addEventListener('click', () => {
        // Stop all playing sounds
        sounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0; // Reset to start
        });

        soundboardGrid.innerHTML = ''; // Clear all sounds
        sounds = []; // Reset the sounds array

        // Disconnect all MutationObservers
        observers.forEach(observer => observer.disconnect());
        observers = [];
    });

    // Load default sounds (if any)
    const defaultSounds = [
        { name: 'Sound 1', src: 'assets/libraries/Soundboard/sound1.mp3' },
        { name: 'Sound 2', src: 'assets/libraries/Soundboard/sound2.mp3' },
    ];

    defaultSounds.forEach(sound => {
        createSoundButton(sound.name, sound.src);
    });

    // Observe if the parent panel is removed, then stop all audio
    const panelObserver = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && !document.body.contains(panel)) {
                sounds.forEach(audio => {
                    audio.pause(); // Stop all playing sounds
                    audio.currentTime = 0; // Reset to start
                });
                observer.disconnect(); // Disconnect the observer
            }
        }
    });

    panelObserver.observe(document.body, { childList: true, subtree: true });
    observers.push(panelObserver);
}