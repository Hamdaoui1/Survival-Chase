class Snake {
    constructor() {
        this.body = [createVector(floor(width / 20 / 2) * 20, floor(height / 20 / 2) * 20)];
        this.xdir = 0;
        this.ydir = 0;
        this.angle = 0;
        this.innerAngle = 0;
        this.scaleFactor = 1;
        this.growing = true;
    }

    setDirection(x, y) {
        // Vérification pour éviter les directions invalides
        if ((x === 0 && y === 0) || (x !== 0 && y !== 0)) {
            console.warn("Direction invalide : x =", x, ", y =", y);
            return;
        }

        this.xdir = x;
        this.ydir = y;
        console.log("Nouvelle direction : xdir =", this.xdir, ", ydir =", this.ydir);
    }

    update() {
        let head = this.body[this.body.length - 1].copy();
        let nextX = head.x + this.xdir * 20;
        let nextY = head.y + this.ydir * 20;

        // Vérification de collision avec un obstacle
        if (isNextMoveOnObstacle(nextX, nextY)) {
            console.log("Collision détectée pendant le mouvement, arrêt !");
            return; // Arrête la mise à jour si une collision est détectée
        }

        head.x = nextX;
        head.y = nextY;

        // Wrap around edges
        if (head.x < 0) head.x = width - 20;
        if (head.x >= width) head.x = 0;
        if (head.y < 0) head.y = height - 20;
        if (head.y >= height) head.y = 0;

        this.body.shift();
        this.body.push(head);
    }

    animate() {
        if (this.growing) {
            this.scaleFactor += 0.05;
            if (this.scaleFactor > 1.2) this.growing = false;
        } else {
            this.scaleFactor -= 0.05;
            if (this.scaleFactor < 0.8) this.growing = true;
        }

        this.angle += 0.3;
        this.innerAngle += 0.05;
    }

    show() {
        noStroke();

        for (let i = 0; i < this.body.length; i++) {
            let pos = this.body[i];

            fill(34, 139, 34);
            ellipse(pos.x, pos.y, 40, 40);

            noFill();
            stroke(50, 205, 50);
            strokeWeight(3);
            push();
            translate(pos.x, pos.y);
            rotate(this.innerAngle);
            rectMode(CENTER);
            rect(0, 0, 20 * this.scaleFactor, 20 * this.scaleFactor);
            pop();

            push();
            translate(pos.x, pos.y);
            rotate(this.innerAngle + PI / 4);
            stroke(50, 205, 50);
            strokeWeight(3);
            rectMode(CENTER);
            rect(0, 0, 20 * this.scaleFactor, 20 * this.scaleFactor);
            pop();

            push();
            translate(pos.x, pos.y);
            rotate(this.angle);
            stroke(0, 255, 0);
            strokeWeight(4);
            noFill();
            for (let j = 0; j < 4; j++) {
                arc(0, 0, 50, 50, (PI / 2) * j, (PI / 2) * j + PI / 6);
            }
            pop();
        }
    }
}
