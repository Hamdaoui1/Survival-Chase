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
        this.isFleeing = false;
        this.patrolPoints = [createVector(random(width), random(height)),
            createVector(random(width), random(height))
        ];
        this.currentPatrolIndex = 0;
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);
        desired.setMag(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    avoid(enemies) {
        let steer = createVector(0, 0);
        for (let other of enemies) {
            if (other !== this) {
                let distance = p5.Vector.dist(this.pos, other.pos);
                if (distance < this.r * 4) { // Si trop proche
                    let flee = p5.Vector.sub(this.pos, other.pos);
                    flee.setMag(this.maxForce);
                    steer.add(flee);
                }
            }
        }
        return steer;
    }

    patrol() {
        let target = this.patrolPoints[this.currentPatrolIndex];
        let desired = p5.Vector.sub(target, this.pos);
        if (desired.mag() < 5) {
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        } else {
            this.applyForce(this.seek(target));
        }
    }

    flee(playerPos) {
        let desired = p5.Vector.sub(this.pos, playerPos);
        desired.setMag(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    evade(target) {
        let futurePosition = p5.Vector.add(target, p5.Vector.mult(target.vel, 10)); // Predict future position
        let desired = p5.Vector.sub(futurePosition, this.pos);
        desired.setMag(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    pursue(target) {
        let prediction = p5.Vector.add(target.vel.copy().mult(10), target.pos);
        return this.seek(prediction);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    wander() {
        let wanderRadius = 50;
        let wanderDistance = 100;
        let change = 0.3;

        this.wanderTheta += random(-change, change);

        let circlePos = this.vel.copy();
        circlePos.setMag(wanderDistance);
        circlePos.add(this.pos);

        let h = this.vel.heading();

        let circleOffset = createVector(wanderRadius * cos(this.wanderTheta + h), wanderRadius * sin(this.wanderTheta + h));
        let target = p5.Vector.add(circlePos, circleOffset);

        return this.seek(target);
    }

    update(playerPos) {
        if (playerPos) {
            this.handleFleeing(playerPos);
            this.updatePosition();
            this.checkFleeingStatus(playerPos);
            this.updateScale();
            this.updateAngles();
        }
    }

    handleFleeing(playerPos) {
        if (this.isFleeing) {
            let fleeForce = this.flee(playerPos);
            this.applyForce(fleeForce);
        } else {
            this.patrol();
        }
    }

    updatePosition() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    checkFleeingStatus(playerPos) {
        if (p5.Vector.dist(this.pos, playerPos) < 100) {
            this.isFleeing = true;
        } else {
            this.isFleeing = false;
        }
    }

    updateScale() {
        if (this.growing) {
            this.scaleFactor += 0.05;
            if (this.scaleFactor > 1.2) this.growing = false;
        } else {
            this.scaleFactor -= 0.05;
            if (this.scaleFactor < 0.8) this.growing = true;
        }
    }

    updateAngles() {
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
