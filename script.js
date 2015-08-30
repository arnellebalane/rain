var canvas = document.getElementById("Rain");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var isLightning = false;
var drops = [];

setInterval(drawWorld, 30);

generateDrops(100);

function generateDrops(rainCount) {
	for (var i = 0; i < rainCount; i++) {
		drops.push(new Drop());
	};
}

function drawWorld() {
	clearCanvas();
	drawLight();
	if (isLightning) {
		drawLightning();
		isLightning = false
	};
	if (randomBetween(1,50) == 1) {
		context.fillStyle = "#ffffff";
		context.fillRect(0, 0, canvas.width, canvas.height);
		isLightning = true;
	};
	for (var i = 0; i < drops.length; i++) {
		drops[i].update().draw();
	};
	drawPole();
}

function clearCanvas() {
	context.fillStyle = "#0c0c00";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function Drop() {
	this.x = randomBetween(0,canvas.width);
	this.upperPoint = randomBetween(0, canvas.height);
	this.lowerPoint = this.upperPoint + 50;

	this.update = function() {
		this.upperPoint += randomBetween(40, 55);
		this.lowerPoint += 60;

		if (this.upperPoint > canvas.height) {
			this.x = randomBetween(0, canvas.width);
			this.upperPoint = -50;
			this.lowerPoint = -10;
		};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.moveTo(this.x, this.upperPoint);
		context.lineTo(this.x, this.lowerPoint);
		context.moveTo(this.x, this.upperPoint-100);
		context.lineTo(this.x, this.upperPoint-75);
		context.strokeStyle = "#101000";
		context.stroke();

		return this;
	}
}

function drawLight() {
	// context.beginPath();
	// context.moveTo(0, 0);
	// context.lineTo(1150, 0);
	// context.lineTo(1200, 50);
	// context.lineTo(1300, 300);
	// context.lineTo(1250, 500);
	// context.lineTo(1000, 700);
	// context.lineTo(700, canvas.height);
	// context.lineTo(200, canvas.height);
	// context.lineTo(0, canvas.height - 100);
	// context.fillStyle = "#0f0f00";
	// context.strokeStyle = "#0f0f00";
	// context.closePath();
	// context.fill();
	// context.stroke();	

	// context.beginPath();
	// context.moveTo(0, 50);
	// context.lineTo(75, 0);
	// context.lineTo(950, -50);
	// context.lineTo(1050, 50);
	// context.lineTo(1150, 250);
	// context.lineTo(1100, 350);
	// context.lineTo(950, 550);
	// context.lineTo(600, canvas.height - 100);
	// context.lineTo(150, canvas.height - 150);
	// context.lineTo(-50, canvas.height - 250);
	// context.fillStyle = "#141400";
	// context.strokeStyle = "#141400";
	// context.closePath();
	// context.fill();
	// context.stroke();

	// context.beginPath();
	// context.moveTo(500, 0);
	// context.lineTo(750, 0);
	// context.lineTo(850, 50);
	// context.lineTo(900, 100);
	// context.lineTo(875, 250);
	// context.lineTo(800, 350);
	// context.lineTo(600, 450);
	// context.lineTo(400, 475);
	// context.lineTo(175, 425);
	// context.lineTo(75, 350);
	// context.lineTo(25, 150);
	// context.lineTo(75, 50);
	// context.lineTo(200, 0);
	// context.fillStyle = "#191900";
	// context.strokeStyle = "#191900";
	// context.closePath();
	// context.fill();
	// context.stroke();	

	// context.beginPath();
	// context.moveTo(475, 25);
	// context.lineTo(625, 50);
	// context.lineTo(705, 150);
	// context.lineTo(675, 250);
	// context.lineTo(525, 300);
	// context.lineTo(450, 300);
	// context.lineTo(280, 290);
	// context.lineTo(160, 240);
	// context.lineTo(120, 160);
	// context.lineTo(200, 50);
	// context.fillStyle = "#1e1e00";
	// context.strokeStyle = "#1e1e00";
	// context.closePath();
	// context.fill();
	// context.stroke();

	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 170);
	context.lineTo(250, canvas.height);
	context.lineTo(1500, canvas.height);
	context.fillStyle = "rgba( 70, 70, 0, 0.05)";
	context.strokeStyle = "rgba( 70, 70, 0, 0.05)";
	context.closePath();
	context.fill();
	context.stroke();	

	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 170);
	context.lineTo(400, canvas.height);
	context.lineTo(1200, canvas.height);
	context.fillStyle = "rgba( 150, 150, 0, 0.05)";
	context.strokeStyle = "rgba( 150, 150, 0, 0.05)";
	context.closePath();
	context.fill();
	context.stroke();

	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 170);
	context.lineTo(550, canvas.height);
	context.lineTo(1000, canvas.height);
	context.fillStyle = "rgba( 125, 125, 0, 0.05)";
	context.strokeStyle = "rgba( 125, 125, 0, 0.05)";
	context.closePath();
	context.fill();
	context.stroke();
}

function drawPole() {
	context.beginPath();
	context.moveTo(300, canvas.height);
	context.lineTo(320, canvas.height);
	context.lineTo(330, 400);
	context.lineTo(325, 100);
	context.lineTo(300, 110);
	context.lineTo(310, 400);
	context.moveTo(310,180);
	context.lineTo(400, 150);
	context.lineTo(310, 170);
	context.moveTo(400, 155);
	context.lineTo(350, 190);
	context.lineTo(500, 150);
	context.fillStyle = "#0c0c00";
	context.strokeStyle = "#0c0c00";
	context.closePath();
	context.fill();
	context.stroke();
}

function drawLightning() {
	this.type = randomBetween(1, 3);
	if (this.type == 1) {
		context.beginPath();
		context.moveTo(randomBetween(0, canvas.width/2), 0);
		context.lineTo(randomBetween(0, canvas.width/2), 100);
		context.lineTo(randomBetween(0, canvas.width/2), 200);
		context.lineTo(randomBetween(0, canvas.width/2), 250);
		context.lineTo(randomBetween(0, canvas.width/2), 300);
		context.lineTo(randomBetween(0, canvas.width/2), 350);
		context.lineTo(randomBetween(0, canvas.width/2), 400);
		context.lineTo(randomBetween(0, canvas.width/2), randomBetween(400, 600));
		context.strokeStyle = "#aaaa77";
		context.stroke();
	};
	if (this.type == 2) {
		context.beginPath();
		context.moveTo(randomBetween(canvas.width/2, canvas.width), 0);
		context.lineTo(randomBetween(canvas.width/2, canvas.width), 100);
		context.lineTo(randomBetween(canvas.width/2, canvas.width), 200);
		context.lineTo(randomBetween(canvas.width/2, canvas.width), 250);
		context.lineTo(randomBetween(canvas.width/2, canvas.width), 300);
		context.lineTo(randomBetween(canvas.width/2, canvas.width), 350);
		context.lineTo(randomBetween(canvas.width/2, canvas.width), 400);
		context.lineTo(randomBetween(canvas.width/2, canvas.width), randomBetween(400, 600));
		context.strokeStyle = "#aaaa77";
		context.stroke();
	};
}


















