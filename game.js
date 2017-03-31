class MovingObject {
    constructor(x, y, speed, image) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.image = new Image();
        this.image.src = image;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }
}

class Ammo extends MovingObject {
    constructor(x, y, speed, image, damage) {
        super(x, y, speed, image);
        this.damage = damage;
    }

    handle(context) {
        this.draw(context);
        this.x += this.speed;
    }
}

class Creature extends MovingObject {
    constructor(x, y, speed, health, frameSets, initFrames, frameIntervals) {
        super(x, y, speed, frameSets[initFrames][0]);
        this.health = health;
        this.frameSets = frameSets;
        this.currentFrames = this.frameSets[initFrames];
        this.frameIntervals = frameIntervals;
        this.frameInterval = this.frameIntervals[initFrames];
        this.frameIntervalCounter = 0;
        this.currentFrame = 0;
    }

    frameChange(isForward) {
        if (this.frameIntervalCounter === this.frameInterval) {
            if (isForward) {
                if (this.currentFrame >= this.currentFrames.length - 1) {
                    this.currentFrame = 0;
                } else this.currentFrame += 1;
            }
            else {
                if (this.currentFrame <= 0) {
                    this.currentFrame = this.currentFrames.length - 1;
                } else this.currentFrame -= 1;
            }

            this.image.src = this.currentFrames[this.currentFrame];
            this.frameIntervalCounter = 0;
        } else this.frameIntervalCounter += 1;
    }

    run(deltaX, deltaY) {
        if (this.currentFrames !== this.frameSets.run) {
            this.currentFrames = this.frameSets.run;
            this.frameInterval = this.frameIntervals.run;
            this.frameIntervalCounter = 0;
            this.currentFrame = 0;
            this.image.src = this.currentFrames[this.currentFrame];
        } else {
            this.frameChange(deltaX >= 0);
        }

        this.x += deltaX;
        this.y += deltaY;
    }
}

class Player extends Creature {
    constructor(x, y, speed, health, frameSets, initFrames, frameIntervals, gun) {
        super(x, y, speed, health, frameSets, initFrames, frameIntervals);
        this.gun = gun;
    }

    handle(context) {
        this.draw(context);
        this.controls();
    }

    controls() {
        if (keyState[38] && keyState[37] && this.y > 282 && this.x > -10) {
            this.run(-this.speed, -this.speed);
        } else if (keyState[40] && keyState[37] && this.y < 585 && this.x > -10) {
            this.run(-this.speed, this.speed);
        } else if (keyState[40] && keyState[39] && this.y < 585 && this.x < 1365) {
            this.run(this.speed, this.speed);
        } else if (keyState[38] && keyState[39] && this.y > 282 && this.x < 1365) {
            this.run(this.speed, -this.speed);
        } else if (keyState[37] && this.x > -10) {
            this.run(-this.speed * 1.7, 0);
        } else if (keyState[39] && this.x < 1365) {
            this.run(this.speed * 1.7, 0);
        } else if (keyState[40] && this.y < 585) {
            this.run(0, this.speed * 1.7);
        } else if (keyState[38] && this.y > 282) {
            this.run(0, -this.speed * 1.7);
        } else if (!keyState[32] || this.currentFrames === this.frameSets.run) {
            this.stand();
        }
        if (keyState[32]) {
            this.shoot();
            this.frameChange(true);
        }
    }

    stand() {
        this.currentFrames = this.frameSets.stand;
        this.image.src = this.currentFrames[0];
    }

    shoot() {
        if (this.currentFrames === this.frameSets.stand) {
            this.currentFrames = this.frameSets.shoot;
            this.frameInterval = this.frameIntervals.shoot;
            this.frameIntervalCounter = 0;
            this.currentFrame = 0;
        }
        if (this.gun.readyToShoot) {
            this.gun.shoot(this.x + 105, this.y + 35);
        }
    }
}

class Enemy extends Creature {
    handle(context) {
        this.draw(context);
        this.run(this.speed, 0);
    }
}

class ObjectManager {
    constructor() {
        this.objects = [];
    }

    run() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].handle();
        }
    }
}

class BulletManager extends ObjectManager {
    run(context) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].x < 1480) {
                this.objects[i].handle(context);
            } else {
                this.objects.splice(i, 1);
                i -= 1;
            }
        }
    }
}

class CreatureManager extends ObjectManager {
    run(context) {
        this.objects.sort((a, b) => {
            if (a.y > b.y) return 1;
            else return -1;
        });
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].x > -100) {
                this.objects[i].handle(context);
            } else {
                this.objects.splice(i, 1);
                i -= 1;
            }
        }
    }
}

class ObjectGenerator {
    constructor(objects, objectConstructor, objectConfig, interval) {
        this.objects = objects;
        this.objectConstructor = objectConstructor;
        this.objectConfig = objectConfig
        this.interval = interval;
        this.intervalCounter = 0;
    }
}

class EnemyGenerator extends ObjectGenerator {
    run() {
        if (this.intervalCounter === this.interval) {
            this.intervalCounter = 0;
            const spawnPosY = 282 + Math.random() * 310;

            this.objects.push(new this.objectConstructor(1580, spawnPosY, ...this.objectConfig));
        } else this.intervalCounter += 1;
    }
}

class Gun extends ObjectGenerator {
    constructor(objects, objectConstructor, objectConfig, interval) {
        super(objects, objectConstructor, objectConfig, interval);
        this.readyToShoot = true;
    }

    shoot(x, y) {
        this.objects.push(new this.objectConstructor(x, y, ...this.objectConfig));
        this.readyToShoot = false;
    }

    handle() {
        if (this.readyToShoot) return;

        if (this.intervalCounter === this.interval) {
            this.intervalCounter = 0;
            this.readyToShoot = true;
        } else this.intervalCounter += 1;
    }
}

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
const keyState = {};
let isStoped = false;

const drawInterface = function (context) {
    var healthImagePos = 1405;
    for (var i = 0; i < player.health; i++) {
        context.drawImage(healthImage, healthImagePos, 30);
        healthImagePos -= 50;
    }
};

document.addEventListener('keypress', function (e) {
    if (e.keyCode == 27 & isStoped == false) {
        isStoped = true;
        return;
    }
    if (e.keyCode == 27 & isStoped != false) {
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

const redraw = function redraw() {
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
}

const beginGame = function () {
    ctx.font = '60px VT323';
    background.src = './img/background.png';
    healthImage.src = './img/interface/health.png';

    creatureManager.objects.push(player);
    weaponManager.objects.push(gun);

    requestAnimationFrame(redraw);
}
