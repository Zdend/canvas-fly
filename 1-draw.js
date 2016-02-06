const canvas = document.getElementById('draw-board');
const cx = canvas.getContext('2d');
let drawing = false;

const radius = 10;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('mousedown', engage.bind(this,true));
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', engage.bind(this,false));


cx.lineWidth = radius * 2;
cx.fillStyle = '#f24e21';
cx.strokeStyle = '#f24e21';

function putPoint(e){
	if(drawing){
		cx.lineTo(e.clientX, e.clientY);
		cx.stroke();
		cx.beginPath();
		cx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
		cx.fill();
		cx.beginPath();
		cx.moveTo(e.clientX, e.clientY);
	}
}

function engage(toggle, e){
	drawing = toggle;
	if(drawing) putPoint(e);
	if(!toggle) cx.beginPath();
}