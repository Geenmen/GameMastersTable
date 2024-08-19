function initializeDrawPad(panel) {
    const canvas = panel.querySelector('#draw-pad-canvas');
    const ctx = canvas.getContext('2d');
    const colorBtns = panel.querySelectorAll('.color-btn');
    const eraserBtn = panel.querySelector('#eraser');
    const importImageBtn = panel.querySelector('#import-image');
    const zoomInBtn = panel.querySelector('#zoom-in');
    const zoomOutBtn = panel.querySelector('#zoom-out');
    const panBtn = panel.querySelector('#pan');
    const resetBtn = panel.querySelector('#reset');

    let isDrawing = false;
    let currentColor = '#000000';

    let lastX = 0;
    let lastY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let scale = 1;

    // Set up canvas size
    canvas.width = panel.querySelector('.draw-pad-canvas-container').clientWidth;
    canvas.height = panel.querySelector('.draw-pad-canvas-container').clientHeight;

    // Event listener to start drawing
    canvas.addEventListener('mousedown', (e) => {
        if (!isPanning) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX / scale, e.offsetY / scale];
        } else {
            startX = e.offsetX - canvas.offsetLeft;
            startY = e.offsetY - canvas.offsetTop;
            canvas.style.cursor = 'move';
        }
    });

    // Event listener to draw on the canvas
    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX / scale, e.offsetY / scale);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = 2 / scale;
            ctx.stroke();
            [lastX, lastY] = [e.offsetX / scale, e.offsetY / scale];
        } else if (isPanning) {
            canvas.style.left = `${e.offsetX - startX}px`;
            canvas.style.top = `${e.offsetY - startY}px`;
        }
    });

    // Stop drawing when the mouse is released
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        isPanning = false;
        canvas.style.cursor = 'crosshair';
    });

    // Stop drawing when the mouse leaves the canvas
    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        isPanning = false;
        canvas.style.cursor = 'crosshair';
    });

    // Change color
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentColor = btn.getAttribute('data-color');
            deactivateAllTools();
            btn.classList.add('active');
        });
    });

    // Eraser functionality
    eraserBtn.addEventListener('click', () => {
        currentColor = '#ffffff';
        deactivateAllTools();
        eraserBtn.classList.add('active');
    });

    // Import image functionality
    importImageBtn.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Zoom in functionality
    zoomInBtn.addEventListener('click', () => {
        scale *= 1.2;
        resizeCanvas();
    });

    // Zoom out functionality
    zoomOutBtn.addEventListener('click', () => {
        scale /= 1.2;
        resizeCanvas();
    });

    // Pan functionality
    panBtn.addEventListener('click', () => {
        deactivateAllTools();
        isPanning = true;
        panBtn.classList.add('active');
    });

    // Reset functionality
    resetBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
        scale = 1;
        canvas.style.transform = 'translate(0, 0)';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        deactivateAllTools();
        panel.querySelector('#color-black').classList.add('active'); // Default color to black
        currentColor = '#000000';
    });

    // Resize canvas based on the current scale
    function resizeCanvas() {
        canvas.style.transform = `scale(${scale})`;
    }

    // Deactivate all tools (for button state management)
    function deactivateAllTools() {
        panel.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        panel.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    }

    // Initialize with the first color active
    panel.querySelector('#color-black').classList.add('active');
    currentColor = '#000000';
}
