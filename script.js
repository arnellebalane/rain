var canvas = document.getElementById("rain");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var isLightning = false;
var drops = [];
var isLight = false;
var gradientBackground = context.createLinearGradient(0,0,100,canvas.height);
var lightningX = randomBetween(0-200,canvas.width-200);

/////////////////////////////////////////////////////////////////////////////

gradientBackground.addColorStop(0,"#000");
gradientBackground.addColorStop(1,"#333");

generateDrops(800);

setInterval(world, 30);

/////////////////////////////////////////////////////////////////////////////

var mousePress = function(event) {
    isLight = !isLight;
}
canvas.addEventListener("click", mousePress);

function generateDrops(rainCount) {
	for (var i = 0; i < rainCount; i++) {
		drops.push(new Drop());
	};
}

/////////////////////////////////////////////////////////////////////////////

function world() {
	clearCanvas();
	drawPole();

	if (isLight && randomBetween(1,50) != 1) {
		drawLight();
	};
	if (!isLight && randomBetween(1,50) == 1) {
		drawLight();
	};

	if (randomBetween(1,10) == 1) {
		isLightning = true;
	};
	if (isLightning) {
		drawLightning();
		isLightning = false;
	};

	for (var i = 0; i < drops.length; i++) {
		drops[i].update().draw();
	};}

/////////////////////////////////////////////////////////////////////////////

function clearCanvas() {
	context.fillStyle = gradientBackground;
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/////////////////////////////////////////////////////////////////////////////

function flash() {
	context.fillStyle = "rgba(0,0,0,0.7)";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLight() {
	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 180);
	context.lineTo(250, canvas.height);
	context.lineTo(1500, canvas.height);
	context.fillStyle = "rgba(0,0,0,0.35)";
	context.closePath();
	context.fill();

	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 180);
	context.lineTo(400, canvas.height);
	context.lineTo(1200, canvas.height);
	context.fillStyle = "rgba(0,0,0,0.35)";
	context.closePath();
	context.fill();

	context.beginPath();
	context.moveTo(450, 160);
	context.lineTo(380, 180);
	context.lineTo(550, canvas.height);
	context.lineTo(1000, canvas.height);
	context.fillStyle = "rgba(0,0,0,0.35)";
	context.closePath();
	context.fill();
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
	context.fillStyle = "#000";
	context.strokeStyle = "#000";
	context.closePath();
	context.fill();
	context.stroke();
}

function drawLightning() {
	lightningX = randomBetween(lightningX-100,lightningX+100);
	var test = randomBetween(lightningX-50, lightningX+50);
	context.beginPath();
	context.lineWidth = randomBetween(1,5);
	context.moveTo(test, 0);context.lineTo(test, 100);
	test = randomBetween(test-50, test+50);context.lineTo(test, 200);
	test = randomBetween(test-50, test+50);context.lineTo(test, 250);
	test = randomBetween(test-100, test+100);context.lineTo(test, 300);
	test = randomBetween(test-100, test+100);context.lineTo(test, 350);
	test = randomBetween(test-200, test+200);context.lineTo(test, 400);
	test = randomBetween(test-100, test+100);context.lineTo(test, 500);
	test = randomBetween(test-50, test+50);context.lineTo(test, 600);
	test = randomBetween(test-50, test+50);context.lineTo(test, 700);
	test = randomBetween(test-50, test+50);context.lineTo(test, canvas.height);
	test = randomBetween(test-50, test+50);context.strokeStyle = "#fff";
	context.stroke();
	// flash();
	context.lineWidth = 1;
}

/////////////////////////////////////////////////////////////////////////////

function Drop() {
	this.x = randomBetween(0,canvas.width);
	this.upperPoint = randomBetween(0, canvas.height);
	this.lowerPoint = this.upperPoint + 10;

	this.update = function() {
		this.upperPoint += 25;
		this.lowerPoint += 25;

		if (this.upperPoint > canvas.height) {
			this.x = randomBetween(0, canvas.width);
			this.upperPoint = -30;
			this.lowerPoint = 0;
		};

		if (this.x < 0) {
			this.x = canvas.width;
		};
		if (this.x > canvas.width) {
			this.x = 0;
		};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.moveTo(this.x, this.upperPoint);
		context.lineTo(this.x, this.lowerPoint);
		context.moveTo(this.x, this.upperPoint-100);
		context.lineTo(this.x, this.upperPoint-75);
		context.strokeStyle = "rgba(250,250,250,0.1)";
		context.stroke();

		return this;
	}
}

















