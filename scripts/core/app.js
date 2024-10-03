document.addEventListener('DOMContentLoaded', function () {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const calculatorBtn = document.getElementById('calculator-btn');
    const stopwatchBtn = document.getElementById('stopwatch-btn');

    let calculatorLoaded = false;
    let stopwatchLoaded = false;

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

    loadSettings();

    const panelManagerScript = document.createElement('script');
    panelManagerScript.src = 'scripts/core/PanelManager.js';
    document.body.appendChild(panelManagerScript);

    function updateCurrentTime() {
        const currentTimeElement = document.getElementById('current-time');
        const now = new Date();
        const options = { hour: 'numeric', minute: 'numeric' };
        currentTimeElement.textContent = now.toLocaleTimeString(undefined, options);
    }

    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);

    settingsBtn.addEventListener('click', () => {
        settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
    });

    calculatorBtn.addEventListener('click', () => {
        if (!calculatorLoaded) {
            fetch('assets/components/calculator.html')
                .then(response => response.text())
                .then(html => {
                    document.body.insertAdjacentHTML('beforeend', html);
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'assets/styles/calculator.css';
                    document.head.appendChild(link);
                    const script = document.createElement('script');
                    script.src = 'scripts/tools/calculator.js';
                    document.body.appendChild(script);
                    calculatorLoaded = true;
                })
                .catch(err => console.error('Error loading calculator:', err));
        } else {
            const calculatorContainer = document.getElementById('calculator-container');
            calculatorContainer.style.display = calculatorContainer.style.display === 'none' ? 'flex' : 'none';
        }
    });

    stopwatchBtn.addEventListener('click', () => {
        if (!stopwatchLoaded) {
            fetch('assets/components/stopwatch.html')
                .then(response => response.text())
                .then(html => {
                    document.body.insertAdjacentHTML('beforeend', html);
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'assets/styles/stopwatch.css';
                    document.head.appendChild(link);
                    const script = document.createElement('script');
                    script.src = 'scripts/tools/stopwatch.js';
                    document.body.appendChild(script);
                    stopwatchLoaded = true;
                })
                .catch(err => console.error('Error loading stopwatch:', err));
        } else {
            const stopwatchContainer = document.getElementById('stopwatch-container');
            stopwatchContainer.style.display = stopwatchContainer.style.display === 'none' ? 'flex' : 'none';
        }
    });

    initializeZoomAndPan();

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

    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').style.visibility = 'visible';
    }, 3000);
});

// Global variables
let translateX = 0;
let translateY = 0;
let scale = 1;
let startPanX = 0;
let startPanY = 0;

