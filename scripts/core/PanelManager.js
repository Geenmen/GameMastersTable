let isInteracting = false; // Global flag to track panel interactions

const panelTypes = [
    { id: 'notepad', name: 'Notepad' },
    { id: 'soundboard', name: 'Sound Board Window' },
    { id: 'file-display', name: 'File Display Window' },
    { id: 'order-tracker', name: 'Order Tracker' },
    { id: 'diceroller', name: 'Dice Roller' },
    { id: 'wheel-of-names', name: 'Wheel Of Names' },
    { id: 'health-tracker', name: 'Health Tracker' },
    { id: 'stat-tracker', name: 'Generic Stat Tracker' },
    { id: 'faction-manager', name: 'Faction Manager' },
    { id: 'random-name', name: 'Random Name' },
    { id: 'random-rumor', name: 'Random Rumor' },
    { id: 'random-job', name: 'Random Job' },
    { id: 'draw-pad', name: 'Draw Pad' },
    { id: 'beastiary', name: 'Beastiary' },
    { id: 'travel-time', name: 'Travel Time Calculator' },
    { id: 'random-encounter', name: 'Random Encounter' }
];

const activePanels = [];
let panelToDelete = null;

(function () {
    const addPanelBtn = document.getElementById('add-panel-btn');
    const addPanelPopup = document.getElementById('add-panel-popup');
    const panelNameInput = document.getElementById('panel-name');
    const panelTypeSelect = document.getElementById('panel-type');
    const addPanelBtnConfirm = document.getElementById('add-panel-btn-confirm');
    const cancelPanelBtn = document.getElementById('cancel-panel-btn');

    // Populate panel types dropdown
    panelTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        panelTypeSelect.appendChild(option);
    });

    // Show add panel popup
    addPanelBtn.addEventListener('click', () => {
        addPanelPopup.style.display = 'flex';
        panelNameInput.value = '';
        addPanelBtnConfirm.style.display = 'none';
    });

    // Enable confirm button only when panel name is unique and non-empty
    panelNameInput.addEventListener('input', () => {
        const name = panelNameInput.value.trim();
        const isUnique = !activePanels.some(panel => panel.name === name);
        if (name && isUnique) {
            addPanelBtnConfirm.style.display = 'block';
        } else {
            addPanelBtnConfirm.style.display = 'none';
        }
    });

    // Hide add panel popup
    cancelPanelBtn.addEventListener('click', () => {
        addPanelPopup.style.display = 'none';
    });

    // Add new panel
    addPanelBtnConfirm.addEventListener('click', () => {
        const panelName = panelNameInput.value.trim();
        const panelType = panelTypeSelect.value;
        createPanel(panelName, panelType);
        addPanelPopup.style.display = 'none';
    });

    // Initialize existing panels
    initializeAllPanels();

    // Handle delete confirmation
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    confirmDeleteBtn.addEventListener('click', () => {
        if (panelToDelete) {
            deletePanel(panelToDelete);
            panelToDelete = null;
        }
        document.getElementById('confirm-delete-popup').style.display = 'none';
    });

    cancelDeleteBtn.addEventListener('click', () => {
        panelToDelete = null;
        document.getElementById('confirm-delete-popup').style.display = 'none';
    });
})();

function initializeAllPanels() {
    const panels = document.querySelectorAll('.panel-container');
    panels.forEach(panel => {
        initPanel(panel);
    });
}

function initPanel(panel) {
    makePanelMovable(panel);
    makePanelResizable(panel);

    // Minimize and close functionality
    const minimizeBtn = panel.querySelector('.minimize-btn');
    const closeBtn = panel.querySelector('.close-btn');
    const moveHandle = panel.querySelector('.move-handle');

    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        minimizePanel(panel);
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        confirmDeletePanel(panel);
    });

    moveHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation(); // Prevent panning when starting to drag
    });

    // Prevent panning when clicking inside the panel
    panel.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    // Prevent panning when interacting with interactive elements inside the panel
    const interactiveElements = panel.querySelectorAll('button, input, textarea, select');
    interactiveElements.forEach(element => {
        element.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    });
}

