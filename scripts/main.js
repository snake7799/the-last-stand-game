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
                                  './img/hero_fire/hero_fire_3.png']
                      },
                      'stand',
                      {
                          run: 10,
                          shoot: 5
                      }];
const enemyConfig = [
    -0.8,
    1,
    {
        run: ['./img/enemy_run/enemy_run_1.png',
              './img/enemy_run/enemy_run_2.png',
              './img/enemy_run/enemy_run_3.png',
              './img/enemy_run/enemy_run_4.png',
              './img/enemy_run/enemy_run_5.png']
    },
    'run',
    {
        run: 10
    }];
const enemyGeneratorConfig = [Enemy, enemyConfig, 150];
const bulletConfig = [20, './img/player/weapon_fire.png', 1];
const gunConfig = [Ammo, bulletConfig, 20];
const creatureManager = new CreatureManager();
const bulletManger = new BulletManager();
const weaponManager = new ObjectManager();
const gun = new Gun(bulletManger.objects, ...gunConfig);
const player = new Player(...playerConfig, gun);
const enemyGenerator = new EnemyGenerator(creatureManager.objects, ...enemyGeneratorConfig);
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
    for (let j = 0; j < creatureManager.objects.length; j++) {
        for (let i = 0; i < gun.objects.length; i++) {
            if ((creatureManager.objects[j].x - gun.objects[i].x < 0 &&
                    creatureManager.objects[j].x - gun.objects[i].x > -120) &&
                (creatureManager.objects[j].y - gun.objects[i].y < 0 &&
                    creatureManager.objects[j].y - gun.objects[i].y > -100)) {
                if (creatureManager.objects[j] instanceof Enemy) {
                    creatureManager.objects[j].health -= gun.objects[i].damage;
                    if (creatureManager.objects[j].health <= 0) {
                        creatureManager.objects.splice(j, 1);
                    }
                    gun.objects.splice(i, 1);
                }
            }
        }
    }
}

const checkPlayerCollisions = function() {
    player.canMoveForeword = true;
    player.canMoveBackword = true;
    player.canMoveDown = true;
    player.canMoveUp = true;
    for (let i = 0; i < creatureManager.objects.length; i++) {
        creatureManager.objects[i].isCollided = false;
        if ((creatureManager.objects[i].x - player.x >= 60 &&
                creatureManager.objects[i].x - player.x <= 70) &&
            (creatureManager.objects[i].y - player.y < 30 &&
                creatureManager.objects[i].y - player.y > -30)) {
            if (creatureManager.objects[i] instanceof Enemy) {
                creatureManager.objects[i].isCollided = true;
                player.canMoveForeword = false;
            }
        }
        if ((creatureManager.objects[i].x - player.x >= -70 &&
                creatureManager.objects[i].x - player.x <= -60) &&
            (creatureManager.objects[i].y - player.y < 30 &&
                creatureManager.objects[i].y - player.y > -30)) {
            if (creatureManager.objects[i] instanceof Enemy) {
                player.canMoveBackword = false;
            }
        }
        if ((creatureManager.objects[i].y - player.y <= 20 &&
                creatureManager.objects[i].y - player.y >= 10) &&
            (creatureManager.objects[i].x - player.x <= 70 &&
                creatureManager.objects[i].x - player.x >= -70)) {
            if (creatureManager.objects[i] instanceof Enemy) {
                player.canMoveDown = false;
            }
        }
        if ((player.y - creatureManager.objects[i].y <= 20 &&
                player.y - creatureManager.objects[i].y >= 10) &&
            (creatureManager.objects[i].x - player.x <= 70 &&
                creatureManager.objects[i].x - player.x >= -70)) {
            if (creatureManager.objects[i] instanceof Enemy) {
                player.canMoveUp = false;
            }
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

    creatureManager.objects.push(player);
    weaponManager.objects.push(gun);

    requestAnimationFrame(redraw);
}());
