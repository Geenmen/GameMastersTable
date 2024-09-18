(function () {
    const calculatorDisplay = document.getElementById('calculator-display');
    const calculatorButtons = Array.from(document.getElementsByClassName('calculator-button'));
    const calculatorContainer = document.getElementById('calculator-container');

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

    // Apply movable functionality to the calculator container
    makePanelMovable(calculatorContainer);
})();
