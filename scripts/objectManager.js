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
            if (a.y > b.y) return 1;
            else return -1;
        });
        for (let i = 0; i < this.length; i++) {
            if (this[i].x > -100) {
                this[i].handle(context);
            } else {
                this.splice(i, 1);
                i -= 1;
            }
        }
    }
}

export {ObjectManager, BulletManager, CreatureManager};
