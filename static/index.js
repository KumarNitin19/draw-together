console.log("Drawing app");

// global variable and it's value
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector("#clear-canvas"),
  saveAsImage = document.querySelector("#save-as-image"),
  ctx = canvas.getContext("2d");

function setCanvasBackground() {
  ctx.fillStyle = "whitesmoke";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

window.addEventListener("load", function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

function startDrawing(e) {
  isDrawing = true;
  prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
  prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
  ctx.beginPath(); //create a new path to draw
  ctx.lineWidth = brushWidth; // passing brush size as line width
  ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
  ctx.fillStyle = selectedColor; // passing selectedColor as fill style
  // copying canvas data and passing it as snapshot value
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function stopDrawing() {
  isDrawing = false;
}

// function to draw a circle
function drawRect(e) {
  // if fill color isn't checked draw a rect with border else draw rect with background
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
}

// function to draw a circle
function drawCircle(e) {
  ctx.beginPath(); // creating a new path to draw circle
  // getting radius of circle based on mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  if (!fillColor.checked) {
    return ctx.stroke();
  }
  ctx.fill();
}

// function to draw a triangle
function drawTriangle(e) {
  ctx.beginPath(); // creating a new path to draw triangle
  ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to mouse pointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of traingle
  ctx.closePath();
  if (!fillColor.checked) {
    return ctx.stroke();
  }
  ctx.fill();
}

// function to draw a square
function drawSquare(e) {
  ctx.beginPath();
  // if fill color isn't checked draw a rect with border else draw rect with background
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseX - e.offsetX
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseX - e.offsetX
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
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  } else if (selectedTool === "square") {
    drawSquare(e);
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

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // removing selected class from the previous option and adding on current clicked option
    document.querySelector(".options .selected")?.classList.remove("selected");
    btn.classList.add("selected");
    // getting selected color value
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.backgroundColor = colorPicker.value;
  selectedColor = colorPicker.value;
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveAsImage.addEventListener("click", () => {
  const link = document.createElement("a");
  canvas.style.background = "#fff";
  link.href = canvas.toDataURL();
  link.download = `${Date.now()}.jpg`;
  link.click();
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);
