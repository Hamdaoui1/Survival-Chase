// Mise à jour du fichier enemy.js avec gestion des collisions entre ennemis et obstacles
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
        let bestSteer = this.seek(target); // Force de poursuite vers la cible

        let closestObstacle = null;
        let minDistance = Infinity;

        // Distance d’anticipation de base
        let anticipationDistance1 = this.r * 3;
        let anticipationDistance2 = this.r * 1.5;

        for (let obstacle of obstacles) {
            let ahead = p5.Vector.add(this.pos, p5.Vector.mult(this.vel.copy().normalize(), anticipationDistance1));
            let ahead2 = p5.Vector.add(this.pos, p5.Vector.mult(this.vel.copy().normalize(), anticipationDistance2));

            if (obstacle.type === "circle") {
                // Détection pour les cercles
                let distToAhead = p5.Vector.dist(obstacle.pos, ahead);
                let distToAhead2 = p5.Vector.dist(obstacle.pos, ahead2);

                if (distToAhead < obstacle.size + this.r || distToAhead2 < obstacle.size + this.r) {
                    let distToObstacle = p5.Vector.dist(this.pos, obstacle.pos);
                    if (distToObstacle < minDistance) {
                        minDistance = distToObstacle;
                        closestObstacle = obstacle;
                    }
                }
            } else if (obstacle.type === "rectangle") {
                // Marge de sécurité spécifique pour les rectangles
                let halfWidth = obstacle.size + this.r;
                let halfHeight = (obstacle.size / 2) + this.r;

                if (
                    ahead.x > obstacle.pos.x - halfWidth && ahead.x < obstacle.pos.x + halfWidth &&
                    ahead.y > obstacle.pos.y - halfHeight && ahead.y < obstacle.pos.y + halfHeight
                ) {
                    let distToObstacle = p5.Vector.dist(this.pos, obstacle.pos);
                    if (distToObstacle < minDistance) {
                        minDistance = distToObstacle;
                        closestObstacle = obstacle;
                    }
                }
            } else if (obstacle.type === "triangle") {
                // Marge de sécurité spécifique pour les triangles (boîte englobante élargie)
                let halfSize = (obstacle.size / 2) + this.r;

                if (
                    ahead.x > obstacle.pos.x - halfSize && ahead.x < obstacle.pos.x + halfSize &&
                    ahead.y > obstacle.pos.y - halfSize && ahead.y < obstacle.pos.y + halfSize
                ) {
                    let distToObstacle = p5.Vector.dist(this.pos, obstacle.pos);
                    if (distToObstacle < minDistance) {
                        minDistance = distToObstacle;
                        closestObstacle = obstacle;
                    }
                }
            }
        }

        // Si un obstacle est trouvé, ajouter une force d'évitement
        if (closestObstacle) {
            let avoidanceForce = p5.Vector.sub(this.pos, closestObstacle.pos).normalize();
            avoidanceForce.setMag(this.maxSpeed);
            bestSteer.add(avoidanceForce);
        }

        bestSteer.limit(this.maxForce);
        return bestSteer;
    }





    avoidEnemies(enemies) {
        let steer = createVector(0, 0);
        let count = 0;

        for (let other of enemies) {
            if (other !== this) {
                let distance = p5.Vector.dist(this.pos, other.pos);
                if (distance < this.r * 4) {
                    let flee = p5.Vector.sub(this.pos, other.pos).normalize();
                    flee.div(distance); // Plus la distance est petite, plus la répulsion est forte
                    steer.add(flee);
                    count++;
                }
            }
        }

        if (count > 0) {
            steer.div(count);
            steer.setMag(this.maxForce);
        }

        return steer;
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
