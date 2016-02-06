const canvas = document.getElementById('draw-board');
const cx = canvas.getContext('2d');

const radius = 10;
const planeUrl = 'https://image.freepik.com/free-icon/airplane-flight_318-82756.png';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const H = canvas.height
	, W = canvas.width;

const PLANE_H = 60
	, PLANE_W = 60
	, PILLAR_W = 50;

const PRESS_UP = 38;
const PRESS_DOWN = 40;
const PRESS_LEFT = 37;
const PRESS_RIGHT = 39;

let cX = 0,
	cY = H / 2,
	speed = 20,
	animationCounter = 0,
	PILLARS = [],
	collided = false,
	level = 0,
	movingInterval = undefined,
	distance = 0,
	paths = [];



let planeImage = new Image();
planeImage.src = planeUrl;

planeImage.onload = function(){
	cx.drawImage(planeImage, cX, cY, PLANE_W, PLANE_H);
	initPillars();
	drawObstacles();
}


window.addEventListener('keydown', handleKeyPress);


function handleKeyPress(e){
	if(!movingInterval) activateMovement();
	let key = event.keyCode || event.which;
	let interval = setInterval(_ => {
		animateMovement(key);
		if(animationCounter >= speed){
			clearInterval(interval);
			animationCounter = 0;
		}
	}, 10);

}
function activateMovement(){
	movingInterval = setInterval(_ => {
		cX += 1 + level;
		cY--;
		distance++;
		animateMovement();
	}, 30);
}
function handleCollision(){
	if(collided){
		cX = 0, cY = H /2;
		clearInterval(movingInterval);
		movingInterval = undefined;
		alert(
`You reached level: ${level}
Your distance: ${distance}
Game Over.`);
		level = 0;
		distance = 0;
		initPillars();
		drawObstacles();
		paths = [];
	}
}
function animateMovement(key){
	handleCollision();
 	switch(key){
 		case PRESS_DOWN: cY+=2; break;
 		case PRESS_UP: cY--; break;
 		case PRESS_LEFT: cX--; break;
 		case PRESS_RIGHT: cX++; break;
 	}
 	
 	draw();
 	animationCounter++;
}
function draw(){
	cx.clearRect(0, 0, W, H);
	movePlane();
	drawPath();
	drawObstacles();
	detectColision();
	checkNextChapter();
	drawLevel();
}
function drawLevel(){
	cx.font="30px Georgia";
	cx.fillText(`Level: ${level}`,10,30);
	cx.font="20px Georgia";
	cx.fillText(`Distance: ${Math.round(distance / 10)}`,10,50);
}
function detectColision(){
	collided = PILLARS.some(p => {

		let collidedX = (cX + PLANE_W > p.x && cX + PLANE_W < p.x + p.dx)
						|| (cX < p.x + p.dx && cX > p.x);

		let collidedY = (cY > p.y && cY < p.y + p.dy)
						|| (cY + PLANE_H > p.y && cY < p.y + p.dy);

		let verticalBoundaries = cY < 0 || cY + PLANE_H > H;

		return (collidedX && collidedY) || verticalBoundaries;
	});
}
function movePlane(){
	cx.drawImage(planeImage, cX, cY, PLANE_W, PLANE_H);
}
function drawPath(){
	paths.push({x: cX - 1, y: cY + PLANE_H});
	cx.fillStyle = '#bdbdbd';
	paths.forEach(p => {
		cx.beginPath();
		cx.arc(p.x, p.y, 1, 0, Math.PI * 2);
		cx.fill();
	});
	cx.fillStyle = '#000';
}
function checkNextChapter(){
	if(cX > W){
		initPillars();
		cX = 0;
		level++;
		clearInterval(movingInterval);
		activateMovement();
		paths = [];
	}
}
function initPillars(){
	PILLARS = [];
	let densityByLevel = 400 - level * 45;
	if(densityByLevel < 40) densityByLevel = 40;
	for(let i = 300; i < W; i += densityByLevel){
		let heightBottom = getRandomInt(10, H * 0.7);
		let heightTop = getRandomInt(10, H * 0.2);
		let gap = H - heightBottom - heightTop;
		if(gap < PLANE_H * 1.5) heightBottom -= PLANE_H * 1.5;

		PILLARS.push({x: i, y: H - heightBottom, dx: PILLAR_W, dy: heightBottom});
		PILLARS.push({x: i, y: 0, dx: PILLAR_W, dy: heightTop});
	}
}
function drawObstacles(){
	PILLARS.forEach(pillar => {
		cx.fillRect(pillar.x, pillar.y, pillar.dx, pillar.dy);
	});
	cx.fillStyle = '#2196f3';
	cx.fillRect(0, 0, W, 2);
	cx.fillStyle = '#4caf50';
	cx.fillRect(0, H - 2, W, 2);
	cx.fillStyle = '#000';
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