function initializeZoomAndPan() {
    const zoomableContent = document.getElementById('zoomable-content');
    const middleSection = document.getElementById('middle-section');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');

    const zoomLevelDisplay = document.createElement('span');
    zoomLevelDisplay.id = 'zoom-level';
    zoomLevelDisplay.style.marginLeft = '10px';
    zoomLevelDisplay.style.color = '#e0e0e0';
    zoomInBtn.parentElement.appendChild(zoomLevelDisplay);

    const scaleStep = 0.1;
    const minScale = 0.5;
    const maxScale = 3;

    let isPanning = false;

    window.zoomScale = scale;

    // Set an initial large size for the zoomable content
    const largeCanvasSize = 30000;
    zoomableContent.style.width = `${largeCanvasSize}px`;
    zoomableContent.style.height = `${largeCanvasSize}px`;

    // Position the zoomable-content center to the viewport center
    const viewportWidth = middleSection.clientWidth;
    const viewportHeight = middleSection.clientHeight;
    translateX = (viewportWidth - largeCanvasSize) / 2;
    translateY = (viewportHeight - largeCanvasSize) / 2;

    function applyTransform() {
        zoomableContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        window.zoomScale = scale;
        window.translateX = translateX;
        window.translateY = translateY;
        zoomLevelDisplay.textContent = `${Math.round(scale * 100)}%`;
    }

    zoomInBtn.addEventListener('click', () => {
        if (scale < maxScale) {
            // Get the center of the viewport
            const viewportCenterX = middleSection.clientWidth / 2;
            const viewportCenterY = middleSection.clientHeight / 2;

            // Calculate the content coordinates of the viewport center
            const contentCenterX = (viewportCenterX - translateX) / scale;
            const contentCenterY = (viewportCenterY - translateY) / scale;

            // Update the scale
            scale = Math.min(scale + scaleStep, maxScale);

            // Recalculate translateX and translateY to keep the content centered
            translateX = viewportCenterX - contentCenterX * scale;
            translateY = viewportCenterY - contentCenterY * scale;

            applyTransform();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (scale > minScale) {
            // Get the center of the viewport
            const viewportCenterX = middleSection.clientWidth / 2;
            const viewportCenterY = middleSection.clientHeight / 2;

            // Calculate the content coordinates of the viewport center
            const contentCenterX = (viewportCenterX - translateX) / scale;
            const contentCenterY = (viewportCenterY - translateY) / scale;

            // Update the scale
            scale = Math.max(scale - scaleStep, minScale);

            // Recalculate translateX and translateY to keep the content centered
            translateX = viewportCenterX - contentCenterX * scale;
            translateY = viewportCenterY - contentCenterY * scale;

            applyTransform();
        }
    });

    resetZoomBtn.addEventListener('click', () => {
        scale = 1;
        translateX = (viewportWidth - largeCanvasSize) / 2;
        translateY = (viewportHeight - largeCanvasSize) / 2;
        applyTransform();
    });

    zoomableContent.addEventListener('mousedown', (e) => {
        if (e.target !== zoomableContent) {
            return;
        }
        e.preventDefault();
        isPanning = true;
        startPanX = e.clientX - translateX;
        startPanY = e.clientY - translateY;
        zoomableContent.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        translateX = e.clientX - startPanX;
        translateY = e.clientY - startPanY;
        applyTransform();
    });

    document.addEventListener('mouseup', () => {
        isPanning = false;
        zoomableContent.style.cursor = 'grab';
    });

    zoomableContent.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });

    zoomableContent.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && e.target === zoomableContent) {
            isPanning = true;
            startPanX = e.touches[0].clientX - translateX;
            startPanY = e.touches[0].clientY - translateY;
        }
    });

    zoomableContent.addEventListener('touchmove', (e) => {
        if (!isPanning || e.touches.length !== 1) return;
        translateX = e.touches[0].clientX - startPanX;
        translateY = e.touches[0].clientY - startPanY;
        applyTransform();
    });

    zoomableContent.addEventListener('touchend', () => {
        isPanning = false;
    });

    applyTransform();
}

function returnToCenter() {
    const zoomableContent = document.getElementById('zoomable-content');
    const middleSection = document.getElementById('middle-section');

    const currentScale = window.zoomScale || 1;

    // Calculate the center position of the zoomable content
    const largeCanvasSize = 30000;
    const viewportWidth = middleSection.clientWidth;
    const viewportHeight = middleSection.clientHeight;

    const targetTranslateX = (viewportWidth - largeCanvasSize * currentScale) / 2;
    const targetTranslateY = (viewportHeight - largeCanvasSize * currentScale) / 2;

    // Animate the transition to the center
    const duration = 500; // Duration of the animation in milliseconds
    const frameRate = 60; // Frames per second for the animation
    const totalFrames = (duration / 1000) * frameRate;
    let currentFrame = 0;

    const initialTranslateX = translateX;
    const initialTranslateY = translateY;

    function animate() {
        currentFrame++;
        const progress = currentFrame / totalFrames;

        // Calculate the current position using a linear interpolation
        translateX = initialTranslateX + (targetTranslateX - initialTranslateX) * progress;
        translateY = initialTranslateY + (targetTranslateY - initialTranslateY) * progress;

        // Apply the translation
        zoomableContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;

        if (currentFrame < totalFrames) {
            requestAnimationFrame(animate);
        } else {
            // Ensure final position is set exactly to the target values
            translateX = targetTranslateX;
            translateY = targetTranslateY;
            zoomableContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        }
    }

    requestAnimationFrame(animate);

    function updateMiddleSectionPosition() {
        const topSection = document.getElementById('top-section');
        const bottomSection = document.getElementById('bottom-section');
        const middleSection = document.getElementById('middle-section');

        const topSectionHeight = topSection.offsetHeight;
        const bottomSectionHeight = bottomSection.offsetHeight;

        middleSection.style.top = `${topSectionHeight}px`;
        middleSection.style.bottom = `${bottomSectionHeight}px`;
    }


    // Call the function initially
    updateMiddleSectionPosition();

    // Optional: Update on window resize if your layout is responsive
    window.addEventListener('resize', updateSectionHeights);
}


// Attach the returnToCenter function to your button
document.getElementById('return-to-center-btn').addEventListener('click', returnToCenter);
