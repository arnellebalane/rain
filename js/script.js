(async () => {

  ////////////////////////////////////////////////////////////////////////////////

  // load canvas and context
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');

  // load images
  let tree1 = new Image();
  tree1.src = 'img/tree1.png';
  let tree2 = new Image();
  tree2.src = 'img/tree2.png';
  let monster = new Image();
  monster.src = 'img/godzilla.png';
  let cloud = new Image();
  cloud.src = 'img/cloud.png';
  await Promise.all([
    new Promise((res) => tree1.onload = () => res()),
    new Promise((res) => tree2.onload = () => res()),
    new Promise((res) => monster.onload = () => res()),
    new Promise((res) => cloud.onload = () => res()),
  ]);

  // set request animation frame
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.oRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function (callback) { window.setTimeout(callback, 1000 / 60) };
  })();

  // handle visibility change
  let isTabVisible = true;
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
      isTabVisible = true;
    } else {
      isTabVisible = false;
    }
  });

  // handle window resize
  window.addEventListener("resize", () => {
    initialize();
  });

  ////////////////////////////////////////////////////////////////////////////////

  let particles = [];
  let trees = [];
  let trees1 = [];
  let lightnings = [];
  initialize();
  function initialize() {
    canvas.height = document.body.offsetHeight;
    canvas.width = document.body.offsetWidth;

    particles = [];
    generateParticles();

    trees = [];
    generateTrees();

    trees1 = [];
    generateTrees1();

    lightnings = [];
    // generateLightning();
  };

  ////////////////////////////////////////////////////////////////////////////////

  function generateParticles() {
    for (let i = 0; i < 40000; i++) {
      particles.push(new Particle());
    }
  };

  function generateTrees() {
    for (let i = 0; i < 50; i++) {
      trees.push(new Tree(tree1, -1));
    };
    for (let i = 0; i < 50; i++) {
      trees.push(new Tree(tree2, -1));
    };
    trees.sort((a, b) => {
      return a.height < b.height ? 1 : -1;
    });
  };

  function generateTrees1() {
    for (let i = 0; i < 30; i++) {
      trees1.push(new Tree(tree1, -1.5, true));
    };
    for (let i = 0; i < 30; i++) {
      trees1.push(new Tree(tree2, -1.5, true));
    };
    trees1.sort((a, b) => {
      return a.height < b.height ? 1 : -1;
    });
  };

  function generateLightning() {
    if (isTabVisible) {
      let lightningCount = randomBetween(1, 5);
      for (let i = 0; i < lightningCount; i++) {
        lightnings.push(new Lightning(randomBetween(0, canvas.width), 0, 4));
      }
    }
  };

  function clearCanvas() {
    context.fillStyle = '#000';
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

  function drawTrees1() {
    for (let tree of trees1) {
      tree.update();
      tree.draw();
    }
  };

  function drawParticless() {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let particle of particles) {
      particle.update();
      particle.draw(imageData);
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

  function drawMonster() {
    let scale = 1.5;
    let w = monster.width * scale;
    let h = monster.height * scale;
    context.drawImage(monster, canvas.width / 2 - w / 2, canvas.height - h, w, h);

    let eyeX = canvas.width / 2 - 110;
    let eyeY = canvas.height - h + 20;
    context.fillStyle = "gold";
    context.beginPath();
    context.arc(eyeX, eyeY, 5, Math.PI * 1.9, Math.PI * 0.95);
    context.fill();
  };

  function drawLightnings() {
    for (let lightning of lightnings) {
      lightning.draw();
      lightning.update();
    }
    if (randomBetween(0, 50) == 0) {
      generateLightning();
    }
  };

  function drawLightningsFlash() {
    for (let lightning of lightnings) {
      for (let node of lightning.nodes) {
        context.fillStyle = `rgba(255, 255, 255, ${node.lineWidth / 200})`
        context.beginPath();
        context.arc(node.x, node.y, 700, Math.PI * 2, false);
        context.fill();
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////// main loop

  loop();
  function loop() {
    requestAnimFrame(loop.bind(this));
    clearCanvas();
    drawBottomLine();
    drawLightnings();
    drawLightningsFlash();
    drawTrees1();
    drawMonster();
    drawTrees();
    drawLightningsFlash();
    drawParticless();
  };

  //////////////////////////////////////////////////////////////////////////////// objects

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.depth = (Math.random() * 10 + 1) | 0;
    this.size = this.depth * 0.1;
    this.speedy = (this.depth * .25) + 1 / Math.random();
    this.speedx = -2;
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
      if (randomBetween(0, canvas.height - this.y) == 0) {
        this.highlight = true;
      }
    };
    this.draw = (imageData) => {
      for (let w = 0; w < this.size; w++) {
        for (let h = 0; h < this.size; h++) {
          let pData = (~~(this.x + w) + (~~(this.y + h) * canvas.width)) * 4;
          let r = this.highlight ? 255 : 100;
          let g = this.highlight ? 255 : 100;
          let b = this.highlight ? 255 : 100;
          let a = this.highlight ? 255 : 255;

          // handle if near monster eye
          let scale = 1.5;
          let mw = monster.width * scale;
          let mh = monster.height * scale;
          let eyeX = canvas.width / 2 - 110;
          let eyeY = canvas.height - mh + 20;
          let hyp = getHypothenuse(this, {x: eyeX, y: eyeY});
          if (hyp < 20) {
            r = 155;
            g = 155;
            b = 0;
          }

          imageData.data[pData] = r;
          imageData.data[pData + 1] = g;
          imageData.data[pData + 2] = b;
          imageData.data[pData + 3] = a;
        }
      }
    };
  };

  function Tree(image, speed, one) {
    this.image = image;
    this.scale = Math.random() + 0.1 * (one ? 3 : 1);
    this.width = image.width * this.scale;
    this.height = image.height * this.scale;
    this.speed = speed * this.scale / 2;
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

  function Lightning(x, y, lineWidth) {
    this.nodes = [];
    this.x = x;
    this.y = y;
    let currentX = this.x;
    let currentY = this.y;
    let currentLineWidth = lineWidth;
    for (; currentY < canvas.height + 100 && currentLineWidth > 0.25;) {
      this.nodes.push({
        x: currentX,
        y: currentY,
        lineWidth: currentLineWidth,
      });

      currentX += randomBetween(-100, 100);
      currentY += randomBetween(100, 100);
      currentLineWidth *= 0.8;

      if (randomBetween(1, 5) == 0) {
        lightnings.push(new Lightning(currentX, currentY, currentLineWidth / 2));
      }
    }
    this.update = () => {
      for (let node of this.nodes) {
        if (node.lineWidth > 0.1) {
          node.lineWidth *= 0.7;
        }
      }
      if (this.nodes[0].lineWidth <= 0.1) {
        let index = lightnings.indexOf(this);
        lightnings.splice(index, 1);
      }
    };
    this.draw = () => {
      context.shadowColor = "white";
      context.strokeStyle = "white";
      context.fillStyle = "white";
      context.lineCap = "round";
      for (let i = 0; i < this.nodes.length; i++) {
        let node = this.nodes[i];
        let nextNode = this.nodes[i + 1];
        if (node.lineWidth > 1) {
          // context.shadowBlur = 25;
        } else {
          context.shadowBlur = 0;
        }
        if (nextNode) {
          context.lineWidth = node.lineWidth;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.bezierCurveTo(
            node.x + randomBetween(-10, 10),
            node.y + 25 + randomBetween(-10, 10),
            node.x + randomBetween(-10, 10),
            node.y + 75 + randomBetween(-10, 10),
            nextNode.x,
            nextNode.y,
          );
          context.stroke();
        }
      }
      context.lineWidth = 1;
      context.shadowBlur = 0;
    };
  };

  ////////////////////////////////////////////////////////////////////////////////

})();
