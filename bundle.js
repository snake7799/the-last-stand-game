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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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

    update(deltaT, context) {
        this.draw(context);
        this.x += this.speed * deltaT;
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
        this.currentFrame = 0;
        this.isDead = false;
        this.isFrozen = false;
        this.frozenEffectInterval = 0;
        this.curFrozenEffectInterval = 0;
        this.isPoisoned = false;
        this.poisonEffectInterval = 0;
        this.curPoisonEffectInterval = 0;
    }

    frameChange(isForward, deltaT) {
        let nextFrame;

        if (isForward) {
            nextFrame = this.currentFrame + this.frameInterval * deltaT;

            if (nextFrame >= this.currentFrames.length) {
                nextFrame = nextFrame % this.currentFrames.length;
            }
        } else {
            nextFrame = this.currentFrame - this.frameInterval * deltaT;

            if (nextFrame < 0) {
                nextFrame = nextFrame % this.currentFrames.length + this.currentFrames.length - 0.00001;
            }
        }

        this.currentFrame = nextFrame;
        this.image.src = this.currentFrames[Math.floor(this.currentFrame)];
    }

    changeState(targetState) {
        this.currentFrames = this.frameSets[targetState];
        this.frameInterval = this.frameIntervals[targetState];
        this.image.src = this.currentFrames[0];
        this.currentFrame = 0;
    }

    run(speedX, speedY, deltaT) {
        if (this.currentFrames !== this.frameSets.run) {
            this.changeState('run');
        }
        if (this.isFrozen) {
            deltaT /= 2;
            this.curFrozenEffectInterval = Date.now();
        }
        if (this.isPoisoned) {
            deltaT /= 1.5;
            this.health -= 0.025;
            this.curPoisonEffectInterval = Date.now();
        }
        if (this.curFrozenEffectInterval - this.frozenEffectInterval > 3000) {
            this.isFrozen = false;
        }
        if (this.curPoisonEffectInterval - this.poisonEffectInterval > 1000) {
            this.isPoisoned = false;
        }
        this.frameChange(speedX >= 0, deltaT);

        this.x += speedX * deltaT;
        this.y += speedY * deltaT;
    }
}

class Player extends Creature {
    constructor(x, y, speed, health, frameSets, initFrames, frameIntervals, guns) {
        super(x, y, speed, health, frameSets, initFrames, frameIntervals);
        this.guns = guns;
        this.currentGun = null;
        this.canMoveForward = true;
        this.canMoveBackward = true;
        this.canMoveUp = true;
        this.canMoveDown = true;
    }

    update(deltaT, context) {
        this.draw(context);
        if (this.isDead) this.death(deltaT);else this.controls(deltaT);
    }

    controls(deltaT) {
        if (keyState[38] && keyState[37] && this.y > 244 && this.x > -10 && this.canMoveBackward == true && this.canMoveUp == true) {
            this.run(-this.speed, -this.speed, deltaT);
        } else if (keyState[40] && keyState[37] && this.y < 585 && this.x > -10 && this.canMoveBackward == true && this.canMoveDown == true) {
            this.run(-this.speed, this.speed, deltaT);
        } else if (keyState[40] && keyState[39] && this.y < 585 && this.x < 1365 && this.canMoveForward == true && this.canMoveDown == true) {
            this.run(this.speed, this.speed, deltaT);
        } else if (keyState[38] && keyState[39] && this.y > 244 && this.x < 1365 && this.canMoveForward == true && this.canMoveUp == true) {
            this.run(this.speed, -this.speed, deltaT);
        } else if (keyState[37] && this.x > -10 && this.canMoveBackward == true) {
            this.run(-this.speed * 1.7, 0, deltaT);
        } else if (keyState[39] && this.x < 1365 && this.canMoveForward == true) {
            this.run(this.speed * 1.7, 0, deltaT);
        } else if (keyState[40] && this.y < 585 && this.canMoveDown == true) {
            this.run(0, this.speed * 1.7, deltaT);
        } else if (keyState[38] && this.y > 244 && this.canMoveUp == true) {
            this.run(0, -this.speed * 1.7, deltaT);
        } else if (this.currentFrames === this.frameSets.run) {
            this.stand();
        } else if (this.currentFrames === this.frameSets.shoot && this.currentFrame < this.currentFrames.length - 1) {
            this.frameChange(true, deltaT);
        } else if (this.currentFrames !== this.frameSets.stand) this.stand();

        if (keyState[32]) this.shoot();else if (keyState[49]) this.changeWeapon(0);else if (keyState[50]) this.changeWeapon(1);else if (keyState[51]) this.changeWeapon(2);

        if (keyState[82] && this.currentGun.currentBulletsAmount !== this.currentGun.bulletCapacity) this.currentGun.reload();
    }

