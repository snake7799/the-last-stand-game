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
        this.interval = interval;
    }
    
    run(deltaT) {
        if (Date.now() - this.lastGeneration > this.interval) {
            const spawnPosY = 244 + Math.random() * 341;
            const speedCoefficient = 1 + 0.5 * Math.random();
            const enemySpeed = this.objectConfig[0] * speedCoefficient;
            const enemyFrameSpeed = this.objectConfig[4]['run'] * speedCoefficient;
            this.lastGeneration = Date.now();

            const enemy = new this.objectConstructor(1580, spawnPosY, ...this.objectConfig);
            enemy.speed = enemySpeed;
            enemy.frameInterval = enemyFrameSpeed;
            
            this.objects.push(enemy);
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
        if (this.currentBulletsAmount !== 0) {
            this.currentBulletsAmount = 0;
            this.countdownStart = Date.now();
            this.readyToShoot = false;
        }
    }
}

export {EnemyGenerator, Gun};
