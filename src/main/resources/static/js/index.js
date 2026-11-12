const c = document.getElementById('canvas');
const slider = document.getElementById('slider');
let rectBtn = document.getElementById('rectangle');
let squareBtn = document.getElementById('square');
let circleBtn = document.getElementById('circle');
let lineSegmentBtn = document.getElementById('line-segment');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const ctx = c.getContext('2d');
let coordinates = {x:0, y:0};
let points = {x1:0, y1:0, x2:0, y2:0};
let currentTool = 'pen';
let isDrawing = false;
let brushSize = 5;
let undoArray = [];
let redoArray = [];

// Function to draw a line based on user's mouse position
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    // Starts line at the position where the user first begins to hold down their mouse
    ctx.moveTo(x1, y1);
    // Determines the path of the line depending on the coordinates when the mouse moves
    ctx.lineTo(x2, y2);
    ctx.lineWidth = brushSize;
    // Determines the shape of the line (the shape of the end caps)
    ctx.lineCap = 'round';
    // Creates a rounded corner when two lines meet
    ctx.lineJoin = 'round';
    // Renders the line
    ctx.stroke();
}

function drawRect(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
}

function drawSquare(x1, y1, x2) {
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.rect(x1, y1, x2 - x1, x2 - x1);
    ctx.stroke();
}

function drawCircle(x1, y1, x2) {
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.arc(x1, y1, x2 - x1, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawLineSegment(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.linewidth = brushSize;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// The x and y positions are offset to match the mouse's position to draw a continuous line
 function movePen(e) {
    if (!isDrawing) return;
    if (currentTool === 'pen') {
        drawLine(coordinates.x, coordinates.y, e.offsetX, e.offsetY);
        coordinates.x = e.offsetX;
        coordinates.y = e.offsetY;
    }
 }

// When the user presses down on their mouse, isDrawing is set to true and the line's beginning is offest to match the user's position
function startDrawing(e) {
    isDrawing = true;
    if (currentTool === 'pen') {
        coordinates.x = e.offsetX;
        coordinates.y = e.offsetY;
    }
    else if (currentTool !== 'pen') {
        points.x1 = e.offsetX;
        points.y1 = e.offsetY;
    }
}

// When the user stop holding their mouse down, isDrawing is set to false, the line ends at the user's last position, and the coordinates are reset back to 0,0
 function stopDrawing(e) {
    if (!isDrawing) return;
    if (currentTool === 'pen') {
        drawLine(coordinates.x, coordinates.y, e.offsetX, e.offsetY);
        coordinates.x = 0;
        coordinates.y = 0;
    }
    else if (currentTool === 'rect') {
        points.x2 = e.offsetX;
        points.y2 = e.offsetY;
        drawRect(points.x1, points.y1, points.x2, points.y2);
    }
    else if (currentTool === 'square') {
        points.x2 = e.offsetX;
        points.y2 = e.offsetY;
        drawSquare(points.x1, points.y1, points.x2);
    }
    else if (currentTool === 'circle') {
        points.x2 = e.offsetX;
        points.y2 = e.offsetY;
        drawCircle(points.x1, points.y1, points.x2);
    }
    else if (currentTool === 'lineSegment') {
        points.x2 = e.offsetX;
        points.y2 = e.offsetY;
        drawLineSegment(points.x1, points.y1, points.x2, points.y2);
    }
    currentTool = 'pen';
    isDrawing = false;
}

// When user clicks a color, the color of the brush changes to that color
function changeColor(color) {
    ctx.strokeStyle = color;
}

// When user clicks the clear button, a filled white rectangle is filled starting from the top left, matching the canvas's proportions
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c.width, c.height)
}

// Changes the size of the brush based on the value of the input slider
function changeBrushSize(e) {
    brushSize = e.target.value;
    ctx.lineWidth = brushSize;
}

rectBtn.addEventListener('click', () => {
    currentTool = 'rect';
});
squareBtn.addEventListener('click', () => {
    currentTool = 'square';
});
circleBtn.addEventListener('click', () => {
    currentTool = 'circle';
});
lineSegmentBtn.addEventListener('click', () => {
    currentTool = 'lineSegment';
});

c.addEventListener('mousedown', startDrawing);
c.addEventListener('mousemove', movePen);
c.addEventListener('mouseup', stopDrawing);
slider.addEventListener('change', changeBrushSize);

