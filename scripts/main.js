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

const redraw = function() {
    ctx.drawImage(background, 0, 0);
    drawInterface(ctx);

    creatureManager.run(ctx);
    bulletManger.run(ctx);
    weaponManager.run();
    enemyGenerator.run();

    if (isStoped) {
        ctx.fillStyle = 'red';
        ctx.fillText('pause', 740, 320);
        return;
    }

    requestAnimationFrame(redraw);
};

(function() {
    ctx.font = '60px VT323';
    background.src = './img/background.png';
    healthImage.src = './img/interface/health.png';

    creatureManager.objects.push(player);
    weaponManager.objects.push(gun);

    requestAnimationFrame(redraw);
})();
