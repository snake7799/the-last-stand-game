/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return keyState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Ammo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Player; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Enemy; });
const keyState = {};

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
        this.intervalCounter = 0;
        this.currentFrame = 0;
        this.isCollided = false;
        this.isDead = false;
        this.isAttack = false;
        this.isAttackComplete = false;
        this.isCompletelyDead = false;
        this.canMoveForeword = true;
        this.canMoveBackword = true;
        this.canMoveUp = true;
        this.canMoveDown = true;
    }

    frameChange(isForward) {
        if (this.frameIntervalCounter === this.frameInterval) {
            if (isForward) {
                if (this.currentFrame >= this.currentFrames.length - 1) {
                    this.currentFrame = 0;
                } else this.currentFrame += 1;
            } else {
                if (this.currentFrame <= 0) {
                    this.currentFrame = this.currentFrames.length - 1;
                } else this.currentFrame -= 1;
            }

            this.image.src = this.currentFrames[this.currentFrame];
            this.frameIntervalCounter = 0;
        } else this.frameIntervalCounter += 1;
    }

    run(deltaX, deltaY) {
        if (this.isDead) {

            this.death();
            return;
        }
        if (this.isCollided) return;
        if (this.isAttack) {
            this.attack();
            return;
        }
        if (this.currentFrames !== this.frameSets.run) {
            this.currentFrames = this.frameSets.run;
            this.frameInterval = this.frameIntervals.run;
            this.frameIntervalCounter = 0;
            this.currentFrame = 0;
            this.image.src = this.currentFrames[this.currentFrame];
        } else this.frameChange(deltaX >= 0);

        this.x += deltaX;
        this.y += deltaY;
    }
}

class Player extends Creature {
    constructor(x, y, speed, health, frameSets, initFrames, frameIntervals, guns) {
        super(x, y, speed, health, frameSets, initFrames, frameIntervals);
        this.guns = guns;
    }

    handle(context) {
        this.draw(context);
        this.controls();
    }

    controls() {
        if (keyState[38] && keyState[37] && this.y > 244 && this.x > -10 && this.canMoveBackword == true && this.canMoveUp == true && this.isDead == false) {
            this.run(-this.speed, -this.speed);
        } else if (keyState[40] && keyState[37] && this.y < 585 && this.x > -10 && this.canMoveBackword == true && this.canMoveDown == true && this.isDead == false) {
            this.run(-this.speed, this.speed);
        } else if (keyState[40] && keyState[39] && this.y < 585 && this.x < 1365 && this.canMoveForeword == true && this.canMoveDown == true && this.isDead == false) {
            this.run(this.speed, this.speed);
        } else if (keyState[38] && keyState[39] && this.y > 244 && this.x < 1365 && this.canMoveForeword == true && this.canMoveUp == true && this.isDead == false) {
            this.run(this.speed, -this.speed);
        } else if (keyState[37] && this.x > -10 && this.canMoveBackword == true && this.isDead == false) {
            this.run(-this.speed * 1.7, 0);
        } else if (keyState[39] && this.x < 1365 && this.canMoveForeword == true && this.isDead == false) {
            this.run(this.speed * 1.7, 0);
        } else if (keyState[40] && this.y < 585 && this.canMoveDown == true && this.isDead == false) {
            this.run(0, this.speed * 1.7);
        } else if (keyState[38] && this.y > 244 && this.canMoveUp == true && this.isDead == false) {
            this.run(0, -this.speed * 1.7);
        } else if (!keyState[32] || this.currentFrames === this.frameSets.run && this.isDead == false) {
            this.stand();
        } else if (this.currentFrames === this.frameSets.shoot && this.currentFrame < this.currentFrames.length - 1) {
            this.frameChange(true);
        }

        if (keyState[32] && this.isDead == false) this.shoot();else if (keyState[49] && this.isDead == false) this.changeWeapon(0);else if (keyState[50] && this.isDead == false) this.changeWeapon(1);else if (keyState[51] && this.isDead == false) this.changeWeapon(2);

        if (keyState[82] && this.currentGun.currentBulletsAmount !== this.currentGun.bulletCapacity) this.currentGun.reload();
    }

