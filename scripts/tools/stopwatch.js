(function () {
    let stopwatchInterval;
    let elapsedSeconds = 0;

    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const startButton = document.getElementById('start-stopwatch');
    const stopButton = document.getElementById('stop-stopwatch');
    const resetButton = document.getElementById('reset-stopwatch');

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
})();
