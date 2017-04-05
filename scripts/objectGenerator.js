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
            const enemyChangeFrameInterval = (10 + enemySpeed);
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
            this.intervalCounter = 0;
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

export {EnemyGenerator, Gun};
