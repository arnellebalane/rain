var canvas = document.getElementById("Rain");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
	for (var i = 0; i < drops.length; i++) {
		drops[i].update().draw();
	};
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
		context.strokeStyle = "#000000";
		context.stroke();

		return this;
	}
}

function drawLight() {
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(1150, 0);
	context.lineTo(1200, 50);
	context.lineTo(1300, 300);
	context.lineTo(1250, 500);
	context.lineTo(1000, 700);
	context.lineTo(700, canvas.height);
	context.lineTo(200, canvas.height);
	context.lineTo(0, canvas.height - 100);
	context.fillStyle = "#0f0f00";
	context.strokeStyle = "#0f0f00";
	context.closePath();
	context.fill();
	context.stroke();	

	context.beginPath();
	context.moveTo(0, 50);
	context.lineTo(75, 0);
	context.lineTo(950, -50);
	context.lineTo(1050, 50);
	context.lineTo(1150, 250);
	context.lineTo(1100, 350);
	context.lineTo(950, 550);
	context.lineTo(600, canvas.height - 100);
	context.lineTo(150, canvas.height - 150);
	context.lineTo(-50, canvas.height - 250);
	context.fillStyle = "#131300";
	context.strokeStyle = "#131300";
	context.closePath();
	context.fill();
	context.stroke();

	context.beginPath();
	context.moveTo(500, 0);
	context.lineTo(750, 0);
	context.lineTo(850, 50);
	context.lineTo(900, 100);
	context.lineTo(875, 250);
	context.lineTo(800, 350);
	context.lineTo(600, 450);
	context.lineTo(400, 500);
	context.lineTo(100, 450);
	context.lineTo(0, 350);
	context.fillStyle = "#171700";
	context.strokeStyle = "#171700";
	context.closePath();
	context.fill();
	context.stroke();	
}