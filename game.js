var reqAnimFrame = window.requestAnimationFrame ||
	window.mozRequestAnimationFrame 	||
	window.webkitRequestAnimationFrame 	||
	window.oRequestAnimationFrame 		||
	window.msRequestAnimationFrame 		||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
window.requestAnimationFrame = reqAnimFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var isStoped = false;

class Player {
	constructor() {
		this.posX = 1000;
		this.posY = 380;
		this.frames = ['./img/player/player_frame1.png',
		    './img/player/player_frame2.png',
		    './img/player/player_frame3.png',
		    './img/player/player_frame4.png',
		    './img/player/player_frame5.png',
		    './img/player/player_frame6.png',
		    './img/player/player_frame7.png',
		    './img/player/player_frame8.png',
		    './img/player/player_frame9.png',
		    './img/player/player_frame10.png'
        	];
		this.health = 3;
		this.curFrame = 0;
		this.curFrameInterval = 0;
		this.speed = 1.5;
	}
}

class Shoot {
	constructor() {
		this.shootX = [];
        	this.shootY = [];
		this.speed = 20;
		this.interval = 0;
		this.damage = 1;
        	this.isShot = false;
    	}

	delay() {
		return (this.speed > this.interval) ? false : true;
	}
}

class Enemy {
    	constructor(posY) {
    	}
}


var field = document.getElementById('gameArea');
var ctx = field.getContext('2d');
var player;
var shoot;
var playerImg = new Image();
var shotImg = new Image();
var background = new Image();
var healthImage = new Image();

var beginGame = function() {
	ctx.font = '60px VT323';
	player = new Player();
    	shoot = new Shoot();
	playerImg.src = './img/player/player_stop.png';
	healthImage.src = './img/interface/health.png';
	shotImg.src = './img/player/weapon_fire.png';
    	background.src = './img/background.jpg';
};

var enemyGeneration = function() {

};

var enemyRedraw = function(context) {

};

var playerRedraw = function(context) {
    	context.drawImage(background, 0, 0, 1280, 640);
    	context.drawImage(playerImg, player.posX, player.posY);
    	if (shoot.isShot == true) {
        	for (var i = 0; i < shoot.shootX.length; i++) {
            		if (shoot.shootX[i] > 0) {
                		context.drawImage(shotImg, shoot.shootX[i], shoot.shootY[i]);
                		shoot.shootX[i] -= 10;
            		} else {
				shoot.shootX.shift();
				shoot.shootY.shift();
            		}
        	}
    	}
};

var interfaceRedraw = function(context){
	var healthImagePos = 1200;
	for (var i = 0; i < player.health; i++) {
			context.drawImage(healthImage,healthImagePos,30);
			healthImagePos -= 50;
	}
}

function playerFrameChange() {
	if (player.curFrame == 9 & player.curFrameInterval == 3) {
		player.curFrame = 0;
		player.curFrameInterval = 0;
		playerImg.src = player.frames[player.curFrame];
    	}
    	if (player.curFrameInterval == 3) {
		player.curFrame++;
		player.curFrameInterval = 0;
		playerImg.src = player.frames[player.curFrame];
    	}
    	player.curFrameInterval++;
};

function playerFrameChangeBackwards() {
	if (player.curFrame == 0 & player.curFrameInterval == 3) {
		player.curFrame = 9;
		player.curFrameInterval = 0;
		playerImg.src = player.frames[player.curFrame];
    	}
    	if (player.curFrameInterval == 3) {
		player.curFrame--;
		player.curFrameInterval = 0;
		playerImg.src = player.frames[player.curFrame];
    	}
    	player.curFrameInterval++;
};

var keyState = {};

document.addEventListener('keypress',function(e) {
			if(e.keyCode == 112 & isStoped == false) {
				isStoped = true;
				return;
			}
			if(e.keyCode == 112 & isStoped != false) {
				isStoped = false;
				requestAnimationFrame(redraw);
				return;
			}
}, true );

document.addEventListener('keydown', function(e) {
    	keyState[e.keyCode || e.which] = true;
}, true);

document.addEventListener('keyup', function(e) {
    	keyState[e.keyCode || e.which] = false;
}, true);

document.onkeyup = function playerDefaltActions(e) {
	if ((e.keyCode == 38 && player.posY > 281) 	||
		(e.keyCode == 40 && player.posY < 530) 	||
		(e.keyCode == 37 && player.posX > 0)	||
		(e.keyCode == 39 && player.posX < 1200) ||
		(e.keyCode == 32)) {
		playerImg.src = './img/player/player_stop.png';
	}
};

var playerActions = function () {
	if (keyState[38] && keyState[37] && player.posY > 281 && player.posX > 0) {
		player.posX -= player.speed;
		player.posY -= player.speed;
		playerFrameChange();
	} else if (keyState[40] && keyState[37] && player.posY < 530 && player.posX > 0) {
		player.posX -= player.speed;
		player.posY += player.speed;
		playerFrameChange();
	} else if (keyState[40] && keyState[39] && player.posY < 530 && player.posX < 1200) {
		player.posX += player.speed;
		player.posY += player.speed;
		playerFrameChangeBackwards();
	} else if (keyState[38] && keyState[39] && player.posY > 281 && player.posX < 1200) {
		player.posX += player.speed;
		player.posY -= player.speed;
		playerFrameChangeBackwards();
	} else if (keyState[37] && player.posX > 0) {
		player.posX -= player.speed * 2;
		playerFrameChange();
	} else if (keyState[39] && player.posX < 1200) {
		player.posX += player.speed * 2;
		playerFrameChangeBackwards();
	} else if (keyState[40] && player.posY < 530) {
		player.posY += player.speed * 2;
		playerFrameChange();
	} else if (keyState[38] && player.posY > 281) {
		player.posY -= player.speed * 2;
		playerFrameChange();
	} else if (keyState[32]) {
		if (shoot.delay() != false) {
			shoot.isShot = true;
			shoot.interval = 0;
			playerImg.src = './img/player/player_shoot.png';
			shoot.shootX.push(player.posX);
			shoot.shootY.push(player.posY + 17);
		}
	}
};

var redraw = function(){
	shoot.interval++;
	playerActions();
	playerRedraw(ctx);
	enemyRedraw(ctx);
	interfaceRedraw(ctx);
	if (isStoped == true) {
		ctx.fillStyle = 'red';
		ctx.fillText("pause", 600, 320);
		return;
	}
	requestAnimationFrame(redraw);
}

requestAnimationFrame(redraw);
