import {keyState, Ammo, Player, Enemy} from './movingObject.js';
import {drawStartScreen, drawInterface, increaseScore, getScore, resetScore, drawWeaponIndicator, drawPause, gameOver} from './interface.js';
import {ObjectManager, BulletManager, CreatureManager} from './objectManager.js';
import {EnemyGenerator, Gun} from './objectGenerator.js';

const reqAnimFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
          window.setTimeout(callback, 1000 / 60);
      };
window.requestAnimationFrame = reqAnimFrame;

const ctx = document.getElementById('gameArea').getContext('2d');
const background = new Image();
const playerConfig = [80,
    400,
    125,
    3,
    {
        stand: ['./img/hero/fire/hero_fire_1.png'],
        run: ['./img/hero/run/hero_run_1.png',
            './img/hero/run/hero_run_2.png',
            './img/hero/run/hero_run_3.png',
            './img/hero/run/hero_run_4.png',
            './img/hero/run/hero_run_5.png',
            './img/hero/run/hero_run_6.png'],
        shoot: ['./img/hero/fire/hero_fire_1.png',
            './img/hero/fire/hero_fire_2.png',
            './img/hero/fire/hero_fire_3.png',
            './img/hero/fire/hero_fire_2.png',
            './img/hero/fire/hero_fire_1.png'],
        die: ['./img/hero/die/hero_die_1.png',
            './img/hero/die/hero_die_2.png',
            './img/hero/die/hero_die_3.png',
            './img/hero/die/hero_die_4.png',
            './img/hero/die/hero_die_5.png',
            './img/hero/die/hero_die_6.png',
            './img/hero/die/hero_die_7.png',
            './img/hero/die/hero_die_8.png',]
    },
    'stand',
    {
        run: 6,
        shoot: [17, 14, 12],
        die: 5
    }];
const enemyConfig = [
    -70,
    3,
    {
        run: ['./img/enemy/brown/run/enemy_run_1.png',
            './img/enemy/brown/run/enemy_run_2.png',
            './img/enemy/brown/run/enemy_run_3.png',
            './img/enemy/brown/run/enemy_run_4.png',
            './img/enemy/brown/run/enemy_run_5.png'],
        die: ['./img/enemy/brown/die/enemy_die_1.png',
            './img/enemy/brown/die/enemy_die_2.png',
            './img/enemy/brown/die/enemy_die_3.png',
            './img/enemy/brown/die/enemy_die_4.png',
            './img/enemy/brown/die/enemy_die_5.png',
            './img/enemy/brown/die/enemy_die_6.png',
            './img/enemy/brown/die/enemy_die_7.png',
            './img/enemy/brown/die/enemy_die_8.png',
            './img/enemy/brown/die/enemy_die_9.png',
            './img/enemy/brown/die/enemy_die_10.png'],
        attack: ['./img/enemy/brown/attack/enemy_attack_1.png',
                './img/enemy/brown/attack/enemy_attack_2.png',
                './img/enemy/brown/attack/enemy_attack_3.png',
                './img/enemy/brown/attack/enemy_attack_4.png',
                './img/enemy/brown/attack/enemy_attack_5.png']
    },
    'run',
    {
        run: 4,
        die: 10,
        attack: 5
    },
    2000];
const enemyGeneratorConfig = [Enemy, enemyConfig, 1000];
const bulletConfigs = [[1100, './img/bullet/bullet_yellow.png', 3],
                       [1000, './img/bullet/bullet_green.png', 0.2],
                       [1500, './img/bullet/bullet_blue.png', 0.8]];
const gunConfigs = [[Ammo, bulletConfigs[0], 350, 10, 5500],
                    [Ammo, bulletConfigs[1], 250, 30, 1500],
                    [Ammo, bulletConfigs[2], 150, 40, 3500]];
const weaponImages = [];
let isGameStarted = false;
let isGameOver = false;
let isStoped = false;
let isUltReady = false;
let creatureManager;
let bulletManger;
let weaponManager;
let player;
let enemyGenerator;
let time;
let gameOverTime;

document.addEventListener('keydown', function(e) {
	if ((e.keyCode == 13 && !isGameStarted) || (e.keyCode == 13 && isGameOver)) {
		gameStart();
		return;
	}
	if (e.keyCode == 27 && isStoped == false) {
		isStoped = true;
		return;
	}
	if (e.keyCode == 27 && isStoped != false) {
		isStoped = false;
		time = Date.now();
		requestAnimationFrame(redraw);
		return;
	}
	if (e.keyCode == 81 && isUltReady) {
		killEmAll();
		isUltReady = false;
	}
	keyState[e.keyCode || e.which] = true;
}, true);

document.addEventListener('keyup', function (e) {
	keyState[e.keyCode || e.which] = false;
}, true);

