import {keyState, Ammo, Player, Enemy} from './movingObject.js';
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
const healthImage = new Image();
const playerConfig = [80,
    400,
    2,
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
        run: 10,
        shoot: [2, 3],
        die: 10
    }];
const enemyConfig = [
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
        run: 10,
        die: 5,
        attack: 2
    }];
const enemyGeneratorConfig = [Enemy, enemyConfig, 150];
const bulletConfigs = [[20, './img/bullet/bullet_yellow.png', 1],
                       [15, './img/bullet/bullet_green.png', 2],
                       [10, './img/bullet/bullet_blue.png', 3]];
const gunConfigs = [[Ammo, bulletConfigs[0], 20], [Ammo, bulletConfigs[1], 25], [Ammo, bulletConfigs[2], 30]];
const creatureManager = new CreatureManager();
const bulletManger = new BulletManager();
const weaponManager = new ObjectManager();
const gun = new Gun(bulletManger, ...gunConfigs[0]);
const player = new Player(...playerConfig, weaponManager);
const enemyGenerator = new EnemyGenerator(creatureManager, ...enemyGeneratorConfig);
let isStoped = false;

const drawInterface = function(context) {
    let healthImagePos = 1405;
    for (let i = 0; i < player.health; i++) {
        context.drawImage(healthImage, healthImagePos, 30);
        healthImagePos -= 50;
    }
};

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
        }
    }
}

const checkPlayerCollisions = function() {
    player.canMoveForeword = true;
    player.canMoveBackword = true;
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
                creatureManager[i].isAttack = true;
                player.canMoveForeword = false;
            }
        }
        if ((creatureManager[i].x - player.x >= -70 &&
                creatureManager[i].x - player.x <= -60) &&
            (creatureManager[i].y - player.y < 30 &&
                creatureManager[i].y - player.y > -30) &&
            (player.isDead == false)) {
            if (creatureManager[i] instanceof Enemy) {
                player.canMoveBackword = false;
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
            if(player.canMoveForeword == false) player.health -= 1;
        }
    }
}

const redraw = function() {
    ctx.drawImage(background, 0, 0);
    drawInterface(ctx);

    checkPlayerCollisions();
    creatureManager.run(ctx);
    bulletManger.run(ctx);
    weaponManager.run();
    enemyGenerator.run();
    if(player.health < 1) {
        player.isDead = true;
    }
    if (isStoped) {
        ctx.fillStyle = 'red';
        ctx.fillText('pause', 740, 320);
        return;
    }
    checkBulletsCollisions();
    requestAnimationFrame(redraw);
};

(function() {
    ctx.font = '60px VT323';
    background.src = './img/background.png';
    healthImage.src = './img/interface/health.png';

    creatureManager.push(player);
    weaponManager.push(gun);
    weaponManager.push(new Gun(bulletManger, ...gunConfigs[1]));
    weaponManager.push(new Gun(bulletManger, ...gunConfigs[2]));
    player.currentGun = player.guns[0];

    requestAnimationFrame(redraw);
}());
