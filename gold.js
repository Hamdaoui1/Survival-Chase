class Gold {
    constructor(x, y) {
        this.pos = createVector(x, y);
    }

    display() {
        fill(255, 215, 0);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 20, 20);
    }
}