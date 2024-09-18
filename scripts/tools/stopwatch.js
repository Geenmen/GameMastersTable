(function () {
    let stopwatchInterval;
    let elapsedSeconds = 0;

    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const startButton = document.getElementById('start-stopwatch');
    const stopButton = document.getElementById('stop-stopwatch');
    const resetButton = document.getElementById('reset-stopwatch');
    const stopwatchContainer = document.getElementById('stopwatch-container');

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }

    function updateDisplay() {
        stopwatchDisplay.textContent = formatTime(elapsedSeconds);
    }

    startButton.addEventListener('click', function () {
        if (!stopwatchInterval) {
            stopwatchInterval = setInterval(() => {
                elapsedSeconds++;
                updateDisplay();
            }, 1000);
        }
    });

    stopButton.addEventListener('click', function () {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    });

    resetButton.addEventListener('click', function () {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        elapsedSeconds = 0;
        updateDisplay();
    });

    updateDisplay();

    // Remove the resizing code (if any)

    // Update the move code to match the new move code from PanelManager.js
    let isInteracting = false; // Local flag to track interactions

    function makePanelMovable(panel) {
        // Ensure interact.js is loaded
        if (typeof interact === 'undefined') {
            console.error('interact.js is required for makePanelMovable to work');
            return;
        }

        // Use the panel itself as the move handle or define a specific handle if available
        interact(panel)
            .draggable({
                inertia: false,
                autoScroll: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true,
                    }),
                ],
                listeners: {
                    start(event) {
                        isInteracting = true;
                        panel.classList.add('dragging');
                    },
                    move(event) {
                        if (isInteracting) {
                            // Since there's no zoom, we can directly use event.dx and event.dy
                            let left = parseFloat(panel.style.left) || 0;
                            let top = parseFloat(panel.style.top) || 0;

                            left += event.dx;
                            top += event.dy;

                            panel.style.left = `${left}px`;
                            panel.style.top = `${top}px`;
                        }
                    },
                    end(event) {
                        isInteracting = false;
                        panel.classList.remove('dragging');
                    },
                },
            });
    }

    // Apply movable functionality to the stopwatch container
    makePanelMovable(stopwatchContainer);
})();