    stand() {
        this.currentFrames = this.frameSets.stand;
        this.image.src = this.currentFrames[0];
    }

    shoot() {
        if (this.currentFrames === this.frameSets.stand && this.currentGun.currentBulletsAmount !== 0) {
            this.currentFrames = this.frameSets.shoot;
            this.frameInterval = this.frameIntervals.shoot[this.guns.indexOf(this.currentGun)];
            this.currentFrame = 0;
        }
        if (this.currentGun.readyToShoot) {
            this.currentGun.shoot(this.x + 105, this.y + 49);
            if (this.currentFrames === this.frameSets.shoot) {
                this.currentFrame = 0;
            }
        }
    }

    changeWeapon(gunIndex) {
        if (this.guns[gunIndex]) this.currentGun = this.guns[gunIndex];
    }

    death(deltaT) {
        if (this.currentFrames !== this.frameSets.die) {
            this.changeState('die');
        }

        if (this.currentFrame < this.currentFrames.length - 1) {
            this.frameChange(true, deltaT);
        } else return;
    }
}

class Enemy extends Creature {
    constructor(x, y, speed, health, frameSets, initFrames, frameIntervals, attackCooldown) {
        super(x, y, speed, health, frameSets, initFrames, frameIntervals);
        this.attackCooldown = attackCooldown;
        this.lastAttack = 0;
        this.isCollided = false;
        this.isReadyToAttack = true;
        this.isAttackComplete = false;
        this.isCompletelyDead = false;
    }

    update(deltaT, context) {
        this.draw(context);
        if (this.isDead) this.death(deltaT);else if (this.isCollided) this.attack(deltaT);else this.run(this.speed, 0, deltaT);
    }

    death(deltaT) {
        if (this.currentFrames !== this.frameSets.die) {
            this.changeState('die');
        }

        this.frameChange(true, deltaT);

        if (this.currentFrame >= this.currentFrames.length - 1) {
            this.isCompletelyDead = true;
        }
    }

    attack(deltaT) {
        if (this.isReadyToAttack) {
            if (this.currentFrames !== this.frameSets.attack) {
                this.changeState('attack');
            }

            if (this.currentFrame < this.currentFrames.length - 1) {
                this.frameChange(true, deltaT);
            } else {
                this.lastAttack = Date.now();
                this.image.src = this.currentFrames[0];
                this.currentFrame = 0;
                this.isAttackComplete = true;
                this.isReadyToAttack = false;
            }
        } else if (Date.now() - this.lastAttack > this.attackCooldown) {
            this.isReadyToAttack = true;
        }
    }
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return drawStartScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return drawInterface; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return increaseScore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return drawWeaponIndicator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return drawPause; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return gameOver; });
const healthImage = new Image();
healthImage.src = './img/interface/health.png';
let score = 0;

const drawStartScreen = function (context) {
	const logo = new Image();
	logo.src = './img/interface/planet.png';

	context.fillStyle = 'rgba(0, 0, 0, .8)';
	context.fillRect(0, 0, 1481, 700);

	context.drawImage(logo, 80, 70);

	context.font = '108px Agency FB';
	context.fillStyle = '#ffffff';
	context.fillText('The Last Stand', 920, 250);

	context.font = '48px Agency FB';
	context.fillText('Click to PLAY', 1060, 380);
	context.save();

	context.font = '36px Agency FB';
	context.fillText('Use arrow keys to move', 1020, 470);
	context.fillText('Use the Space key to shoot', 1005, 520);
	context.fillText('Use the R key to force reload', 992, 570);

	context.font = '26px Agency FB';
	context.fillText('JSkills Game Team © 2017', 645, 680);
	context.restore();
};

