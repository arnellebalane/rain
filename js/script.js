(async () => {

  ////////////////////////////////////////////////////////////////////////////////

  // load canvas and context
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');

  // load images
  let tree = new Image();
  tree.src = 'img/tree.png';
  await Promise.all([
    new Promise((res) => tree.onload = () => res()),
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

  let windSpeed = -3;
  let particles = [];
  let trees = [];
  let lightnings = [];
  let clouds = [];
  let winds = [];

  function initialize() {
    canvas.height = document.body.offsetHeight;
    canvas.width = document.body.offsetWidth;

    particles = [];
    generateParticles();

    trees = [];
    generateTrees();

    lightnings = [];
    // generateLightning();

    clouds = [];
    generateClouds();

    winds = [];
    generateWinds();
  };

  function loop() {
    requestAnimFrame(loop.bind(this));
    if (isTabVisible) {
      clearCanvas();
      drawBottomLine();
      drawLightnings();
      drawLightningsFlash();
      drawClouds();
      drawTrees();
      drawWinds();
      drawParticless();
    }
  };

  ////////////////////////////////////////////////////////////////////////////////

  function generateParticles() {
    for (let i = 0; i < 40000; i++) {
      particles.push(new Particle());
    }
  };

  function generateTrees() {
    for (let i = 0; i < 100; i++) {
      trees.push(new Tree(tree));
    }
    trees.sort((a, b) => {
      return a.height < b.height ? 1 : -1;
    });
  };

  function generateLightning() {
    if (isTabVisible) {
      let lightningCount = randomBetween(1, 5);
      for (let i = 0; i < lightningCount; i++) {
        lightnings.push(new Lightning(randomBetween(0, canvas.width), randomBetween(-500, 500), 4));
      }
    }
  };

  function generateClouds() {
    for (let i = 0; i < 50; i++) {
      clouds.push(new Cloud());
    }
  };

  function generateWinds() {
    for (let i = 0; i < 50; i++) {
      winds.push(new Wind());
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

  function drawLightnings() {
    for (let lightning of lightnings) {
      lightning.draw();
      lightning.update();
    }
    if (randomBetween(0, 10) == 0) {
      generateLightning();
    }
  };

  function drawLightningsFlash() {
    for (let lightning of lightnings) {
      context.fillStyle = `rgba(255, 255, 255, 0.04)`
      context.beginPath();
      context.arc(lightning.x, lightning.y, 300, Math.PI * 2, false);
      context.fill();
    }
  };

  function drawClouds() {
    for (let cloud of clouds) {
      cloud.update();
      cloud.draw();
    }
  };

  function drawWinds() {
    for (let wind of winds) {
      wind.update();
      wind.draw();
    }
  };

  //////////////////////////////////////////////////////////////////////////////// objects

  class Particle {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    depth = (Math.random() * 10 + 1) | 0;
    size = this.depth * 0.1;
    speedy = (this.depth * .25) + 1 / Math.random();
    speedx = windSpeed;
    highlight = false;

    update() {
      this.y += this.speedy;
      this.x += this.speedx;

      for (let wind of winds) {
        let hyp = getHypothenuse(this, wind);
        if (hyp <= wind.r && hyp > 50) {
          this.x += wind.speedx / (hyp / 100);
          this.y += wind.speedy / (hyp / 100);
          break;
        }
      }

      if (this.y > canvas.height) {
        this.y = 0 - this.size;
        this.x = Math.random() * canvas.width;
      }
      if (this.x + this.size <= 0) {
        this.x = canvas.width - Math.abs(this.x);
      } else if (this.x - this.size >= canvas.width) {
        this.x = 0 + (this.x - canvas.width);
      }

      this.highlight = false;
      if (randomBetween(this.y, canvas.height) <= this.y) {
        this.highlight = true;
      }
      // if (randomBetween(0, 1000) == 0) {
      //   this.highlight = true;
      // }
    }

    draw(imageData) {
      for (let w = 0; w < this.size; w++) {
        for (let h = 0; h < this.size; h++) {
          let pData = (~~(this.x + w) + (~~(this.y + h) * canvas.width)) * 4;
          let r = this.highlight ? 255 : 100;
          let g = this.highlight ? 255 : 100;
          let b = this.highlight ? 255 : 100;
          let a = 255;

          imageData.data[pData] = r;
          imageData.data[pData + 1] = g;
          imageData.data[pData + 2] = b;
          imageData.data[pData + 3] = a;
        }
      }
    }
  }

  class Tree {
    scale = randomBetween(50, 100) * 0.01;
    speed = 0 * (1 / this.scale);

    constructor(image) {
      this.image = image;
      this.width = image.width * this.scale;
      this.height = image.height * this.scale;
      this.x = randomBetween(0 - image.width / 3, canvas.width + image.width / 3);
      this.y = canvas.height - this.height + Math.random() * 5;
    }

    update() {
      this.x += this.speed;
      if (this.x < 0 - this.image.width / 2) {
        this.x = canvas.width + this.image.width / 2;
      }
      if (this.x > canvas.width + this.image.width / 2) {
        this.x = 0 - this.image.width / 2;
      }
    }

    draw() {
      let x = this.x - this.width / 2 + 50;
      let y = this.y;
      context.drawImage(
        this.image,
        x,
        y,
        this.width,
        this.height
      );
    }
  }

  class Lightning {
    nodes = [];

    constructor(x, y, lineWidth) {
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
        currentY += randomBetween(50, 150);
        currentLineWidth *= 0.8;

        if (randomBetween(0, 5) == 0) {
          lightnings.push(new Lightning(currentX, currentY, currentLineWidth * 0.8));
        }
      }
    }

    update() {
      for (let node of this.nodes) {
        if (node.lineWidth > 0.1) {
          node.lineWidth *= 0.8;
        }
      }
      if (!this.nodes.length || this.nodes[0].lineWidth <= 0.1) {
        let index = lightnings.indexOf(this);
        lightnings.splice(index, 1);
      }
    }

    draw() {
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
          let yDiff = Math.abs(node.y - nextNode.y);
          context.lineWidth = node.lineWidth;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.bezierCurveTo(
            node.x + randomBetween(-10, 10),
            node.y + (yDiff * 0.25) + randomBetween(-10, 10),
            node.x + randomBetween(-10, 10),
            node.y + (yDiff * 0.75) + randomBetween(-10, 10),
            nextNode.x,
            nextNode.y,
          );
          context.stroke();
        }
      }
      context.lineWidth = 1;
      context.shadowBlur = 0;
    }
  }

  class Cloud {
    x = randomBetween(-150, canvas.width + 150);
    y = randomBetween(-150, canvas.height + 150);
    radius = randomBetween(50, 150);
    speed = windSpeed;
    alpha = 0.01;
    subclouds = [];

    constructor() {
      let subcloudsCount = 7;
      for (let i = 0; i < subcloudsCount; i++) {
        this.subclouds.push({
          x: this.x + randomBetween(-150, 150),
          y: this.y + randomBetween(-70, 70),
          radius: this.radius * (randomBetween(80, 100) * 0.01)
        });
      }
    }

    update() {
      for (let subcloud of this.subclouds) {
        subcloud.x += this.speed;
        if (subcloud.x + subcloud.radius < 0) {
          subcloud.x = canvas.width + subcloud.radius;
        } else if (subcloud.x - subcloud.radius > canvas.width) {
          subcloud.x = 0 - subcloud.radius;
        }
      }
    }

    draw() {
      context.fillStyle = `rgba(0, 0, 0, 0.2)`;
      for (let subcloud of this.subclouds) {
        context.beginPath();
        context.arc(subcloud.x, subcloud.y, subcloud.radius, Math.PI * 2, 0);
        context.fill();
      }
    }
  }

  class Wind {
    x = randomBetween(0, canvas.width);
    y = randomBetween(0, canvas.height);
    r = 150;
    speedx = randomBetween(-10, 10) * 0.1;
    speedy = randomBetween(-10, 10) * 0.1;

    update() {
      this.x += this.speedx;
      this.y += this.speedy;
      if (this.x + this.r < 0) {
        this.x = canvas.width + this.r;
      } else if (this.x - this.r > canvas.width) {
        this.x = 0 - this.r;
      }
      if (this.y + this.r < 0) {
        this.y = canvas.height + this.r;
      } else if (this.y - this.r > canvas.height) {
        this.y = 0 - this.r;
      }
    }

    draw() {
      // context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      // context.beginPath();
      // context.arc(this.x, this.y, this.r, Math.PI * 2, false);
      // context.stroke();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////

  initialize();
  loop();

})();
