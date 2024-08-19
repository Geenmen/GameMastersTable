(function () {
    const calculatorDisplay = document.getElementById('calculator-display');
    const calculatorButtons = Array.from(document.getElementsByClassName('calculator-button'));

    let currentInput = ''; // The current number being entered
    let previousInput = ''; // The previous number entered
    let operator = null; // The operator to apply (e.g., +, -, *, /)

    function updateDisplay(value) {
        calculatorDisplay.value = value;
    }

    function clearCalculator() {
        currentInput = '';
        previousInput = '';
        operator = null;
        updateDisplay('0');
    }

    function performCalculation() {
        const previous = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result = 0;

        switch (operator) {
            case '+':
                result = previous + current;
                break;
            case '-':
                result = previous - current;
                break;
            case '*':
                result = previous * current;
                break;
            case '/':
                result = previous / current;
                break;
            default:
                return;
        }

        currentInput = result.toString();
        operator = null;
        previousInput = '';
        updateDisplay(currentInput);
    }

    calculatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.innerText;

            if (!isNaN(value) || value === '.') {
                // If the button is a number or a decimal point
                currentInput += value;
                updateDisplay(currentInput);
            } else if (value === 'C') {
                // Clear the calculator
                clearCalculator();
            } else if (value === '=') {
                // Perform the calculation
                if (operator && previousInput) {
                    performCalculation();
                }
            } else {
                // Handle the operator buttons (+, -, *, /)
                if (currentInput === '') return;

                if (previousInput !== '') {
                    performCalculation();
                }

                operator = value;
                previousInput = currentInput;
                currentInput = '';
            }
        });
    });

    // Initialize calculator display
    clearCalculator();
})();
