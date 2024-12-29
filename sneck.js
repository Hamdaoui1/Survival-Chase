class Snake {
    constructor() {
        this.body = [createVector(floor(width / 20 / 2) * 20, floor(height / 20 / 2) * 20)];
        this.xdir = 0;
        this.ydir = 0;
        this.angle = 0; // Rotation rapide pour les morceaux de bordure
        this.innerAngle = 0; // Rotation plus lente pour les carrés
        this.scaleFactor = 1; // Échelle pour le carré intérieur
        this.growing = true; // Direction de la croissance des carrés
        this.shielded = false; // Indique si le serpent est protégé
    }

    setDirection(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    collidesWith(other) {
        let head = this.body[this.body.length - 1];
        let d = dist(head.x, head.y, other.pos.x, other.pos.y);
        if (this.shielded) {
            return false; 
        }
        return d < 20;
    }

    update() {
        let head = this.body[this.body.length - 1].copy();
        head.x += this.xdir * 20;
        head.y += this.ydir * 20;

        // Wrap around edges
        if (head.x < 0) head.x = width - 20;
        if (head.x >= width) head.x = 0;
        if (head.y < 0) head.y = height - 20;
        if (head.y >= height) head.y = 0;

        this.body.shift();
        this.body.push(head);
    }

    animate() {
        // Animation de l'échelle des carrés
        if (this.growing) {
            this.scaleFactor += 0.05;
            if (this.scaleFactor > 1.2) this.growing = false; // Limite maximale
        } else {
            this.scaleFactor -= 0.05;
            if (this.scaleFactor < 0.8) this.growing = true; // Limite minimale
        }

        // Augmente les angles pour les animations
        this.angle += 0.3; // Rotation rapide pour les arcs
        this.innerAngle += 0.05; // Rotation plus lente pour les carrés
    }

    show() {
        noStroke();

        for (let pos of this.body) {

            // Cercle principal
            fill(34, 139, 34); // Vert vif pour le cercle
            ellipse(pos.x, pos.y, 40, 40);

            // Carré intérieur 1 (légèrement plus clair)
            noFill();
            stroke(50, 205, 50); // Vert clair pour le premier carré
            strokeWeight(3);
            push();
            translate(pos.x, pos.y);
            rotate(this.innerAngle); // Rotation lente pour le carré
            rectMode(CENTER);
            rect(0, 0, 20 * this.scaleFactor, 20 * this.scaleFactor); // Taille ajustée pour rester bien à l'intérieur du cercle
            pop();

            // Carré intérieur 2 inversé avec un angle de 45°
            push();
            translate(pos.x, pos.y);
            rotate(this.innerAngle + PI / 4); // Rotation lente + angle de 45°
            stroke(50, 205, 50); // Vert clair pour le deuxième carré
            strokeWeight(3);
            rectMode(CENTER);
            rect(0, 0, 20 * this.scaleFactor, 20 * this.scaleFactor); // Taille ajustée
            pop();

            // Bordures coupées (quatre morceaux d'arcs tournants)
            push();
            translate(pos.x, pos.y);
            rotate(this.angle); // Rotation rapide pour les arcs
            stroke(0, 255, 0); // Vert néon pour les morceaux de bordure
            strokeWeight(4);
            noFill();
            for (let j = 0; j < 4; j++) {
                arc(0, 0, 50, 50, (PI / 2) * j, (PI / 2) * j + PI / 6);
            }
            pop();
        }
    }
}
