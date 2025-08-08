const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
let img = new Image();
let imgAspect = 1;

document.getElementById("selectImageBtn").addEventListener("click", async () => {
  const filePath = await window.electronAPI.selectImage();
  if (!filePath) return;

  img.src = filePath;
  img.onload = () => {
    imgAspect = img.height / img.width;
    resizeCanvas();
  };
});

function resizeCanvas() {
  const toolbar = document.getElementById("toolbar");
  const width = toolbar.offsetWidth;
  const height = width * imgAspect;

  canvas.width = width;
  canvas.height = height;

  canvas.style.left = `${toolbar.offsetLeft}px`;
  canvas.style.top = `${toolbar.offsetTop + toolbar.offsetHeight}px`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Si on veut resize la barre à la souris → listener
window.addEventListener("resize", resizeCanvas);