const drawInterface = function (context, object, ammoImages) {
	let healthImagePos = 1415;
	for (let i = 0; i < object.health; i++) {
		context.drawImage(healthImage, healthImagePos, 30);
		healthImagePos -= 50;
	}

	let weaponImagePos = 40;
	for (let i = 1; i < ammoImages.length; i++) {
		context.drawImage(ammoImages[i], weaponImagePos, 30);
		if (i == object.guns.indexOf(object.currentGun) + 1) {
			context.drawImage(ammoImages[0], weaponImagePos - 3, 27);
		}
		weaponImagePos += 90;
	}

	context.fillText(score, 735, 67);
};

const increaseScore = function () {
	score += 10;
};

const drawWeaponIndicator = function (context, object) {
	context.beginPath();
	context.moveTo(object.x + 35, object.y + 10);
	if (object.currentGun.currentBulletsAmount !== 0) {
		context.strokeStyle = '#fff200';
		context.lineTo(object.x + 35 + 53 * (object.currentGun.currentBulletsAmount / object.currentGun.bulletCapacity), object.y + 10);
	} else {
		context.strokeStyle = '#8b0000';
		context.lineTo(object.x + 35 + 53 * ((Date.now() - object.currentGun.countdownStart) / object.currentGun.reloadingCooldown), object.y + 10);
	}
	context.closePath();
	context.stroke();
};

const drawPause = function (context) {
	context.fillStyle = 'rgba(127, 62, 162, 0.5)';
	context.fillRect(0, 0, 1481, 700);

	context.font = '92px Agency FB';
	context.fillStyle = '#ffffff';
	context.fillText('PAUSE', 655, 370);

	context.font = '26px Agency FB';
	context.fillText('JSkills Game Team © 2017', 645, 680);

	context.font = '48px Agency FB';
};

const gameOver = function (context) {
	context.save();
	context.font = 'bold 140px Agency FB';
	context.fillStyle = '#d03f9e';
	context.fillText('G A M E   O V E R', 370, 370);

	context.font = '36px Agency FB';
	context.fillStyle = '#ffffff';
	context.fillText('Click to TRY AGAIN', 645, 460);

	context.font = '26px Agency FB';
	context.fillText('JSkills Game Team © 2017', 645, 680);
	context.restore();
};



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EnemyGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Gun; });
class ObjectGenerator {
    constructor(objects, objectConstructor, objectConfig) {
        this.objects = objects;
        this.objectConstructor = objectConstructor;
        this.objectConfig = objectConfig;
        this.lastGeneration = 0;
    }
}

class EnemyGenerator extends ObjectGenerator {
    constructor(objects, objectConstructor, objectConfig, interval) {
        super(objects, objectConstructor, objectConfig);
        this.defaultSpeed = objectConfig[0];
        this.defaultFrameSpeed = objectConfig[4]['run'];
        this.interval = interval;
    }

    run(deltaT) {
        if (Date.now() - this.lastGeneration > this.interval) {
            const spawnPosY = 244 + Math.random() * 341;
            const speedCoefficient = 1 + 0.5 * Math.random();
            const enemySpeed = this.defaultSpeed * speedCoefficient;
            const enemyFrameSpeed = this.defaultFrameSpeed * speedCoefficient;
            this.objectConfig[0] = enemySpeed;
            this.objectConfig[4]['run'] = enemyFrameSpeed;
            this.lastGeneration = Date.now();

            this.objects.push(new this.objectConstructor(1580, spawnPosY, ...this.objectConfig));
        }
    }
}

class Gun extends ObjectGenerator {
    constructor(weaponHandler, objects, objectConstructor, objectConfig, shootingCooldown, bulletCapacity, reloadingCooldown) {
        super(objects, objectConstructor, objectConfig);
        this.weaponHandler = weaponHandler;
        this.shootingCooldown = shootingCooldown;
        this.bulletCapacity = bulletCapacity;
        this.currentBulletsAmount = bulletCapacity;
        this.reloadingCooldown = reloadingCooldown;
        this.countdownStart = 0;
        this.readyToShoot = true;
    }

