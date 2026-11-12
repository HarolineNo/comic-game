const c = document.getElementById("canvas");
const slider = document.getElementById("slider");
const ctx = c.getContext("2d");
let x = 0;
let y = 0;
let isDrawing = false;
let brushSize = 5;

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

// When the user presses down on their mouse, isDrawing is set to true and the line's beginning is offest to match the user's position
c.addEventListener('mousedown', (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
})

// The x and y positions are offset to match the mouse's position to draw a continuous line
c.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        drawLine(x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
})

// When the user stop holding their mouse down, isDrawing is set to false, the line ends at the user's last position, and the coordinates are reset back to 0,0
window.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        drawLine(x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
})

// When user clicks a color, the color of the brush changes to that color
function changeColor(color) {
    ctx.strokeStyle = color;
}

// When user clicks the clear button, a filled white rectangle is filled starting from the top left, matching the canvas's proportions
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c.width, c.height)
}

// Changes the size of the brush based ont the value of the input slider
slider.addEventListener('change', (e) => {
    brushSize = e.target.value;
    ctx.lineWidth = brushSize;
})
