import {Player} from './movingObject.js';

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
            if (a.y > b.y) return 1;
            else return -1;
        });
        for (let i = 0; i < this.length; i++) {
            if (this[i].x > -100) {
                this[i].update(deltaT, context);
            } else {
                this.forEach((item, i, arr) => {
                    if(item instanceof Player) arr[i].health -= 1;
                })
                this.splice(i, 1);
                i -= 1;
            }
        }
    }
}

export {ObjectManager, BulletManager, CreatureManager};
