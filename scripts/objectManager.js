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

export {ObjectManager, BulletManager, CreatureManager};
