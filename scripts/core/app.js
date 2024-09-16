document.addEventListener('DOMContentLoaded', function () {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const calculatorBtn = document.getElementById('calculator-btn');

    let calculatorLoaded = false;

    // Function to load settings from localStorage
    function loadSettings() {
        const redAccent = localStorage.getItem('redAccent') || '#ff4747';
        const blueBorder = localStorage.getItem('blueBorder') || '#00bfff';
        const backgroundColor = localStorage.getItem('backgroundColor') || '#121212';
        const sectionColor = localStorage.getItem('sectionColor') || '#1f1f1f';

        document.documentElement.style.setProperty('--red-accent', redAccent);
        document.documentElement.style.setProperty('--blue-border', blueBorder);
        document.documentElement.style.setProperty('--background-color', backgroundColor);
        document.documentElement.style.setProperty('--section-color', sectionColor);

        document.getElementById('red-accent-picker').value = redAccent;
        document.getElementById('blue-border-picker').value = blueBorder;
        document.getElementById('background-color-picker').value = backgroundColor;
        document.getElementById('section-color-picker').value = sectionColor;
    }

    // Ensure settings are loaded before anything else
    loadSettings();

    // Load the PanelManager script
    const panelManagerScript = document.createElement('script');
    panelManagerScript.src = 'scripts/core/PanelManager.js';
    document.body.appendChild(panelManagerScript);

    // Time
    function updateCurrentTime() {
        const currentTimeElement = document.getElementById('current-time');
        const now = new Date();
        const options = { hour: 'numeric', minute: 'numeric' }; // This allows for both 12h and 24h based on user settings
        currentTimeElement.textContent = now.toLocaleTimeString(undefined, options);
    }

    // Update the time immediately when the page loads
    updateCurrentTime();

    // Update the time every minute
    setInterval(updateCurrentTime, 60000);



    // Toggle the settings menu visibility
    settingsBtn.addEventListener('click', () => {
        if (settingsMenu.style.display === 'block') {
            settingsMenu.style.display = 'none';
        } else {
            settingsMenu.style.display = 'block';
        }
    });


    // Event listener for the calculator button
    calculatorBtn.addEventListener('click', () => {
        if (!calculatorLoaded) {
            // Load the calculator HTML dynamically.
            fetch('assets/components/calculator.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(html => {
                    // Insert the HTML into the DOM
                    document.body.insertAdjacentHTML('beforeend', html);

                    // Now load the calculator.css file
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'assets/styles/calculator.css';
                    document.head.appendChild(link);

                    // Now load the calculator.js script
                    const script = document.createElement('script');
                    script.src = 'scripts/tools/calculator.js';
                    document.body.appendChild(script);

                    calculatorLoaded = true; // Mark the calculator as loaded
                })
                .catch(err => console.error('Error loading calculator:', err));
        } else {
            const calculatorContainer = document.getElementById('calculator-container');
            calculatorContainer.style.display = calculatorContainer.style.display === 'none' ? 'flex' : 'none';
        }
    });

    // Event listener for the stopwatch button
    const stopwatchBtn = document.getElementById('stopwatch-btn');
    let stopwatchLoaded = false;

    stopwatchBtn.addEventListener('click', () => {
        if (!stopwatchLoaded) {
            // Load the stopwatch HTML dynamically
            fetch('assets/components/stopwatch.html')
                .then(response => response.text())
                .then(html => {
                    document.body.insertAdjacentHTML('beforeend', html);

                    // Now load the stopwatch.css file
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'assets/styles/stopwatch.css';
                    document.head.appendChild(link);

                    // Now load the stopwatch.js script
                    const script = document.createElement('script');
                    script.src = 'scripts/tools/stopwatch.js';
                    document.body.appendChild(script);

                    stopwatchLoaded = true; // Mark the stopwatch as loaded
                })
                .catch(err => console.error('Error loading stopwatch:', err));
        } else {
            const stopwatchContainer = document.getElementById('stopwatch-container');
            stopwatchContainer.style.display = stopwatchContainer.style.display === 'none' ? 'flex' : 'none';
        }
    });




    // Update CSS variables when a color picker value changes
    document.getElementById('red-accent-picker').addEventListener('input', function () {
        document.documentElement.style.setProperty('--red-accent', this.value);
        localStorage.setItem('redAccent', this.value);
    });

    document.getElementById('blue-border-picker').addEventListener('input', function () {
        document.documentElement.style.setProperty('--blue-border', this.value);
        localStorage.setItem('blueBorder', this.value);
    });

    document.getElementById('background-color-picker').addEventListener('input', function () {
        document.documentElement.style.setProperty('--background-color', this.value);
        localStorage.setItem('backgroundColor', this.value);
    });

    document.getElementById('section-color-picker').addEventListener('input', function () {
        document.documentElement.style.setProperty('--section-color', this.value);
        localStorage.setItem('sectionColor', this.value);
    });

    // After 2 seconds, hide the loading screen and show the app
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').style.visibility = 'visible';
    }, 3000);
});



// Function to update the middle section's height based on the panel's position
function updateMiddleSectionHeight() {
    const middleSection = document.getElementById('middle-section');
    const panels = document.querySelectorAll('.panel-container');
    let maxBottom = 0;

    panels.forEach(panel => {
        const panelRect = panel.getBoundingClientRect();
        if (panelRect.bottom > maxBottom) {
            maxBottom = panelRect.bottom;
        }
    });

    // Calculate the new height needed for middle section to occupy the full document space
    const newHeight = Math.max(maxBottom, window.innerHeight) - middleSection.getBoundingClientRect().top;
    middleSection.style.height = `${newHeight}px`;
}

// Monitor panel movement and update the middle section's height accordingly
const observer = new MutationObserver(updateMiddleSectionHeight);
observer.observe(document.getElementById('middle-section'), { childList: true, subtree: true });

// Also update on window resize and scroll
window.addEventListener('resize', updateMiddleSectionHeight);
window.addEventListener('scroll', updateMiddleSectionHeight);

// Initial update
updateMiddleSectionHeight();
