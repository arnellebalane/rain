var canvas = document.getElementById("Rain");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var drops = [];

setInterval(drawRain, 30);

generateDrops(100);

function generateDrops(rainCount) {
	for (var i = 0; i < rainCount; i++) {
		drops.push(new Drop());
	};
}

function drawRain() {
	clearCanvas();
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