    stand() {
        if (this.isDead) {
            this.death();
            return;
        }
        this.currentFrames = this.frameSets.stand;
        this.image.src = this.currentFrames[0];
    }

    shoot() {
        if (this.currentFrames === this.frameSets.stand && this.currentGun.currentBulletsAmount !== 0) {
            this.currentFrames = this.frameSets.shoot;
            this.frameInterval = this.frameIntervals.shoot[this.guns.indexOf(this.currentGun)];
            this.currentFrame = 0;
            this.frameIntervalCounter = 0;
        }
        if (this.currentGun.readyToShoot) {
            this.currentGun.shoot(this.x + 105, this.y + 49);
            if (this.currentFrames === this.frameSets.shoot) {
                this.currentFrame = 0;
                this.frameIntervalCounter = 0;
            }
        }
    }

    changeWeapon(gunIndex) {
        if (this.guns[gunIndex]) this.currentGun = this.guns[gunIndex];
    }

    death() {
        if (this.currentFrame == this.currentFrames.length - 1) {
            return;
        }
        if (this.currentFrames !== this.frameSets.die) {
            this.currentFrames = this.frameSets.die;
            this.frameInterval = this.frameIntervals.die;
            this.frameIntervalCounter = 0;
            this.currentFrame = 0;
            this.image.src = this.currentFrames[this.currentFrame];
        } else {
            this.frameChange(true);
        }
    }
}

class Enemy extends Creature {
    handle(context) {
        this.draw(context);
        this.run(this.speed, 0);
    }

    death() {
        if (this.currentFrames !== this.frameSets.die) {
            this.currentFrames = this.frameSets.die;
            this.frameInterval = this.frameIntervals.die;
            this.frameIntervalCounter = 0;
            this.currentFrame = 0;
            this.image.src = this.currentFrames[this.currentFrame];
        } else {
            this.frameChange(true);
        }
        if (this.currentFrame == this.currentFrames.length - 1) {
            this.isCompletelyDead = true;
        }
    }

    attack() {
        if (this.intervalCounter != 0) {
            this.intervalCounter -= 1;
        } else {
            if (this.currentFrames !== this.frameSets.attack) {
                this.currentFrames = this.frameSets.attack;
                this.frameInterval = this.frameIntervals.attack;
                this.frameIntervalCounter = 0;
                this.currentFrame = 0;
                this.image.src = this.currentFrames[this.currentFrame];
            } else {
                this.frameChange(true);
            }
        }
        if (this.currentFrame == this.currentFrames.length - 1) {
            this.currentFrame = 0;
            this.image.src = this.currentFrames[0];
            this.intervalCounter = 50;
            this.isAttackComplete = true;
            this.isAttack = false;
        }
    }
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EnemyGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Gun; });
class ObjectGenerator {
    constructor(objects, objectConstructor, objectConfig) {
        this.objects = objects;
        this.objectConstructor = objectConstructor;
        this.objectConfig = objectConfig;
        this.intervalCounter = 0;
    }
}

class EnemyGenerator extends ObjectGenerator {
    constructor(objects, objectConstructor, objectConfig, interval) {
        super(objects, objectConstructor, objectConfig);
        this.interval = interval;
    }

    run() {
        if (this.intervalCounter === this.interval) {
            this.intervalCounter = 0;
            const spawnPosY = 244 + Math.random() * 341;
            const enemySpeed = -(Math.random() * (1.6 - 0.8) + 0.8);
            const enemyChangeFrameInterval = 10 + enemySpeed;
            this.objectConfig[3]['run'] = Math.floor(enemyChangeFrameInterval);
            this.objects.push(new this.objectConstructor(1580, spawnPosY, enemySpeed, ...this.objectConfig));
        } else this.intervalCounter += 1;
    }
}

