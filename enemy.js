// Correction de la méthode calculateAvoidancePath pour permettre un passage proche des obstacles sans collision
class Enemy {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 5;
        this.maxForce = 0.2;
        this.r = 16;
        this.scaleFactor = 1;
        this.growing = true;
        this.angle = 0;
        this.innerAngle = 0;
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);
        desired.setMag(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    calculateAvoidancePath(target, obstacles) {
        let bestSteer = this.seek(target);
        let ahead = p5.Vector.add(this.pos, p5.Vector.mult(this.vel.copy().normalize(), this.r * 3));
        let ahead2 = p5.Vector.add(this.pos, p5.Vector.mult(this.vel.copy().normalize(), this.r * 1.5));

        let closestObstacle = null;
        let minDistance = Infinity;

        for (let obstacle of obstacles) {
            let distToAhead = p5.Vector.dist(obstacle.pos, ahead);
            let distToAhead2 = p5.Vector.dist(obstacle.pos, ahead2);

            if (distToAhead < obstacle.r + this.r || distToAhead2 < obstacle.r + this.r) {
                let distToObstacle = p5.Vector.dist(this.pos, obstacle.pos);
                if (distToObstacle < minDistance) {
                    minDistance = distToObstacle;
                    closestObstacle = obstacle;
                }
            }
        }

        if (closestObstacle) {
            let avoidanceForce = p5.Vector.sub(ahead, closestObstacle.pos).normalize();
            avoidanceForce.setMag(this.maxSpeed);
            bestSteer.add(avoidanceForce);
        }

        bestSteer.limit(this.maxForce);
        return bestSteer;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

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

        fill(139, 0, 0);
        ellipse(this.pos.x, this.pos.y, 40, 40);

        noFill();
        stroke(255, 69, 0);
        strokeWeight(3);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.innerAngle);
        rectMode(CENTER);
        rect(0, 0, 20 * this.scaleFactor, 20 * this.scaleFactor);
        pop();

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.innerAngle + PI / 4);
        stroke(178, 34, 34);
        strokeWeight(3);
        rectMode(CENTER);
        rect(0, 0, 20 * this.scaleFactor, 20 * this.scaleFactor);
        pop();

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        stroke(255, 0, 0);
        strokeWeight(4);
        noFill();
        for (let j = 0; j < 4; j++) {
            arc(0, 0, 50, 50, (PI / 2) * j, (PI / 2) * j + PI / 6);
        }
        pop();
    }
}
