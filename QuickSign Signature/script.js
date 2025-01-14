const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Undo/Redo state
let undoStack = [];
let redoStack = [];
const maxStates = 50;

// Initialize canvas
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = 300;
    redrawCanvas();
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing state
function updateDrawingStyle() {
    ctx.strokeStyle = document.getElementById('penColor').value;
    ctx.lineWidth = document.getElementById('penThickness').value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

// Save state for undo/redo
function saveState() {
    undoStack.push(canvas.toDataURL());
    if (undoStack.length > maxStates) {
        undoStack.shift();
    }
    redoStack = [];
    updateButtons();
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
    updateDrawingStyle();
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const [currentX, currentY] = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    [lastX, lastY] = [currentX, currentY];
}

function stopDrawing() {
    if (isDrawing) {
        saveState();
    }
    isDrawing = false;
}

function getCoordinates(e) {
    let x, y;
    
    if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        const rect = canvas.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }

    return [x, y];
}

// Undo/Redo functions
function undo() {
    if (undoStack.length > 0) {
        const lastState = undoStack.pop();
        redoStack.push(canvas.toDataURL());
        loadState(lastState);
        updateButtons();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(canvas.toDataURL());
        loadState(nextState);
        updateButtons();
    }
}

function loadState(state) {
    const img = new Image();
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = state;
}

function redrawCanvas() {
    if (undoStack.length > 0) {
        loadState(undoStack[undoStack.length - 1]);
    }
}

function updateButtons() {
    document.querySelector('.undo-btn').disabled = undoStack.length === 0;
    document.querySelector('.redo-btn').disabled = redoStack.length === 0;
}

// Clear canvas
function clearCanvas() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('savedSignature').style.display = 'none';
}

// Save signature
function saveSignature() {
    const dataUrl = canvas.toDataURL('image/png');
    const savedSignature = document.getElementById('savedSignature');
    savedSignature.src = dataUrl;
    savedSignature.style.display = 'block';
}

// Download signature
function downloadSignature() {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Initial state
saveState();