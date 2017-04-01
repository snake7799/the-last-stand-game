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

export {EnemyGenerator, Gun};
