var canvas = document.getElementById("Rain");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var isLightning = false;
var drops = [];
var isLight = false;

var jap = false;
var ghost = true;

setInterval(drawWorld, 30);

generateDrops(200);

var mousePress = function(event) {
    isLight = !isLight;
    if (!jap) {
		jap = true;
	};
	if (ghost || !ghost) {
		ghost = !ghost;
	};
}
canvas.addEventListener("click", mousePress);

function generateDrops(rainCount) {
	for (var i = 0; i < rainCount; i++) {
		drops.push(new Drop());
	};
}	

function drawWorld() {
	clearCanvas();
	if (isLight && randomBetween(1,50) != 1) {
		drawLight();
	};
	if (!isLight && randomBetween(1,50) == 1) {
		drawLight();
	};
	if (isLightning) {
		drawLightning();
		isLightning = false;
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
	if (jap && ghost) {
		drawGhost();
	};
}

function drawGhost() {
	// var x = canvas.width/2-50;
	// var y = canvas.height;
	context.beginPath();
	context.fillStyle = "#000000";
	context.arc(370, 400, 30, Math.PI * 2, false);
	context.fill();

	context.fillRect(350, 165, 2, 250);

	context.beginPath();
	context.fillStyle = "#000000";
	context.moveTo(350, 420);
	context.lineTo(339, 430);
	context.lineTo(333, 470);
	context.lineTo(335, 490);
	context.lineTo(335, 580);
	context.lineTo(330, 670);
	context.lineTo(345, 685);
	context.lineTo(350, 680);
	context.lineTo(347, 670);
	context.lineTo(340, 665);
	context.lineTo(355, 550);
	context.lineTo(353, 420);
	context.fill();
}

function clearCanvas() {
	context.fillStyle = "#000000";
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
		this.upperPoint += 40;
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
		context.strokeStyle = "rgba(0,0,0,0.5)";
		context.stroke();

		return this;
	}
}

function drawLight() {
	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 170);
	context.lineTo(250, canvas.height);
	context.lineTo(1500, canvas.height);
	context.fillStyle = "rgba( 255, 255, 255, 0.25)";
	context.strokeStyle = "rgba( 255, 255, 255, 0.25)";
	context.closePath();
	context.fill();
	context.stroke();	

	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 170);
	context.lineTo(400, canvas.height);
	context.lineTo(1200, canvas.height);
	context.fillStyle = "rgba( 255, 255, 255, 0.25)";
	context.strokeStyle = "rgba( 255, 255, 255, 0.25)";
	context.closePath();
	context.fill();
	context.stroke();

	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 170);
	context.lineTo(550, canvas.height);
	context.lineTo(1000, canvas.height);
	context.fillStyle = "rgba( 255, 255, 255, 0.25)";
	context.strokeStyle = "rgba( 255, 255, 255, 0.25)";
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
	var x = randomBetween(0,canvas.width);
	context.beginPath();
	context.moveTo(randomBetween(x-50, x+50), 0);
	context.lineTo(randomBetween(x-50, x+50), 100);
	context.lineTo(randomBetween(x-50, x+50), 200);
	context.lineTo(randomBetween(x-100, x+100), 250);
	context.lineTo(randomBetween(x-100, x+100), 300);
	context.lineTo(randomBetween(x-200, x+200), 350);
	context.lineTo(randomBetween(x-100, x+100), 400);
	context.lineTo(randomBetween(x-50, x+50), 500);
	context.lineTo(randomBetween(x-50, x+50), 600);
	context.lineTo(randomBetween(x-50, x+50), 700);
	context.strokeStyle = "#aaaa77";
	context.stroke();
}


