class Gun extends ObjectGenerator {
    constructor(weaponHandler, objects, objectConstructor, objectConfig, shootingInterval, bulletCapacity, reloadingInterval) {
        super(objects, objectConstructor, objectConfig);
        this.weaponHandler = weaponHandler;
        this.shootingInterval = shootingInterval;
        this.bulletCapacity = bulletCapacity;
        this.currentBulletsAmount = bulletCapacity;
        this.reloadingInterval = reloadingInterval;
        this.readyToShoot = true;
    }

    shoot(x, y) {
        this.objects.push(new this.objectConstructor(x, y, ...this.objectConfig));
        this.currentBulletsAmount -= 1;
        this.intervalCounter = 0;
        this.readyToShoot = false;
    }

    handle() {
        if (this.readyToShoot) return;
        if (this.currentBulletsAmount === 0 && this.weaponHandler.currentGun !== this) {
            return;
        }

        if (this.currentBulletsAmount === 0) {
            if (this.intervalCounter === this.reloadingInterval) {
                this.currentBulletsAmount = this.bulletCapacity;
                this.readyToShoot = true;
            } else this.intervalCounter += 1;
        } else if (this.intervalCounter === this.shootingInterval) {
            this.readyToShoot = true;
        } else this.intervalCounter += 1;
    }

    reload() {
        this.currentBulletsAmount = 0;
        this.intervalCounter = 0;
        this.readyToShoot = false;
    }
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__movingObject_js__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ObjectManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BulletManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreatureManager; });


class ObjectManager extends Array {
    run() {
        for (let i = 0; i < this.length; i++) {
            this[i].handle();
        }
    }
}

class BulletManager extends ObjectManager {
    run(context) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].x < 1480) {
                this[i].handle(context);
            } else {
                this.splice(i, 1);
                i -= 1;
            }
        }
    }
}

class CreatureManager extends ObjectManager {
    run(context) {
        this.sort((a, b) => {
            if (a.y > b.y) return 1;else return -1;
        });
        for (let i = 0; i < this.length; i++) {
            if (this[i].x > -100) {
                this[i].handle(context);
            } else {
                this.forEach((item, i, arr) => {
                    if (item instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["c" /* Player */]) arr[i].health -= 1;
                });
                this.splice(i, 1);
                i -= 1;
            }
        }
    }
}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__movingObject_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__objectManager_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectGenerator_js__ = __webpack_require__(1);




const reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};
window.requestAnimationFrame = reqAnimFrame;

