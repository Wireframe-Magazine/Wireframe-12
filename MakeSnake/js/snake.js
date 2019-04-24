var canvas = document.getElementById('bg');
var draw2D = canvas.getContext('2d');
	
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function drawBox(x, y, width, height, color){
	draw2D.beginPath();
	draw2D.rect(x, y, width, height);
	draw2D.fillStyle = color;
	draw2D.fill();
	draw2D.closePath();
}


function roundToGrid(numb) {
	return Math.round(numb/10) * 10;
}
	
function randomRange(min, max){
	return Math.random() * (max - min) + min;
}


var snake = [];
snake.push( {x:canvas.width/2, y:canvas.height/2} );
snake.push( {x:-10, y:-10} );
snake.push( {x:-10, y:-10} );
	
var xDir = 0;
var yDir = -1;
	
var food = {};
food.x = randomRange(0, canvas.width-10);
food.y = randomRange(0, canvas.height-10);
	
var moveTimer = 0;
var moveTimerMax = 100;


var lastFrameTime = Date.now();
	
window.requestAnimationFrame(update);
	
function update () {
	var deltaTime =  Date.now() - lastFrameTime;
	lastFrameTime = Date.now();
	
	moveTimer += deltaTime;
	if (moveTimer > moveTimerMax) {
		moveTimer = 0;
		
		for(var i=snake.length-1; i > 0; i--){
			snake[i].x = snake[i-1].x;
			snake[i].y = snake[i-1].y;
		}
		
		snake[0].x += xDir*10;
		snake[0].y += yDir*10;
	}
	
	render();
	checkCollision();
	
	window.requestAnimationFrame(update);
}


function render() {
	drawBox(0,0, canvas.width, canvas.height, '#000000');
	
	food.x = roundToGrid(food.x);
	food.y = roundToGrid(food.y);
	drawBox(food.x, food.y, 10, 10, '#ffffff');
	
	for(var i=0; i < snake.length; i++) {
		snake[i].x = roundToGrid(snake[i].x);
		snake[i].y = roundToGrid(snake[i].y);
		drawBox(snake[i].x, snake[i].y, 10, 10, '#ffffff');
	}
}


function restart()  {
	snake = [];
	snake.push( {x:canvas.width/2, y:canvas.height/2} );
	snake.push( {x:-10, y:-10} );
	snake.push( {x:-10, y:-10} );
	
	xDir = 0;
	yDir = -1;
	moveTimer = 0;
	
	food.x = randomRange(0, canvas.width-10);
	food.y = randomRange(0, canvas.height-10);
}


function checkCollision() {
	for(var i=1; i < snake.length; i++) {
		if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
			restart();
			break;
		}
		
		if(food.x == snake[i].x && food.y == snake[i].y){
			food.x = randomRange(0, canvas.width-10);
			food.y = randomRange(0, canvas.height-10);
		}
	}

	if (snake[0].x < 0 || snake[0].y < 0){
		restart();
	}
		
	if (snake[0].x >= canvas.width || snake[0].y >= canvas.height){
		restart();
	}

	if(snake[0].x == food.x && snake[0].y == food.y) {
		snake.push( {x:-10, y:-10} );
		
		food.x = randomRange(0, canvas.width-10);
		food.y = randomRange(0, canvas.height-10);
	}
}


window.addEventListener('keydown', function (evt) {
	
	if(evt.key == 'ArrowUp' && yDir != 1) {
		yDir = -1;
		xDir = 0;
	}
	if(evt.key == 'ArrowDown' && yDir != -1){
		yDir = 1;
		xDir = 0;
	}
	if(evt.key == 'ArrowRight' && xDir != -1){
		xDir = 1;
		yDir= 0;
	}
	if(evt.key == 'ArrowLeft' && xDir != 1){
		xDir = -1;
		yDir= 0;
	}
}, false);


window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	restart();
}, false);