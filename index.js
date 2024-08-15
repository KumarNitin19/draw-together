console.log("Drawing app");

const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d");

window.addEventListener("load", function (e) {
  canvas.width = e.offsetWidth;
  canvas.height = e.offsetHeght;
});

const drawing = (e) => {
  ctx.lineTo(e.offsetX, e.offsetY); // creating line according to mouse pointer
  ctx.stroke(); // draw/filling line with color
};

canvas.addEventListener("mousemove", drawing);
