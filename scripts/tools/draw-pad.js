function initializeDrawPad(panel) {
    const drawPadContainer = panel.querySelector('#draw-pad-container');
    const drawingArea = panel.querySelector('#drawing-area');
    const backgroundImage = panel.querySelector('#background-image');
    const clearBtn = panel.querySelector('#clear');
    const eraseBtn = panel.querySelector('#erase');
    const colorPicker = panel.querySelector('#color-picker');
    const imageUpload = panel.querySelector('#image-upload');
    const downloadBtn = panel.querySelector('#download');

    let drawing = false;
    let erasing = false;
    let currentColor = colorPicker.value;

    drawPadContainer.addEventListener('mousedown', (e) => {
        drawing = true;
        drawOrEraseCircle(e);
    });

    drawPadContainer.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        drawOrEraseCircle(e);
    });

    drawPadContainer.addEventListener('mouseup', () => {
        drawing = false;
    });

    drawPadContainer.addEventListener('mouseout', () => {
        drawing = false;
    });

    clearBtn.addEventListener('click', () => {
        drawingArea.innerHTML = '';
    });

    eraseBtn.addEventListener('click', () => {
        erasing = !erasing;
        eraseBtn.textContent = erasing ? 'Drawing Mode' : 'Erase';
    });

    colorPicker.addEventListener('input', () => {
        currentColor = colorPicker.value;
        erasing = false;
        eraseBtn.textContent = 'Erase';
    });

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                backgroundImage.src = event.target.result;
                backgroundImage.style.display = 'block';
                backgroundImage.onload = () => {
                    resizeDrawPadToImage(backgroundImage.naturalWidth, backgroundImage.naturalHeight);
                };
            };
            reader.readAsDataURL(file);
        }
    });

    downloadBtn.addEventListener('click', () => {
        html2canvas(drawPadContainer, {
            useCORS: true  // Ensures cross-origin images are handled
        }).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'draw-pad.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    function getCursorPosition(e) {
        const rect = drawPadContainer.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function drawOrEraseCircle(e) {
        const pos = getCursorPosition(e);

        if (erasing) {
            eraseCircle(pos.x, pos.y);
        } else {
            drawCircle(pos.x, pos.y);
        }
    }

    function drawCircle(x, y) {
        const circle = document.createElement('div');
        circle.style.width = '10px';
        circle.style.height = '10px';
        circle.style.backgroundColor = currentColor;
        circle.style.left = `${x - 5}px`;  // Center the circle at the cursor
        circle.style.top = `${y - 5}px`;
        circle.className = 'drawn-circle';
        circle.dataset.position = `${x},${y}`;  // Tag with position for easy reference
        drawingArea.appendChild(circle);
    }

    function eraseCircle(x, y) {
        const tolerance = 10; // Adjust tolerance for erasing nearby circles
        const circles = drawingArea.getElementsByClassName('drawn-circle');

        for (let i = circles.length - 1; i >= 0; i--) {
            const circle = circles[i];
            const [cx, cy] = circle.dataset.position.split(',').map(Number);

            // Calculate distance from cursor to the circle's center
            const distance = Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2));

            // If within tolerance, remove the circle
            if (distance < tolerance) {
                circle.remove();
            }
        }
    }

    function resizeDrawPadToImage(imageWidth, imageHeight) {
        const maxWidth = drawPadContainer.parentElement.clientWidth * 0.9; // 90% of parent width
        const maxHeight = drawPadContainer.parentElement.clientHeight * 0.8; // 80% of parent height

        const aspectRatio = imageWidth / imageHeight;

        let newWidth, newHeight;

        if (imageWidth > maxWidth || imageHeight > maxHeight) {
            if (aspectRatio > 1) {
                // Image is wider than tall
                newWidth = maxWidth;
                newHeight = maxWidth / aspectRatio;
            } else {
                // Image is taller than wide
                newHeight = maxHeight;
                newWidth = maxHeight * aspectRatio;
            }
        } else {
            // Image fits within the available space
            newWidth = imageWidth;
            newHeight = imageHeight;
        }

        drawPadContainer.style.width = `${newWidth}px`;
        drawPadContainer.style.height = `${newHeight}px`;
    }
}
