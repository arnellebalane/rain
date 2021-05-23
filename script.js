window.requestAnimFrame = (function () {
  return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback) { window.setTimeout(callback, 1000 / 60) };
})();

let particles = [];
let particleCount = 30000;
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.height = document.body.offsetHeight;
canvas.width = document.body.offsetWidth;

let trees = [];
for (let x = 0; x <= canvas.width; x += 200) {
  trees.push(new Tree(x));
};
function Tree(x) {
  let tree1 = new Image();
  let tree2 = new Image();
  tree1.src = 'tree1.png';
  tree2.src = 'tree2.png';
  this.x = x;
  this.treeImage = Math.random() > 0.5 ? tree1 : tree2;
  this.draw = () => {
    context.drawImage(this.treeImage, x - this.treeImage.width / 2, canvas.height - this.treeImage.height + 20);
  };
};

let umbrella = new function () {
  this.x = canvas.width / 2;
  this.y = canvas.height / 1.5;
  this.radius = 50;
  context.strokeStyle = 'white';
  context.fillStyle = 'rgba(255, 255, 255, 0.2)';
  this.draw = () => {
    let gap = (this.radius * 2) / 9;
    let halfGap = gap / 2;

    context.beginPath(); // main
    context.arc(this.x, this.y, this.radius, Math.PI * 2, Math.PI, true);
    for (let i = this.x - this.radius; i < this.x + this.radius - 1; i += gap) {
      context.arc(i + halfGap, this.y, halfGap, Math.PI, Math.PI * 2);
    }
    context.fill();
    context.stroke();

    context.beginPath(); // stick
    context.moveTo(this.x, this.y - halfGap);
    context.lineTo(this.x, this.y + this.radius);
    context.stroke();

    context.beginPath(); // handle
    context.arc(this.x - halfGap, this.y + this.radius, halfGap, 0, Math.PI);
    context.stroke();

    context.beginPath(); // top
    context.arc(this.x, this.y - this.radius - halfGap, halfGap / 2, Math.PI * 2, false);
    context.stroke();
  };
};

canvas.addEventListener('mousemove', (event) => {
  umbrella.x = event.x;
  umbrella.y = event.y;
  if (umbrella.y - umbrella.radius < 0) {
    umbrella.y = umbrella.radius;
  } else if (umbrella.y + umbrella.radius > canvas.height) {
    umbrella.y = canvas.height - umbrella.radius;
  }
  if (umbrella.x - umbrella.radius < 0) {
    umbrella.x = umbrella.radius;
  } else if (umbrella.x + umbrella.radius > canvas.width) {
    umbrella.x = canvas.width - umbrella.radius;
  }
});

function getHypothenuse(p1, p2) {
  let x = Math.abs(p1.x - p2.x);
  let y = Math.abs(p1.y - p2.y);
  return Math.sqrt((x * x) + (y * y));
};

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}
function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.depth = (Math.random() * 10 + 1) | 0;
  this.size = this.depth * 0.1;
  this.vy = (this.depth * .25) + 1 / Math.random();
  this.vx = -1;
  this.show = true;
  this.update = () => {
    if (
      this.depth > 1 &&
      this.x > (umbrella.x - umbrella.radius) &&
      this.x < (umbrella.x + umbrella.radius)
    ) {
      if (getHypothenuse(this, umbrella) <= umbrella.radius) {
        this.show = false;
      }
    }
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
      this.show = true;
    }
    if (this.x + this.size <= 0) {
      this.x = canvas.width;
    }
    this.y += this.vy;
    this.x += this.vx;
  };
  this.drawToImageData = (imageData) => {
    if (this.show) {
      for (let w = 0; w < this.size; w++) {
        for (let h = 0; h < this.size; h++) {
          let pData = (~~(this.x + w) + (~~(this.y + h) * canvas.width)) * 4;
          imageData.data[pData] = 255;
          imageData.data[pData + 1] = 255;
          imageData.data[pData + 2] = 255;
          imageData.data[pData + 3] = 255;
        }
      }
    }
  };
};

function clearCanvas() {
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
};

function drawTrees() {
  for (let tree of trees) {
    tree.draw();
  }
};

loop();
function loop() {
  requestAnimFrame(loop.bind(this));
  clearCanvas();
  drawTrees();
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let particle of particles) {
    particle.update();
    particle.drawToImageData(imageData);
  }
  context.putImageData(imageData, 0, 0);
  umbrella.draw();
};