    shoot(x, y) {
        this.objects.push(new this.objectConstructor(x, y, ...this.objectConfig));
        this.currentBulletsAmount -= 1;
        this.countdownStart = Date.now();
        this.readyToShoot = false;
    }

    update() {
        if (this.readyToShoot) return;
        if (this.currentBulletsAmount === 0 && this.weaponHandler.currentGun !== this) {
            this.countdownStart = Date.now();
            return;
        }

        if (this.currentBulletsAmount === 0) {
            if (Date.now() - this.countdownStart > this.reloadingCooldown) {
                this.currentBulletsAmount = this.bulletCapacity;
                this.readyToShoot = true;
            }
        } else if (Date.now() - this.countdownStart > this.shootingCooldown) {
            this.readyToShoot = true;
        }
    }

    reload() {
        this.currentBulletsAmount = 0;
        this.countdownStart = Date.now();
        this.readyToShoot = false;
    }
}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__movingObject_js__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ObjectManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BulletManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreatureManager; });


class ObjectManager extends Array {
    update() {
        for (let i = 0; i < this.length; i++) {
            this[i].update();
        }
    }
}

class BulletManager extends ObjectManager {
    update(deltaT, context) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].x < 1480) {
                this[i].update(deltaT, context);
            } else {
                this.splice(i, 1);
                i -= 1;
            }
        }
    }
}

class CreatureManager extends ObjectManager {
    update(deltaT, context) {
        this.sort((a, b) => {
            if (a.y > b.y) return 1;else return -1;
        });
        for (let i = 0; i < this.length; i++) {
            if (this[i].x > -100) {
                this[i].update(deltaT, context);
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__movingObject_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__interface_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectManager_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__objectGenerator_js__ = __webpack_require__(2);





const reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};
window.requestAnimationFrame = reqAnimFrame;

const ctx = document.getElementById('gameArea').getContext('2d');
const background = new Image();
const playerConfig = [80, 400, 125, 3, {
    stand: ['./img/hero_fire/hero_fire_1.png'],
    run: ['./img/hero_run/hero_run_1.png', './img/hero_run/hero_run_2.png', './img/hero_run/hero_run_3.png', './img/hero_run/hero_run_4.png', './img/hero_run/hero_run_5.png', './img/hero_run/hero_run_6.png'],
    shoot: ['./img/hero_fire/hero_fire_1.png', './img/hero_fire/hero_fire_2.png', './img/hero_fire/hero_fire_3.png', './img/hero_fire/hero_fire_2.png', './img/hero_fire/hero_fire_1.png'],
    die: ['./img/hero_die/hero_die_1.png', './img/hero_die/hero_die_2.png', './img/hero_die/hero_die_3.png', './img/hero_die/hero_die_4.png', './img/hero_die/hero_die_5.png', './img/hero_die/hero_die_6.png', './img/hero_die/hero_die_7.png', './img/hero_die/hero_die_8.png']
}, 'stand', {
    run: 6,
    shoot: [17, 14, 12],
    die: 5
}];
const enemyConfig = [-80, 3, {
    run: ['./img/enemy_run/enemy_run_1.png', './img/enemy_run/enemy_run_2.png', './img/enemy_run/enemy_run_3.png', './img/enemy_run/enemy_run_4.png', './img/enemy_run/enemy_run_5.png'],
    die: ['./img/enemy_die/enemy_die_1.png', './img/enemy_die/enemy_die_2.png', './img/enemy_die/enemy_die_3.png', './img/enemy_die/enemy_die_4.png', './img/enemy_die/enemy_die_5.png', './img/enemy_die/enemy_die_6.png', './img/enemy_die/enemy_die_7.png', './img/enemy_die/enemy_die_8.png', './img/enemy_die/enemy_die_9.png', './img/enemy_die/enemy_die_10.png'],
    attack: ['./img/enemy_attack/enemy_attack_1.png', './img/enemy_attack/enemy_attack_2.png', './img/enemy_attack/enemy_attack_3.png', './img/enemy_attack/enemy_attack_4.png', './img/enemy_attack/enemy_attack_5.png']
}, 'run', {
    run: 4,
    die: 10,
    attack: 5
}, 1000];
const enemyGeneratorConfig = [__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */], enemyConfig, 1000];
const bulletConfigs = [[1100, './img/bullet/bullet_yellow.png', 3], [1000, './img/bullet/bullet_green.png', 0.2], [900, './img/bullet/bullet_blue.png', 1]];
const gunConfigs = [[__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["b" /* Ammo */], bulletConfigs[0], 350, 20, 2000], [__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["b" /* Ammo */], bulletConfigs[1], 450, 20, 2000], [__WEBPACK_IMPORTED_MODULE_0__movingObject_js__["b" /* Ammo */], bulletConfigs[2], 550, 20, 2000]];
const creatureManager = new __WEBPACK_IMPORTED_MODULE_2__objectManager_js__["a" /* CreatureManager */]();
const bulletManger = new __WEBPACK_IMPORTED_MODULE_2__objectManager_js__["b" /* BulletManager */]();
const weaponManager = new __WEBPACK_IMPORTED_MODULE_2__objectManager_js__["c" /* ObjectManager */]();
const weaponImages = [];
const player = new __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["c" /* Player */](...playerConfig, weaponManager);
const enemyGenerator = new __WEBPACK_IMPORTED_MODULE_3__objectGenerator_js__["a" /* EnemyGenerator */](creatureManager, ...enemyGeneratorConfig);
let isGameStarted = false;
let isStoped = false;
let time;

document.addEventListener('keydown', function (e) {
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
        if (creatureManager[j].isCompletelyDead == true) {
            creatureManager.splice(j, 1);
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__interface_js__["a" /* increaseScore */])();
        }
    }
};

const checkPlayerCollisions = function () {
    player.canMoveForward = true;
    player.canMoveBackward = true;
    player.canMoveDown = true;
    player.canMoveUp = true;
    for (let i = 0; i < creatureManager.length; i++) {
        creatureManager[i].isCollided = false;
        if (creatureManager[i].x - player.x >= 60 && creatureManager[i].x - player.x <= 70 && creatureManager[i].y - player.y < 30 && creatureManager[i].y - player.y > -30 && player.isDead == false) {
            if (creatureManager[i] instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */]) {
                creatureManager[i].isCollided = true;
                player.canMoveForward = false;
            }
        }
        if (creatureManager[i].x - player.x >= -70 && creatureManager[i].x - player.x <= -60 && creatureManager[i].y - player.y < 30 && creatureManager[i].y - player.y > -30 && player.isDead == false) {
            if (creatureManager[i] instanceof __WEBPACK_IMPORTED_MODULE_0__movingObject_js__["a" /* Enemy */]) {
                player.canMoveBackward = false;
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

const redraw = function () {
    ctx.drawImage(background, 0, 0);

    if (!isGameStarted) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__interface_js__["b" /* drawStartScreen */])(ctx);
        requestAnimationFrame(redraw);
        return;
    }

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__interface_js__["c" /* drawInterface */])(ctx, player, weaponImages);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__interface_js__["d" /* drawWeaponIndicator */])(ctx, player);

