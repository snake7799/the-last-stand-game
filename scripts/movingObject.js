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
        this.currentFrame = 0;
        this.isCollided = false;
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
        if (this.isCollided) {
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
        
        if (keyState[32]) this.shoot(); 
        else if (keyState[49]) this.changeWeapon(0);
        else if (keyState[50]) this.changeWeapon(1);
    }

    stand() {
        this.currentFrames = this.frameSets.stand;
        this.image.src = this.currentFrames[0];
    }

    shoot() {
        if (this.currentFrames === this.frameSets.stand) {
            this.currentFrames = this.frameSets.shoot;
            this.frameInterval = this.frameIntervals.shoot[this.guns.indexOf(this.currentGun)];
            this.frameIntervalCounter = 0;
            this.currentFrame = -1;
        }
        if (this.currentGun.readyToShoot) {
            this.currentGun.shoot(this.x + 105, this.y + 35);
            this.currentFrame = -1;
            this.frameIntervalCounter = 0;
        }
        if (!this.currentGun.readyToShoot && this.currentFrame < this.currentFrames.length - 1) {
            this.frameChange(true);
        }
    }

    changeWeapon(gunIndex) {
        if (this.guns[gunIndex]) this.currentGun = this.guns[gunIndex];
    }
}

class Enemy extends Creature {
    handle(context) {
        this.draw(context);
        this.run(this.speed, 0);
    }
}

export {keyState, Ammo, Player, Enemy};
