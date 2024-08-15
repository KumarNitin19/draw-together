console.log("Drawing app");

let isDrawing = false;

const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d");

window.addEventListener("load", function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

function startDrawing() {
  isDrawing = true;
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