const checkBulletsCollisions = function() {
    for (let j = 0; j < creatureManager.length; j++) {
        for (let i = 0; i < bulletManger.length; i++) {
            if ((creatureManager[j].x - bulletManger[i].x < 0 &&
                    creatureManager[j].x - bulletManger[i].x > -120) &&
                (creatureManager[j].y - bulletManger[i].y < 0 &&
                    creatureManager[j].y - bulletManger[i].y > -100) &&
                    bulletManger[i].x < 1480) {
                if (creatureManager[j] instanceof Enemy && creatureManager[j].isDead == false) {
                    creatureManager[j].health -= bulletManger[i].damage;
                    if (player.currentGun == player.guns[2]) {
                        creatureManager[j].isFrozen = true;
                        creatureManager[j].frozenEffectInterval = Date.now();
                    }
                    if (player.currentGun == player.guns[1]) {
                        creatureManager[j].isPoisoned = true;
                        creatureManager[j].poisonEffectInterval = Date.now();
                    }
                    bulletManger.splice(i, 1);
                }
            }
        }
        if (creatureManager[j].health <= 0) {
            creatureManager[j].isDead = true;
        }
        if(creatureManager[j].isCompletelyDead == true){
            creatureManager.splice(j, 1);
            increaseScore();
        }
    }
};

const checkPlayerCollisions = function() {
    player.canMoveForward = true;
    player.canMoveBackward = true;
    player.canMoveDown = true;
    player.canMoveUp = true;
    for (let i = 0; i < creatureManager.length; i++) {
        creatureManager[i].isCollided = false;
        if ((creatureManager[i].x - player.x >= 60 &&
                creatureManager[i].x - player.x <= 70) &&
            (creatureManager[i].y - player.y < 30 &&
                creatureManager[i].y - player.y > -30) &&
            (player.isDead == false)) {
            if (creatureManager[i] instanceof Enemy) {
                creatureManager[i].isCollided = true;
                player.canMoveForward = false;
            }
        }
        if ((creatureManager[i].x - player.x >= -70 &&
                creatureManager[i].x - player.x <= -60) &&
            (creatureManager[i].y - player.y < 30 &&
                creatureManager[i].y - player.y > -30) &&
            (player.isDead == false)) {
            if (creatureManager[i] instanceof Enemy) {
                player.canMoveBackward = false;
            }
        }
        if ((creatureManager[i].y - player.y <= 20 &&
                creatureManager[i].y - player.y >= 10) &&
            (creatureManager[i].x - player.x <= 70 &&
                creatureManager[i].x - player.x >= -70) &&
            (player.isDead == false)) {
            if (creatureManager[i] instanceof Enemy) {
                player.canMoveDown = false;
            }
        }
        if ((player.y - creatureManager[i].y <= 20 &&
                player.y - creatureManager[i].y >= 10) &&
            (creatureManager[i].x - player.x <= 70 &&
                creatureManager[i].x - player.x >= -70) &&
            (player.isDead == false)) {
            if (creatureManager[i] instanceof Enemy) {
                player.canMoveUp = false;
            }
        }
        if (creatureManager[i].isAttackComplete) {
            creatureManager[i].isAttackComplete = false;
            if (player.canMoveForward == false) player.health -= 1;
        }
    }
};

const checkScore = function() {
    let curScore = getScore();
    if (Math.floor(curScore % 500) == 0 && curScore != 0) {
        isUltReady = true;
    }
};

const killEmAll = function() {
    for (let i = 0; i < creatureManager.length; i++) {
        if (creatureManager[i] instanceof Enemy) {
            creatureManager[i].health = 0;
        }
    }
};

function gameStart() {
	if (!isGameStarted) isGameStarted = true;

    creatureManager = new CreatureManager();
    bulletManger = new BulletManager();
    weaponManager = new ObjectManager();
    player = new Player(...playerConfig, weaponManager);
    enemyGenerator = new EnemyGenerator(creatureManager, ...enemyGeneratorConfig);
    weaponManager.push(new Gun(player, bulletManger, ...gunConfigs[0]));
    weaponManager.push(new Gun(player, bulletManger, ...gunConfigs[1]));
    weaponManager.push(new Gun(player, bulletManger, ...gunConfigs[2]));
    player.currentGun = player.guns[0];
    creatureManager.push(player);
    isGameOver = false;
    isStoped = false;
    resetScore();
    time = Date.now();
};

const redraw = function() {
    ctx.drawImage(background, 0, 0);

	if (!isGameStarted) {
		drawStartScreen(ctx);
		requestAnimationFrame(redraw);
		return;
	}

    const deltaT = (Date.now() - time) / 1000;
    time = Date.now();

    checkPlayerCollisions();
    creatureManager.update(deltaT, ctx);
    bulletManger.update(deltaT, ctx);
    weaponManager.update(deltaT);
    enemyGenerator.run();
	drawInterface(ctx, player, weaponImages, isUltReady);
    checkScore();
	if (player.health < 1 && !isGameOver) {
		player.isDead = true;
        isGameOver = true;
        gameOverTime = Date.now();
	}

    if (isGameOver) {
        if ((time - gameOverTime) > 2000) gameOver(ctx);
    } else {
        drawWeaponIndicator(ctx, player);
        if (isStoped) {
		    drawPause(ctx);
		    return;
	    }
    }

    checkBulletsCollisions();
    requestAnimationFrame(redraw);
};

(function() {
	background.src = './img/background.png';
    ctx.lineWidth = 5;

    weaponImages.push(new Image());
    weaponImages.push(new Image());
    weaponImages.push(new Image());
    weaponImages.push(new Image());
    weaponImages.push(new Image());
    weaponImages[0].src = './img/interface/default.png';
    weaponImages[1].src = './img/interface/basic.jpg';
    weaponImages[2].src = './img/interface/poison.jpg';
    weaponImages[3].src = './img/interface/frost.jpg';
    weaponImages[4].src = './img/interface/ult.jpg';

    requestAnimationFrame(redraw);
}());
