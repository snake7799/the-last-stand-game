import {keyState, Ammo, Player, Enemy} from './movingObject.js';
import {drawStartScreen, drawInterface, increaseScore, drawWeaponIndicator, drawPause, gameOver} from './interface.js';
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
        stand: ['./img/hero_fire/hero_fire_1.png'],
        run: ['./img/hero_run/hero_run_1.png',
            './img/hero_run/hero_run_2.png',
            './img/hero_run/hero_run_3.png',
            './img/hero_run/hero_run_4.png',
            './img/hero_run/hero_run_5.png',
            './img/hero_run/hero_run_6.png'],
        shoot: ['./img/hero_fire/hero_fire_1.png',
            './img/hero_fire/hero_fire_2.png',
            './img/hero_fire/hero_fire_3.png',
            './img/hero_fire/hero_fire_2.png',
            './img/hero_fire/hero_fire_1.png'],
        die: ['./img/hero_die/hero_die_1.png',
            './img/hero_die/hero_die_2.png',
            './img/hero_die/hero_die_3.png',
            './img/hero_die/hero_die_4.png',
            './img/hero_die/hero_die_5.png',
            './img/hero_die/hero_die_6.png',
            './img/hero_die/hero_die_7.png',
            './img/hero_die/hero_die_8.png',]
    },
    'stand',
    {
        run: 6,
        shoot: [17, 14, 12],
        die: 5
    }];
const enemyConfig = [
    -80,
    1,
    {
        run: ['./img/enemy_run/enemy_run_1.png',
            './img/enemy_run/enemy_run_2.png',
            './img/enemy_run/enemy_run_3.png',
            './img/enemy_run/enemy_run_4.png',
            './img/enemy_run/enemy_run_5.png'],
        die: ['./img/enemy_die/enemy_die_1.png',
            './img/enemy_die/enemy_die_2.png',
            './img/enemy_die/enemy_die_3.png',
            './img/enemy_die/enemy_die_4.png',
            './img/enemy_die/enemy_die_5.png',
            './img/enemy_die/enemy_die_6.png',
            './img/enemy_die/enemy_die_7.png',
            './img/enemy_die/enemy_die_8.png',
            './img/enemy_die/enemy_die_9.png',
            './img/enemy_die/enemy_die_10.png'],
        attack: ['./img/enemy_attack/enemy_attack_1.png',
                './img/enemy_attack/enemy_attack_2.png',
                './img/enemy_attack/enemy_attack_3.png',
                './img/enemy_attack/enemy_attack_4.png',
                './img/enemy_attack/enemy_attack_5.png']
    },
    'run',
    {
        run: 4,
        die: 10,
        attack: 5
    },
    1000];
const enemyGeneratorConfig = [Enemy, enemyConfig, 750];
const bulletConfigs = [[1100, './img/bullet/bullet_yellow.png', 1],
                       [1000, './img/bullet/bullet_green.png', 2],
                       [900, './img/bullet/bullet_blue.png', 3]];
const gunConfigs = [[Ammo, bulletConfigs[0], 350, 20, 2000],
                    [Ammo, bulletConfigs[1], 450, 20, 2000],
                    [Ammo, bulletConfigs[2], 550, 20, 2000]];
const creatureManager = new CreatureManager();
const bulletManger = new BulletManager();
const weaponManager = new ObjectManager();
const weaponImages = [];
const player = new Player(...playerConfig, weaponManager);
const enemyGenerator = new EnemyGenerator(creatureManager, ...enemyGeneratorConfig);
let isGameStarted = false;
let isStoped = false;
let time;

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 27 && isStoped == false) {
        isStoped = true;
        return;
    }
    if (e.keyCode == 27 && isStoped != false) {
        isStoped = false;
        requestAnimationFrame(redraw);
        return;
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
                    creatureManager[j].y - bulletManger[i].y > -100)) {
                if (creatureManager[j] instanceof Enemy) {
                    creatureManager[j].health -= bulletManger[i].damage;
                    if (creatureManager[j].health <= 0) {
                        creatureManager[j].isDead = true;
                    }
                    bulletManger.splice(i, 1);
                }
            }
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

document.addEventListener('click', gameStart, false);

function gameStart() {
	if (!isGameStarted) {
		isGameStarted = true;
        time = Date.now();
		document.removeEventListener('click', gameStart, false);
	} else document.location.reload();
};

const redraw = function() {
    ctx.drawImage(background, 0, 0);

	if (!isGameStarted) {
		drawStartScreen(ctx);
		requestAnimationFrame(redraw);
		return;
	}

	drawInterface(ctx, player, weaponImages);
	drawWeaponIndicator(ctx, player);

    const deltaT = (Date.now() - time) / 1000;
    time = Date.now();

    checkPlayerCollisions();
    creatureManager.update(deltaT, ctx);
    bulletManger.update(deltaT, ctx);
    weaponManager.update(deltaT);
    enemyGenerator.run();

	if (player.health < 1) {
		player.isDead = true;
		gameOver(ctx);
		document.addEventListener('click', gameStart, false);
	}
    if (isStoped) {
		drawPause(ctx);
		return;
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
    weaponImages[0].src = './img/interface/default.png';
    weaponImages[1].src = './img/interface/basic.jpg';
    weaponImages[2].src = './img/interface/poison.jpg';
    weaponImages[3].src = './img/interface/frost.jpg';

    creatureManager.push(player);
    weaponManager.push(new Gun(player, bulletManger, ...gunConfigs[0]));
    weaponManager.push(new Gun(player, bulletManger, ...gunConfigs[1]));
    weaponManager.push(new Gun(player, bulletManger, ...gunConfigs[2]));
    player.currentGun = player.guns[0];

    requestAnimationFrame(redraw);
}());
