var reqAnimFrame = window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
window.requestAnimationFrame = reqAnimFrame;

//var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var isStoped = false;

class Player {
	constructor() {
		this.posX = 80;
		this.posY = 400;
		this.frames = ['./img/hero_run/hero_run_1.png',
					   './img/hero_run/hero_run_2.png',
					   './img/hero_run/hero_run_3.png',
					   './img/hero_run/hero_run_4.png',
					   './img/hero_run/hero_run_5.png',
					   './img/hero_run/hero_run_6.png'];
		this.curFrame = 0;
		this.curFrameInterval = 0;
		this.speed = 2;
		this.health = 3;
	}
}

class Shoot {
	constructor() {
		this.shootX = [];
		this.shootY = [];
		this.frames = ['./img/hero_fire/hero_fire_1.png',
					   './img/hero_fire/hero_fire_2.png',
					   './img/hero_fire/hero_fire_3.png'];
		this.curFrame = 0;
		this.curFrameInterval = 0;
		this.speed = 20;
		this.interval = 0;
		this.damage = 1;
		this.isShot = false;
	}
}

class Enemy {
	constructor(posY) {
		this.posX = 1480;
		this.posY = posY;
		this.frames = ['./img/enemy_run/enemy_run_1.png',
					   './img/enemy_run/enemy_run_2.png',
					   './img/enemy_run/enemy_run_3.png',
					   './img/enemy_run/enemy_run_4.png',
					   './img/enemy_run/enemy_run_5.png'];
		this.curFrame = 0;
		this.curFrameInterval = 0;
		this.speed = 0.8;
	}
}

class EnemyGenerator {
	constructor() {
		this.spawnInterval = 150;
		this.curNumber = 0;
	}
}

class EnemyManager {
	constructor() {
		this.enemy = [];
		this.enemyImg = [];
	}
}


let ctx = document.getElementById('gameArea').getContext('2d');
var player;
var shoot;
var playerImg = new Image();
var shotImg = new Image();
var background = new Image();
var healthImage = new Image();
const enemyGen = new EnemyGenerator();
const enemyPerson = new EnemyManager();

var beginGame = function () {
	ctx.font = '60px VT323';
	player = new Player();
	shoot = new Shoot();
	playerImg.src = shoot.frames[0];
	healthImage.src = './img/interface/health.png';
	shotImg.src = './img/player/weapon_fire.png';
	background.src = './img/background.png';
};

function frameChange(obj, intervalValue, isForward) {
	if (obj.curFrameInterval == intervalValue) {
		if (isForward) {
			if (obj.curFrame == obj.frames.length - 1) 
				obj.curFrame = 0;
			else 
				obj.curFrame++;
		}
		else {
			if (obj.curFrame == 0) 
				obj.curFrame = obj.frames.length - 1;
			else 
				obj.curFrame--;
		}
		
		if ((obj == player) || (obj == shoot))
			playerImg.src = obj.frames[obj.curFrame];
		else
			enemyImg.src = obj.frames[obj.curFrame];
		
		obj.curFrameInterval = 0;
	}
	obj.curFrameInterval++;
};

var playerRedraw = function (context) {
	context.drawImage(background, 0, 0);
	context.drawImage(playerImg, player.posX, player.posY);

	if (shoot.isShot == true) {
		for (var i = 0; i < shoot.shootX.length; i++) {
			if (shoot.shootX[i] > 0) {
				context.drawImage(shotImg, shoot.shootX[i], shoot.shootY[i]);
				shoot.shootX[i] += 12;
			} 
			else {
				shoot.shootX.shift();
				shoot.shootY.shift();
			}
		}
	}
};

var enemyGeneration = function() {
	if (enemyGen.curNumber === enemyGen.spawnInterval) {
		enemyGen.curNumber = 0;
		const spawnPosY = 282 + Math.random() * 310;
		const enemy = new Enemy(spawnPosY);
		const enemyImg = new Image();
		enemyImg.src = enemy.frames[0];
		
		enemyPerson.enemy.push(enemy);
		enemyPerson.enemyImg.push(enemyImg);
	}

	enemyGen.curNumber++;
};

