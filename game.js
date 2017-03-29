var reqAnimFrame = window.requestAnimationFrame ||
	window.mozRequestAnimationFrame 	||
	window.webkitRequestAnimationFrame 	||
	window.oRequestAnimationFrame 		||
	window.msRequestAnimationFrame 		||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
window.requestAnimationFrame = reqAnimFrame;

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
        this.posX = -100;
        this.posY = posY;
        this.frames = ['./img/enemy/enemy_frame1.png'];
        this.curFrame = 0;
        this.curFrameInterval = 0;
        this.speed = 1;
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


var field = document.getElementById('gameArea');
var ctx = field.getContext('2d');
var player;
var shoot;
var playerImg = new Image();
var shotImg = new Image();
var background = new Image();
var healthImage = new Image();
const enemyGen = new EnemyGenerator();
const enemyMan = new EnemyManager();

var beginGame = function() {
	player = new Player();
    	shoot = new Shoot();
	playerImg.src = './img/player/player_stop.png';
	shotImg.src = './img/player/weapon_fire.png';
    	background.src = './img/background.jpg';
};

var enemyGeneration = function () {
    if (enemyGen.curNumber === enemyGen.spawnInterval) {
        enemyGen.curNumber = 0;
        const spawnPosY = 282 + Math.random() * 247;
        const enemy = new Enemy(spawnPosY);
        const enemyImg = new Image();
        enemyImg.src = enemy.frames[0];
        
        enemyMan.enemy.push(enemy);
        enemyMan.enemyImg.push(enemyImg);
    }

    enemyGen.curNumber++;
};

var enemyRedraw = function (context) {
    for (let i = 0; i < enemyMan.enemy.length; i++) {
        if (enemyMan.enemy[i].posX < 1280) {
            context.drawImage(enemyMan.enemyImg[i],
                                enemyMan.enemy[i].posX,
                                enemyMan.enemy[i].posY);

            if (enemyMan.enemyImg)
            enemyMan.enemy[i].posX += enemyMan.enemy[i].speed;
            enemyFrameChange(enemyMan.enemy[i], enemyMan.enemyImg[i]);
        } else {
            enemyMan.enemy.shift();
            enemyMan.enemyImg.shift();
            i -= 1;
        }
    }
};

const enemyFrameChange = function (enemy, enemyImg) {
    if (enemy.curFrameInterval === 3) {
        if (enemy.curFrame === enemy.frames.length - 1) enemy.curFrame = 0;
        else enemy.curFrame += 1;
        
        enemy.curFrameInterval = 0;
        enemyImg.src = enemy.frames[enemy.curFrame];
    }
    enemy.curFrameInterval += 1;
}

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

requestAnimationFrame(function redraw() {
	shoot.interval++;
	playerActions();
	playerRedraw(ctx);
    enemyGeneration();
	enemyRedraw(ctx);
	requestAnimationFrame(redraw);
});
