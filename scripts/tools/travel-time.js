function initializeTravelTimeCalculator(panel) {
    const distanceInput = panel.querySelector('#distance-input');
    const speedInput = panel.querySelector('#speed-input');
    const restTimeInput = panel.querySelector('#rest-time-input');
    const travelTimePerDayInput = panel.querySelector('#travel-time-per-day-input');
    const calculateTimeBtn = panel.querySelector('#calculate-time-btn');
    const travelTimeResult = panel.querySelector('#travel-time-result');

    const encounterCheckbox = panel.querySelector('#encounter-checkbox');
    const encounterResult = panel.querySelector('#encounter-result');

    // Function to calculate travel time and optionally generate encounters
    calculateTimeBtn.addEventListener('click', () => {
        const distance = parseFloat(distanceInput.value);
        const speed = parseFloat(speedInput.value);
        const restTime = parseFloat(restTimeInput.value);
        const travelTimePerDay = parseFloat(travelTimePerDayInput.value);

        if (isNaN(distance) || isNaN(speed) || isNaN(restTime) || isNaN(travelTimePerDay) || distance <= 0 || speed <= 0 || travelTimePerDay <= 0) {
            alert('Please enter valid numbers for all fields.');
            return;
        }

        // Calculate total travel hours needed
        const totalTime = distance / speed;

        // Calculate the number of full travel days and extra hours
        let totalDays = Math.floor(totalTime / travelTimePerDay);
        let remainingHours = totalTime % travelTimePerDay;

        // If resting time exceeds travel time in a day, adjust the days count accordingly
        if (remainingHours > 0 && remainingHours + restTime > travelTimePerDay) {
            totalDays += 1;
            remainingHours = 0;
        }

        // Display the calculated travel time
        travelTimeResult.textContent = `${totalDays} day(s) and ${remainingHours.toFixed(2)} hour(s)`;

        // Generate encounters if the option is selected
        if (encounterCheckbox.checked) {
            const maxEncounters = totalDays * 2; // Example logic: max 2 encounters per day
            const numberOfEncounters = Math.floor(Math.random() * (maxEncounters + 1)); // Random between 0 and maxEncounters
            encounterResult.textContent = `${numberOfEncounters} encounter(s)`;
        } else {
            encounterResult.textContent = '--'; // Clear encounters if not generating
        }
    });
}