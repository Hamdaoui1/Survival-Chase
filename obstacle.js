class Obstacle {
    constructor(x, y, size, couleur, type = "circle") {
        this.pos = createVector(x, y);
        this.size = size; // Taille peut être un rayon ou une longueur selon le type
        this.color = couleur;
        this.type = type; // Type de l'obstacle : 'circle', 'rectangle', 'triangle', etc.
    }

    show() {
        push();
        fill(this.color);
        stroke(0);
        strokeWeight(3);

        if (this.type === "circle") {
            ellipse(this.pos.x, this.pos.y, this.size * 2);
            fill(0);
            ellipse(this.pos.x, this.pos.y, 10);
        } else if (this.type === "rectangle") {
            rectMode(CENTER);
            rect(this.pos.x, this.pos.y, this.size * 2, this.size);
        } else if (this.type === "triangle") {
            let halfSize = this.size / 2;
            triangle(
                this.pos.x, this.pos.y - halfSize,
                this.pos.x - halfSize, this.pos.y + halfSize,
                this.pos.x + halfSize, this.pos.y + halfSize
            );
        } else {
            console.error("Type d'obstacle inconnu :", this.type);
        }

        pop();
    }
}
