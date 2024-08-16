console.log("Drawing app");

let isDrawing = false,
  brushWidth = 5;

const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll("");
ctx = canvas.getContext("2d");

window.addEventListener("load", function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

function startDrawing() {
  isDrawing = true;
  ctx.beginPath(); //create a new path to draw
  ctx.lineWidth = brushWidth; // passing brush size as line width
}

function stopDrawing() {
  isDrawing = false;
}

const drawing = (e) => {
  if (!isDrawing) return; // if drawing false then return from here!
  ctx.lineTo(e.offsetX, e.offsetY); // creating line according to mouse pointer
  ctx.stroke(); // draw/filling line with color
};

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);
