(function () {
    const calculatorDisplay = document.getElementById('calculator-display');
    const calculatorButtons = Array.from(document.getElementsByClassName('calculator-button'));

    let currentInput = ''; // The current number being entered
    let fullEquation = ''; // The full equation as a string
    let operator = null; // The operator to apply (e.g., +, -, *, /)

    function updateDisplay() {
        calculatorDisplay.value = fullEquation || '0';
    }

    function clearCalculator() {
        currentInput = '';
        fullEquation = '';
        operator = null;
        updateDisplay();
    }

    function performCalculation() {
        try {
            fullEquation = eval(fullEquation).toString();
            currentInput = fullEquation;
            operator = null;
        } catch (error) {
            fullEquation = 'Error';
            currentInput = '';
        }
        updateDisplay();
    }

    calculatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.innerText;

            if (!isNaN(value) || value === '.') {
                currentInput += value;
                fullEquation += value;
            } else if (value === 'C') {
                clearCalculator();
                return;
            } else if (value === '=') {
                performCalculation();
                return;
            } else {
                if (currentInput === '') return;
                fullEquation += ` ${value} `;
                currentInput = '';
            }
            updateDisplay();
        });
    });

    // Initialize calculator display
    clearCalculator();

    // Make the calculator container movable
    const calculatorContainer = document.getElementById('calculator-container');
    calculatorContainer.setAttribute('data-x', 0);
    calculatorContainer.setAttribute('data-y', 0);

    makePanelMovable(calculatorContainer);
})();