const ctx = document.getElementById('gameArea').getContext('2d');
const background = new Image();
const healthImage = new Image();
const playerConfig = [80, 400, 2, 3, {
    stand: ['./img/hero_fire/hero_fire_1.png'],
    run: ['./img/hero_run/hero_run_1.png', './img/hero_run/hero_run_2.png', './img/hero_run/hero_run_3.png', './img/hero_run/hero_run_4.png', './img/hero_run/hero_run_5.png', './img/hero_run/hero_run_6.png'],
    shoot: ['./img/hero_fire/hero_fire_1.png', './img/hero_fire/hero_fire_2.png', './img/hero_fire/hero_fire_3.png', './img/hero_fire/hero_fire_2.png', './img/hero_fire/hero_fire_1.png'],
    die: ['./img/hero_die/hero_die_1.png', './img/hero_die/hero_die_2.png', './img/hero_die/hero_die_3.png', './img/hero_die/hero_die_4.png', './img/hero_die/hero_die_5.png', './img/hero_die/hero_die_6.png', './img/hero_die/hero_die_7.png', './img/hero_die/hero_die_8.png']
}, 'stand', {
    run: 10,
    shoot: [2, 3, 4],
    die: 10
}];
const enemyConfig = [1, {
    run: ['./img/enemy_run/enemy_run_1.png', './img/enemy_run/enemy_run_2.png', './img/enemy_run/enemy_run_3.png', './img/enemy_run/enemy_run_4.png', './img/enemy_run/enemy_run_5.png'],
    die: ['./img/enemy_die/enemy_die_1.png', './img/enemy_die/enemy_die_2.png', './img/enemy_die/enemy_die_3.png', './img/enemy_die/enemy_die_4.png', './img/enemy_die/enemy_die_5.png', './img/enemy_die/enemy_die_6.png', './img/enemy_die/enemy_die_7.png', './img/enemy_die/enemy_die_8.png', './img/enemy_die/enemy_die_9.png', './img/enemy_die/enemy_die_10.png'],
    attack: ['./img/enemy_attack/enemy_attack_1.png', './img/enemy_attack/enemy_attack_2.png', './img/enemy_attack/enemy_attack_3.png', './img/enemy_attack/enemy_attack_4.png', './img/enemy_attack/enemy_attack_5.png']
}, 'run', {
    run: 10,
    die: 5,
    attack: 2
}];
const enemyGeneratorConfig = [__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */], enemyConfig, 150];
const bulletConfigs = [[20, './img/bullet/bullet_yellow.png', 1], [15, './img/bullet/bullet_green.png', 2], [10, './img/bullet/bullet_blue.png', 3]];
const gunConfigs = [[__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["b" /* Ammo */], bulletConfigs[0], 20, 20, 150], [__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["b" /* Ammo */], bulletConfigs[1], 25, 20, 150], [__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["b" /* Ammo */], bulletConfigs[2], 30, 20, 150]];
const creatureManager = new __WEBPACK_IMPORTED_MODULE_1__objectManager_js__["a" /* CreatureManager */]();
const bulletManger = new __WEBPACK_IMPORTED_MODULE_1__objectManager_js__["b" /* BulletManager */]();
const weaponManager = new __WEBPACK_IMPORTED_MODULE_1__objectManager_js__["c" /* ObjectManager */]();
const player = new __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["c" /* Player */](...playerConfig, weaponManager);
const enemyGenerator = new __WEBPACK_IMPORTED_MODULE_2__objectGenerator_js__["a" /* EnemyGenerator */](creatureManager, ...enemyGeneratorConfig);
let isStoped = false;
let score = 0;

const drawInterface = function (context) {
    let healthImagePos = 1415;
    for (let i = 0; i < player.health; i++) {
        context.drawImage(healthImage, healthImagePos, 30);
        healthImagePos -= 50;
    }

    ctx.fillText(score, 735, 67);
};

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 27 && isStoped == false) {
        isStoped = true;
        return;
    }
    if (e.keyCode == 27 && isStoped != false) {
        isStoped = false;
        requestAnimationFrame(redraw);
        return;
    }

    __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["d" /* keyState */][e.keyCode || e.which] = true;
}, true);

document.addEventListener('keyup', function (e) {
    __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["d" /* keyState */][e.keyCode || e.which] = false;
}, true);

const checkBulletsCollisions = function () {
    for (let j = 0; j < creatureManager.length; j++) {
        for (let i = 0; i < bulletManger.length; i++) {
            if (creatureManager[j].x - bulletManger[i].x < 0 && creatureManager[j].x - bulletManger[i].x > -120 && creatureManager[j].y - bulletManger[i].y < 0 && creatureManager[j].y - bulletManger[i].y > -100) {
                if (creatureManager[j] instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */]) {
                    creatureManager[j].health -= bulletManger[i].damage;
                    if (creatureManager[j].health <= 0) {
                        creatureManager[j].isDead = true;
                    }
                    bulletManger.splice(i, 1);
                }
            }
        }
        if (creatureManager[j].isCompletelyDead == true) {
            creatureManager.splice(j, 1);
            score += 10;
        }
    }
};