function createPanel(name, type) {
    const zoomableContent = document.getElementById('zoomable-content');
    const panelContainer = document.createElement('div');
    panelContainer.id = `panel-${name}`;
    panelContainer.className = 'panel-container';

    // Calculate the center position within the zoomable content
    const viewportWidth = zoomableContent.clientWidth / window.zoomScale;
    const viewportHeight = zoomableContent.clientHeight / window.zoomScale;
    const panelWidth = 300; // Assuming initial panel width
    const panelHeight = 200; // Assuming initial panel height

    const centerX = (viewportWidth - panelWidth) / 2;
    const centerY = (viewportHeight - panelHeight) / 2;

    // Set initial position at the center
    panelContainer.style.left = `${centerX}px`;
    panelContainer.style.top = `${centerY}px`;
    panelContainer.style.transform = 'none'; // Ensure no transform initially

    panelContainer.innerHTML = `
        <div class="panel-header">
            <button class="minimize-btn" aria-label="Minimize Panel">-</button>
            <span class="move-handle">Move</span>
            <button class="close-btn" aria-label="Close Panel">X</button>
        </div>
        <div class="panel-body">
            Loading...
        </div>
        <div class="panel-footer" style="margin-bottom: 5px;">
            <span class="panel-label">${name}</span>
        </div>
    `;

    zoomableContent.appendChild(panelContainer);
    initPanel(panelContainer);
    loadTool(panelContainer, type);
    activePanels.push({ id: panelContainer.id, name, type, panelContainer });
}



function makePanelMovable(panel) {
    // Enable dragging
    interact(panel.querySelector('.move-handle'))
        .draggable({
            inertia: false,
            autoScroll: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            listeners: {
                // Set the flag when dragging starts
                start(event) {
                    isInteracting = true;
                    const panel = event.target.closest('.panel-container');
                    panel.classList.add('dragging');
                },
                // Handle the drag move event
                move(event) {
                    if (isInteracting) {
                        const panel = event.target.closest('.panel-container');
                        const currentScale = window.zoomScale || 1; // Use global scale

                        // Get current position from 'left' and 'top'
                        let left = parseFloat(panel.style.left) || 0;
                        let top = parseFloat(panel.style.top) || 0;

                        // Update position based on movement, adjusted for scale
                        left += event.dx / currentScale;
                        top += event.dy / currentScale;

                        panel.style.left = `${left}px`;
                        panel.style.top = `${top}px`;
                    }
                },
                // Unset the flag when dragging ends
                end(event) {
                    isInteracting = false;
                    const panel = event.target.closest('.panel-container');
                    panel.classList.remove('dragging');
                },
            },
        });
}

function makePanelResizable(panel) {
    interact(panel)
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            inertia: true,
            modifiers: [
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                }),
                interact.modifiers.restrictSize({
                    min: { width: 150, height: 100 },
                    max: { width: 10000, height: 10000 },
                }),
            ],
            listeners: {
                // Set the flag when resizing starts
                start(event) {
                    isInteracting = true;
                },
                // Handle the resize move event
                move(event) {
                    if (isInteracting) {
                        const currentScale = window.zoomScale || 1; // Current zoom scale

                        // Calculate new size adjusted for scale
                        const newWidth = event.rect.width / currentScale;
                        const newHeight = event.rect.height / currentScale;

                        // Update panel size
                        panel.style.width = `${newWidth}px`;
                        panel.style.height = `${newHeight}px`;

                        // Only adjust left and top if resizing from the left or top edges
                        let left = parseFloat(panel.style.left) || 0;
                        let top = parseFloat(panel.style.top) || 0;

                        if (event.edges.left) {
                            left += event.deltaRect.left / currentScale;
                            left = Math.max(0, left); // Prevent negative left
                            panel.style.left = `${left}px`;
                        }
                        if (event.edges.top) {
                            top += event.deltaRect.top / currentScale;
                            top = Math.max(0, top); // Prevent negative top
                            panel.style.top = `${top}px`;
                        }

                        // Debugging: Log values to verify calculations
                        console.log(`Resizing Panel: ${panel.id}`);
                        console.log(`New Size: ${newWidth}px x ${newHeight}px`);
                        console.log(`New Position: left=${left}px, top=${top}px`);
                        console.log(`Scale: ${currentScale}`);
                    }
                },
                // Unset the flag when resizing ends
                end(event) {
                    isInteracting = false;
                },
            },
        });
}

