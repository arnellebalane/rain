
////////////////////////////////////////////////////////////////////////////////

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback) { window.setTimeout(callback, 1000 / 60) };
})();

////////////////////////////////////////////////////////////////////////////////

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.height = document.body.offsetHeight;
canvas.width = document.body.offsetWidth;

let tree1 = new Image();
let tree2 = new Image();
tree1.src = 'img/tree1.png';
tree2.src = 'img/tree2.png';

let particles = [];
for (let i = 0; i < 40000; i++) {
  particles.push(new Particle());
}

let trees = [];
for (let i = 0; i < 150; i++) {
  trees.push(new Tree(tree1, -1));
};
for (let i = 0; i < 30; i++) {
  trees.push(new Tree(tree2, -1));
};
trees.sort((a, b) => {
  // if (a.image != b.image) {
  //   return a.image == tree1 ? -1 : 1;
  // } else {
  //   return a.scale < b.scale ? -1 : 1;
  // }
  return a.height < b.height ? 1 : -1;
});

////////////////////////////////////////////////////////////////////////////////

function clearCanvas() {
  context.fillStyle = '#111';
  context.fillRect(0, 0, canvas.width, canvas.height);
};

function getHypothenuse(p1, p2) {
  let x = Math.abs(p1.x - p2.x);
  let y = Math.abs(p1.y - p2.y);
  return Math.sqrt((x * x) + (y * y));
};

function randomBetween(min, max) {
  return ((Math.random() * (max - min)) | 0) + min;
};

function drawTrees() {
  for (let tree of trees) {
    tree.update();
    tree.draw();
  }
};

function drawParticless() {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let particle of particles) {
    particle.update();
    particle.drawToImageData(imageData);
  }
  context.putImageData(imageData, 0, 0);
};

function drawBottomLine() {
  context.strokeStyle = "white";
  context.beginPath();
  context.moveTo(0, canvas.height);
  context.lineTo(canvas.width, canvas.height);
  context.stroke();
};

//////////////////////////////////////////////////////////////////////////////// main loop

loop();
function loop() {
  requestAnimFrame(loop.bind(this));
  clearCanvas();
  drawTrees();
  drawParticless();
  drawBottomLine();
};

//////////////////////////////////////////////////////////////////////////////// objects

function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.depth = (Math.random() * 10 + 1) | 0;
  this.size = this.depth * 0.1;
  this.speedy = (this.depth * .25) + 1 / Math.random();
  this.speedx = -1;
  this.highlight = false;
  this.update = () => {
    this.y += this.speedy;
    this.x += this.speedx;
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
    }
    if (this.x + this.size <= 0) {
      this.x = canvas.width;
    }
    this.highlight = false;
    // if (randomBetween(0, this.y / 1000) == 0) {
    if (randomBetween(0, canvas.height - this.y) == 0) {
      this.highlight = true;
    }
  };
  this.drawToImageData = (imageData) => {
    for (let w = 0; w < this.size; w++) {
      for (let h = 0; h < this.size; h++) {
        let pData = (~~(this.x + w) + (~~(this.y + h) * canvas.width)) * 4;
        let r = this.highlight ? 255 : 100;
        let g = this.highlight ? 255 : 100;
        let b = this.highlight ? 255 : 100;
        let a = this.highlight ? 255 : 255;
        imageData.data[pData] = r;
        imageData.data[pData + 1] = g;
        imageData.data[pData + 2] = b;
        imageData.data[pData + 3] = a;
      }
    }
  };
};

function Tree(image, speed) {
  this.image = image;
  this.scale = Math.random() + 0.1;
  this.width = image.width * this.scale;
  this.height = image.height * this.scale;
  this.speed = speed * this.scale;
  this.x = randomBetween(0 - image.width / 3, canvas.width + tree1.width / 3);
  this.y = canvas.height - this.height + Math.random() * 5;
  this.update = () => {
    this.x += this.speed;
    if (this.x < 0 - image.width / 2) {
      this.x = canvas.width + image.width / 2;
    }
    if (this.x > canvas.width + image.width / 2) {
      this.x = 0 - image.width / 2;
    }
  };
  this.draw = () => {
    context.drawImage(
      image,
      this.x - this.width / 2,
      this.y,
      this.width,
      this.height
    );
  };
};

////////////////////////////////////////////////////////////////////////////////