const checkPlayerCollisions = function () {
    player.canMoveForeword = true;
    player.canMoveBackword = true;
    player.canMoveDown = true;
    player.canMoveUp = true;
    for (let i = 0; i < creatureManager.length; i++) {
        creatureManager[i].isCollided = false;
        if (creatureManager[i].x - player.x >= 60 && creatureManager[i].x - player.x <= 70 && creatureManager[i].y - player.y < 30 && creatureManager[i].y - player.y > -30 && player.isDead == false) {
            if (creatureManager[i] instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */]) {
                creatureManager[i].isAttack = true;
                player.canMoveForeword = false;
            }
        }
        if (creatureManager[i].x - player.x >= -70 && creatureManager[i].x - player.x <= -60 && creatureManager[i].y - player.y < 30 && creatureManager[i].y - player.y > -30 && player.isDead == false) {
            if (creatureManager[i] instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */]) {
                player.canMoveBackword = false;
            }
        }
        if (creatureManager[i].y - player.y <= 20 && creatureManager[i].y - player.y >= 10 && creatureManager[i].x - player.x <= 70 && creatureManager[i].x - player.x >= -70 && player.isDead == false) {
            if (creatureManager[i] instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */]) {
                player.canMoveDown = false;
            }
        }
        if (player.y - creatureManager[i].y <= 20 && player.y - creatureManager[i].y >= 10 && creatureManager[i].x - player.x <= 70 && creatureManager[i].x - player.x >= -70 && player.isDead == false) {
            if (creatureManager[i] instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */]) {
                player.canMoveUp = false;
            }
        }
        if (creatureManager[i].isAttackComplete) {
            creatureManager[i].isAttackComplete = false;
            if (player.canMoveForeword == false) player.health -= 1;
        }
    }
};

const drawWeaponIndicator = function () {
    ctx.beginPath();
    ctx.moveTo(player.x + 35, player.y + 10);
    if (player.currentGun.currentBulletsAmount !== 0) {
        ctx.strokeStyle = '#fff200';
        ctx.lineTo(player.x + 35 + 53 * (player.currentGun.currentBulletsAmount / player.currentGun.bulletCapacity), player.y + 10);
    } else {
        ctx.strokeStyle = '#8b0000';
        ctx.lineTo(player.x + 35 + 53 * (player.currentGun.intervalCounter / player.currentGun.reloadingInterval), player.y + 10);
    }
    ctx.closePath();
    ctx.stroke();
};

const redraw = function () {
    ctx.drawImage(background, 0, 0);
    drawInterface(ctx);

    checkPlayerCollisions();
    creatureManager.run(ctx);
    drawWeaponIndicator();
    bulletManger.run(ctx);
    weaponManager.run();
    enemyGenerator.run();
    if (player.health < 1) {
        player.isDead = true;
    }
    if (isStoped) {
        ctx.fillText('PAUSE', 740, 320);
        return;
    }
    checkBulletsCollisions();
    requestAnimationFrame(redraw);
};

(function () {
    ctx.font = '48px Agency FB';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 5;
    background.src = './img/background.png';
    healthImage.src = './img/interface/health.png';

    creatureManager.push(player);
    weaponManager.push(new __WEBPACK_IMPORTED_MODULE_2__objectGenerator_js__["b" /* Gun */](player, bulletManger, ...gunConfigs[0]));
    weaponManager.push(new __WEBPACK_IMPORTED_MODULE_2__objectGenerator_js__["b" /* Gun */](player, bulletManger, ...gunConfigs[1]));
    weaponManager.push(new __WEBPACK_IMPORTED_MODULE_2__objectGenerator_js__["b" /* Gun */](player, bulletManger, ...gunConfigs[2]));
    player.currentGun = player.guns[0];

    requestAnimationFrame(redraw);
})();

/***/ })
/******/ ]);