function minimizePanel(panel) {
    const minimizedArea = document.getElementById('bottom-section');
    panel.style.display = 'none';
    const restoreButton = document.createElement('button');
    restoreButton.textContent = panel.querySelector('.panel-label').textContent;
    restoreButton.className = 'restore-panel-btn';

    restoreButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        panel.style.display = 'flex';
        minimizedArea.removeChild(restoreButton);
    });

    minimizedArea.appendChild(restoreButton);
}

function deletePanel(panel) {
    const panelId = panel.id;
    const script = document.getElementById(`${panelId}-script`);
    const css = document.getElementById(`${panelId}-css`);
    if (script) script.remove();
    if (css) css.remove();

    if (typeof window[`${panelId}Cleanup`] === 'function') {
        window[`${panelId}Cleanup`]();
    }

    const index = activePanels.findIndex(p => p.id === panelId);
    if (index !== -1) {
        activePanels.splice(index, 1);
    }

    panel.remove();
}

function confirmDeletePanel(panel) {
    panelToDelete = panel;
    const confirmDeletePopup = document.getElementById('confirm-delete-popup');
    confirmDeletePopup.style.display = 'flex';
}

function loadTool(panelContainer, toolName) {
    const panelId = panelContainer.id;

    if (!activePanels[toolName]) {
        activePanels[toolName] = {};
    }

    activePanels[toolName][panelId] = panelContainer;

    fetch(`assets/components/${toolName}.html`)
        .then(response => response.text())
        .then(html => {
            panelContainer.querySelector('.panel-body').innerHTML = html;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `assets/styles/${toolName}.css`;
            link.id = `${toolName}-css-${panelId}`;
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = `scripts/tools/${toolName}.js`;
            script.id = `${toolName}-script-${panelId}`;

            script.onload = () => {
                setTimeout(() => {
                    switch (toolName) {
                        case 'diceroller':
                            initializeDiceRoller(panelContainer);
                            break;
                        case 'notepad':
                            initializeNotepad(panelContainer);
                            break;
                        case 'soundboard':
                            initializeSoundBoard(panelContainer);
                            break;
                        case 'file-display':
                            initializeFileDisplay(panelContainer);
                            break;
                        case 'order-tracker':
                            initializeOrderTracker(panelContainer);
                            break;
                        case 'wheel-of-names':
                            initializeWheelOfNames(panelContainer);
                            break;
                        case 'health-tracker':
                            initializeHealthTracker(panelContainer);
                            break;
                        case 'stat-tracker':
                            initializeStatTracker(panelContainer);
                            break;
                        case 'faction-manager':
                            initializeFactionManager(panelContainer);
                            break;
                        case 'random-name':
                            initializeRandomName(panelContainer);
                            break;
                        case 'random-rumor':
                            initializeRandomRumor(panelContainer);
                            break;
                        case 'random-job':
                            initializeRandomJob(panelContainer);
                            break;
                        case 'draw-pad':
                            initializeDrawPad(panelContainer);
                            break;
                        case 'beastiary':
                            initializeBeastiary(panelContainer);
                            break;
                        case 'travel-time':
                            initializeTravelTimeCalculator(panelContainer);
                            break;
                        case 'random-encounter':
                            initializeRandomEncounter(panelContainer);
                            break;
                        default:
                            console.warn(`No initialization function defined for tool: ${toolName}`);
                    }
                }, 0);
            };
            document.body.appendChild(script);
        })
        .catch(err => console.error(`Error loading ${toolName}:`, err));
}