var enemyRedraw = function(context) {
	for (let i = 0; i < enemyPerson.enemy.length; i++) {
		if (enemyPerson.enemy[i].posX < 1481) {
			context.drawImage(enemyPerson.enemyImg[i],
				enemyPerson.enemy[i].posX,
				enemyPerson.enemy[i].posY);

			if (enemyPerson.enemyImg)
				enemyPerson.enemy[i].posX -= enemyPerson.enemy[i].speed;
			
			frameChange(enemyPerson.enemy[i], enemyPerson.enemyImg[i], true);
		} 
		else {
			enemyPerson.enemy.shift();
			enemyPerson.enemyImg.shift();
			i--;
		}
	}
};

var interfaceRedraw = function (context) {
	var healthImagePos = 1405;
	for (var i = 0; i < player.health; i++) {
		context.drawImage(healthImage, healthImagePos, 30);
		healthImagePos -= 50;
	}
};

var keyState = {};

document.addEventListener('keypress', function (e) {
	if (e.keyCode == 112 & isStoped == false) {
		isStoped = true;
		return;
	}
	if (e.keyCode == 112 & isStoped != false) {
		isStoped = false;
		requestAnimationFrame(redraw);
		return;
	}
}, true);

document.addEventListener('keydown', function (e) {
	keyState[e.keyCode || e.which] = true;
}, true);

document.addEventListener('keyup', function (e) {
	keyState[e.keyCode || e.which] = false;
}, true);

document.onkeyup = function playerDefaltActions(e) {
	if ((e.keyCode == 38 && player.posY > 260) ||
		(e.keyCode == 40 && player.posY < 580) ||
		(e.keyCode == 37 && player.posX > -10) ||
		(e.keyCode == 39 && player.posX < 1365) ||
		(e.keyCode == 32)) {
		playerImg.src = shoot.frames[0];
	}
};

var playerActions = function () {
	if (keyState[38] && keyState[37] && player.posY > 260 && player.posX > -10) {
		player.posX -= player.speed;
		player.posY -= player.speed;
		frameChange(player, 10, true);
	} else if (keyState[40] && keyState[37] && player.posY < 580 && player.posX > -10) {
		player.posX -= player.speed;
		player.posY += player.speed;
		frameChange(player, 10, true);
	} else if (keyState[40] && keyState[39] && player.posY < 580 && player.posX < 1365) {
		player.posX += player.speed;
		player.posY += player.speed;
		frameChange(player, 10, false);
	} else if (keyState[38] && keyState[39] && player.posY > 260 && player.posX < 1365) {
		player.posX += player.speed;
		player.posY -= player.speed;
		frameChange(player, 10, false);
	} else if (keyState[37] && player.posX > -10) {
		player.posX -= player.speed * 1.7;
		frameChange(player, 10, true);
	} else if (keyState[39] && player.posX < 1365) {
		player.posX += player.speed * 1.7;
		frameChange(player, 10, false);
	} else if (keyState[40] && player.posY < 580) {
		player.posY += player.speed * 1.7;
		frameChange(player, 10, true);
	} else if (keyState[38] && player.posY > 260) {
		player.posY -= player.speed * 1.7;
		frameChange(player, 10, true);
	} else if (keyState[32]) {
		frameChange(shoot, 5, true);
		if (shoot.interval > shoot.speed) {
			shoot.isShot = true;
			shoot.interval = 0;
			shoot.shootX.push(player.posX + 100);
			shoot.shootY.push(player.posY + 35);
		}
	}
};


var redraw = function () {
	shoot.interval++;
	playerActions();
	playerRedraw(ctx);
	enemyGeneration();
	enemyRedraw(ctx);
	interfaceRedraw(ctx);
	if (isStoped == true) {
		ctx.fillStyle = 'red';
		ctx.fillText('pause', 600, 320);
		return;
	}
	requestAnimationFrame(redraw);
}

requestAnimationFrame(redraw);