    const deltaT = (Date.now() - time) / 1000;
    time = Date.now();

    checkPlayerCollisions();
    creatureManager.update(deltaT, ctx);
    bulletManger.update(deltaT, ctx);
    weaponManager.update(deltaT);
    enemyGenerator.run();

    if (player.health < 1) {
        player.isDead = true;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__interface_js__["e" /* gameOver */])(ctx);
        document.addEventListener('click', gameStart, false);
    }
    if (isStoped) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__interface_js__["f" /* drawPause */])(ctx);
        return;
    }

    checkBulletsCollisions();
    requestAnimationFrame(redraw);
};

(function () {
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
    weaponManager.push(new __WEBPACK_IMPORTED_MODULE_3__objectGenerator_js__["b" /* Gun */](player, bulletManger, ...gunConfigs[0]));
    weaponManager.push(new __WEBPACK_IMPORTED_MODULE_3__objectGenerator_js__["b" /* Gun */](player, bulletManger, ...gunConfigs[1]));
    weaponManager.push(new __WEBPACK_IMPORTED_MODULE_3__objectGenerator_js__["b" /* Gun */](player, bulletManger, ...gunConfigs[2]));
    player.currentGun = player.guns[0];

    requestAnimationFrame(redraw);
})();

/***/ })
/******/ ]);