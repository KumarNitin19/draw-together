console.log("Drawing app");

// global variable and it's value
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5;

const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColors = document.querySelecto("#fill-color"),
  ctx = canvas.getContext("2d");

window.addEventListener("load", function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

function startDrawing(e) {
  isDrawing = true;
  prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
  prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
  ctx.beginPath(); //create a new path to draw
  ctx.lineWidth = brushWidth; // passing brush size as line width
  // copying canvas data and passing it as snapshot value
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function stopDrawing() {
  isDrawing = false;
}

function drawRect(e) {
  ctx.strokeRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
}

const drawing = (e) => {
  if (!isDrawing) return; // if drawing false then return from here!
  ctx.putImageData(snapshot, 0, 0); // adding copied canvas data to this canvas
  if (selectedTool === "brush") {
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to mouse pointer
    ctx.stroke(); // draw/filling line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  }
};

toolBtns.forEach((btn) => {
  // adding click event on tool option
  btn.addEventListener("click", () => {
    // removing active class from the previous option and adding on current clicked option
    document.querySelector(".options .active")?.classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);
