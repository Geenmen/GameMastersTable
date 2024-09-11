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

(function () {
    const addPanelBtn = document.getElementById('add-panel-btn');
    const addPanelPopup = document.getElementById('add-panel-popup');
    const panelNameInput = document.getElementById('panel-name');
    const panelTypeSelect = document.getElementById('panel-type');
    const addPanelBtnConfirm = document.getElementById('add-panel-btn-confirm');
    const cancelPanelBtn = document.getElementById('cancel-panel-btn');

    panelTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        panelTypeSelect.appendChild(option);
    });

    addPanelBtn.addEventListener('click', () => {
        addPanelPopup.style.display = 'flex';
        panelNameInput.value = '';
        addPanelBtnConfirm.style.display = 'none';
    });

    panelNameInput.addEventListener('input', () => {
        const name = panelNameInput.value.trim();
        const isUnique = !activePanels.some(panel => panel.name === name);
        if (name && isUnique) {
            addPanelBtnConfirm.style.display = 'block';
        } else {
            addPanelBtnConfirm.style.display = 'none';
        }
    });

    cancelPanelBtn.addEventListener('click', () => {
        addPanelPopup.style.display = 'none';
    });

    addPanelBtnConfirm.addEventListener('click', () => {
        const panelName = panelNameInput.value.trim();
        const panelType = panelTypeSelect.value;
        createPanel(panelName, panelType);
        addPanelPopup.style.display = 'none';
    });

    initializeAllPanels();
})();

function initializeAllPanels() {
    const panels = document.querySelectorAll('.panel-container');
    panels.forEach(panel => {
        initPanel(panel);
    });
}

function initPanel(panel) {
    makePanelMovable(panel);

    panel.querySelector('.minimize-btn').addEventListener('click', () => minimizePanel(panel));
    panel.querySelector('.close-btn').addEventListener('click', () => deletePanel(panel));
}

function createPanel(name, type) {
    const middleSection = document.getElementById('middle-section');
    const panelContainer = document.createElement('div');
    panelContainer.id = `panel-${name}`;
    panelContainer.className = 'panel-container';

    panelContainer.innerHTML = `
        <div class="panel-header">
            <button class="minimize-btn">-</button>
            <span class="move-handle">Move</span>
            <button class="close-btn">X</button>
        </div>
        <div class="panel-body">
            Loading...
        </div>
        <div class="panel-footer" style="margin-bottom: 5px;">
            <span class="panel-label">${name}</span>
        </div>
    `;

    middleSection.appendChild(panelContainer);
    initPanel(panelContainer);
    loadTool(panelContainer, type);
    activePanels.push({ id: panelContainer.id, name, type, panelContainer });
}





function makePanelMovable(panel) {
    // Enable dragging
    interact(panel.querySelector('.move-handle'))
        .draggable({
            inertia: true,
            autoScroll: true,
            listeners: {
                start(event) {
                    const panel = event.target.closest('.panel-container');
                    panel.classList.add('dragging');
                },
                move(event) {
                    const panel = event.target.closest('.panel-container');
                    const x = (parseFloat(panel.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(panel.getAttribute('data-y')) || 0) + event.dy;

                    panel.style.transform = `translate(${x}px, ${y}px)`;
                    panel.setAttribute('data-x', x);
                    panel.setAttribute('data-y', y);
                },
                end(event) {
                    const panel = event.target.closest('.panel-container');
                    panel.classList.remove('dragging');
                },
            },
        });

    // Enable resizing
    interact(panel)
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            inertia: true,
            listeners: {
                move(event) {
                    const target = event.target;
                    let x = parseFloat(target.getAttribute('data-x')) || 0;
                    let y = parseFloat(target.getAttribute('data-y')) || 0;

                    // Update the element's width and height
                    target.style.width = `${event.rect.width}px`;
                    target.style.height = `${event.rect.height}px`;

                    // Update the element's position
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
            },
            modifiers: [
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                }),
                interact.modifiers.restrictSize({
                    min: { width: 150, height: 100 },
                    max: { width: 10000, height: 10000 },
                }),
            ],
        });
}






function minimizePanel(panel) {
    const minimizedArea = document.getElementById('bottom-section');
    panel.style.display = 'none';
    const restoreButton = document.createElement('button');
    restoreButton.textContent = panel.querySelector('.panel-label').textContent;
    restoreButton.className = 'restore-panel-btn';

    restoreButton.addEventListener('click', () => {
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
