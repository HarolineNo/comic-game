const c = document.getElementById('canvas');
const slider = document.getElementById('slider');
const penBtn = document.getElementById('pen');
const rectBtn = document.getElementById('rectangle');
const squareBtn = document.getElementById('square');
const circleBtn = document.getElementById('circle');
const lineSegmentBtn = document.getElementById('line-segment');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const ctx = c.getContext('2d', { willReadFrequently: true });
let coordinates = {x:0, y:0};
let points = {x1:0, y1:0, x2:0, y2:0};
let currentTool = 'pen';
let isDrawing = false;
let brushSize = 5;
let imgData;
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

// Function to draw a rectangle based on their start and end point
function drawRect(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    // Height and width is calculated basd on the difference from the start and end coordinates
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
}

// Function to draw a square based on their start and end point
function drawSquare(x1, y1, x2) {
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    // Uses the difference of the start and end position for both height and width to get equal length sides
    ctx.rect(x1, y1, x2 - x1, x2 - x1);
    ctx.stroke();
}

// Function to draw a circle based on their start and end point
function drawCircle(x1, y1, x2) {
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    // Creates a circle using arc
    // Absolute value is used so the circle can be drawn from left and right
    ctx.arc(x1, y1, Math.abs(x2 - x1), 0, 2 * Math.PI);
    ctx.stroke();
}

// Function to draw a straight line based on their start and end point
function drawLineSegment(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Draw shape based on the current tool (whichever shape button was pressed)
function drawShape(x2, y2) {
    if (currentTool === 'rect') {
        drawRect(points.x1, points.y1, x2, y2);
    }
    else if (currentTool === 'square') {
        drawSquare(points.x1, points.y1, x2);
    }
    else if (currentTool === 'circle') {
        drawCircle(points.x1, points.y1, x2, y2);
    }
    else if (currentTool === 'lineSegment') {
        drawLineSegment(points.x1, points.y1, x2, y2);
    }
}

// When the user presses down on their mouse, isDrawing is set to true and the line's beginning is offest to match the user's position
function startDrawing(e) {
    isDrawing = true;
    if (currentTool === 'pen') {
        coordinates.x = e.offsetX;
        coordinates.y = e.offsetY;
    }
    // If any shape button was pressed, change value in dictionary for x1 and x2 to the starting position
    else {
        points.x1 = e.offsetX;
        points.y1 = e.offsetY;
    }
    // Copies the pixel data for the whole canvas
    imgData = ctx.getImageData(0, 0, c.width, c.height);
    undoArray.push(imgData);
    // Clears redo when starting a new drawing
    redoArray = [];
}

// The x and y positions are offset to match the mouse's position to draw a continuous line
function movePen(e) {
    if (!isDrawing) return;
    if (currentTool === 'pen') {
        drawLine(coordinates.x, coordinates.y, e.offsetX, e.offsetY);
        coordinates.x = e.offsetX;
        coordinates.y = e.offsetY;
    }
    else {
        // Shows shape as user is moving the cursor
        ctx.putImageData(imgData, 0, 0);
        drawShape(e.offsetX, e.offsetY);
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
    else {
        drawShape(e.offsetX, e.offsetY);
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
    undoArray.push(ctx.getImageData(0, 0, c.width, c.height));
    redoArray = [];
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c.width, c.height)
}

// Changes the size of the brush based on the value of the input slider
function changeBrushSize(e) {
    brushSize = e.target.value;
    ctx.lineWidth = brushSize;
}

function getUndo() {
    if (undoArray.length > 0) {
        redoArray.push(ctx.getImageData(0, 0, c.width, c.height));
        let undoImg = undoArray.pop();
        ctx.putImageData(undoImg, 0, 0);
    }
}

function getRedo() {
    if (redoArray.length > 0) {
        undoArray.push(ctx.getImageData(0, 0, c.width, c.height));
        let redoImg = redoArray.pop();
        ctx.putImageData(redoImg, 0, 0);
    }
}

penBtn.addEventListener('click', () => {
    currentTool = 'pen';
});
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
undoBtn.addEventListener('click', getUndo);
redoBtn.addEventListener('click', getRedo);