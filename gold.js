class Gold {
    constructor(x, y) {
        this.pos = createVector(x, y);
    }

    show() {
        push();
        fill(255, 215, 0); // Couleur or
        noStroke();
        ellipse(this.pos.x, this.pos.y, 20);
        pop();
    }
}