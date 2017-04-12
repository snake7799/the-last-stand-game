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

    affect(creature) {
        creature.health -= this.damage;
    }
}

class PoisonedBullet extends Ammo {
    affect(creature) {
        creature.isPoisoned = true;
        creature.poisonEffectInterval = Date.now();

        super.affect(creature);
    }
}

class SlowingBullet extends Ammo {
    affect(creature) {
        creature.isFrozen = true;
        creature.frozenEffectInterval = Date.now();

        super.affect(creature);
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
        this.runSound = new Audio();
    }

    frameChange(isForward, deltaT) {
        let nextFrame;

        if (isForward) {
            nextFrame = this.currentFrame + this.frameInterval * deltaT;

            if (nextFrame >= this.currentFrames.length) {
                nextFrame = nextFrame % this.currentFrames.length;
            }
        } else {
            nextFrame = (this.currentFrame - this.frameInterval * deltaT);

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

        this.frameChange(speedX >= 0, deltaT);

        this.x += speedX * deltaT;
        this.y += speedY * deltaT;
        if (this.runSound.src != '') this.runSound.play();
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
        this.shootSound = [];	
		this.runSound.src = './sounds/footstep.wav';
		this.runSound.volume = .2;
		for (let i = 0; i < 3; i++) {
			this.shootSound.push(new Audio());
			this.shootSound[i].src = `./sounds/weapon_${i+1}.wav`;
			this.shootSound[i].volume = .25;
		}
		this.shootSound[2].volume = 1;
    }

    update(deltaT, context) {
        this.draw(context);
        if (this.isDead) this.death(deltaT);
        else this.controls(deltaT);
    }

    controls(deltaT) {
        if (keyState[38] && keyState[37] && this.y > 244 &&
            this.x > -10 && this.canMoveBackward == true && this.canMoveUp == true) {
            this.run(-this.speed, -this.speed, deltaT);
        } else if (keyState[40] && keyState[37] && this.y < 585 &&
            this.x > -10 && this.canMoveBackward == true && this.canMoveDown == true) {
            this.run(-this.speed, this.speed, deltaT);
        } else if (keyState[40] && keyState[39] && this.y < 585 &&
            this.x < 1365 && this.canMoveForward == true && this.canMoveDown == true) {
            this.run(this.speed, this.speed, deltaT);
        } else if (keyState[38] && keyState[39] && this.y > 244 &&
            this.x < 1365 && this.canMoveForward == true && this.canMoveUp == true) {
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
        } else if (this.currentFrames === this.frameSets.shoot &&
            this.currentFrame < this.currentFrames.length - 1) {
            this.frameChange(true, deltaT);
        } else if (this.currentFrames !== this.frameSets.stand) this.stand();

        if (keyState[32]){
            this.shoot();
        }
        else if (keyState[49]) this.changeWeapon(0);
        else if (keyState[50]) this.changeWeapon(1);
        else if (keyState[51]) this.changeWeapon(2);

        if (keyState[82] && this.currentGun.currentBulletsAmount !== this.currentGun.bulletCapacity) this.currentGun.reload();
    }

    stand() {
        this.currentFrames = this.frameSets.stand;
        this.image.src = this.currentFrames[0];
    }

    shoot() {
        if (this.currentFrames === this.frameSets.stand &&
            this.currentGun.currentBulletsAmount !== 0) {
            this.currentFrames = this.frameSets.shoot;
            this.frameInterval = this.frameIntervals.shoot[this.guns.indexOf(this.currentGun)];
            this.currentFrame = 0;
        }
        if (this.currentGun.readyToShoot) {
            this.shootSound[this.guns.indexOf(this.currentGun)].load();
            this.currentGun.shoot(this.x + 105, this.y + 49);
            if (this.currentFrames === this.frameSets.shoot) {
                this.currentFrame = 0;
            }
            this.shootSound[this.guns.indexOf(this.currentGun)].play();
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
        this.isFrozen = false;
        this.frozenEffectInterval = 0;
        this.curFrozenEffectInterval = 0;
        this.isPoisoned = false;
        this.poisonEffectInterval = 0;
        this.curPoisonEffectInterval = 0;
        this.screamSound = new Audio();
		this.screamSound.src = './sounds/enemy_scream.wav';
		this.screamSound.volume = .6;
    }

    update(deltaT, context) {
        this.draw(context);

        if (this.isDead) this.death(deltaT);
        else if (this.isCollided) this.attack(deltaT);
        else this.run(this.speed, 0, deltaT);

        this.handleEffects(deltaT);
    }

    run(speedX, speedY, deltaT) {
        if (this.isPoisoned) deltaT /= 2;
        if (this.isFrozen) deltaT /= 3;
      
        super.run(speedX, speedY, deltaT);
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

    handleEffects(deltaT) {
        if (this.isPoisoned) {
            if (!this.isFrozen) {
                const tempImg = this.currentFrames[Math.floor(this.currentFrame)].split('/');
                tempImg[3] = 'green';
                this.image.src = tempImg.join('/');
            }

            this.health -= 1.5 * deltaT;
            this.curPoisonEffectInterval = Date.now();

            if (this.curPoisonEffectInterval - this.poisonEffectInterval > 1000) {
                this.isPoisoned = false;
            }
        }
        if (this.isFrozen) {
            const tempImg = this.currentFrames[Math.floor(this.currentFrame)].split('/');
            tempImg[3] = 'blue';
            this.image.src = tempImg.join('/');

            this.curFrozenEffectInterval = Date.now();

            if (this.curFrozenEffectInterval - this.frozenEffectInterval > 3000) {
                this.isFrozen = false;
            }
        }
    }
}


export { keyState, Ammo, PoisonedBullet, SlowingBullet, Player, Enemy };
