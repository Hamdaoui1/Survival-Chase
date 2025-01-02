class PowerUp {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.type = random(['life', 'speed', 'shield']); // Trois types possibles de power-ups
    }

    display() {
        fill(this.type === 'life' ? 0 : this.type === 'speed' ? 255 : 0,
            this.type === 'life' ? 255 : this.type === 'speed' ? 255 : 0,
            this.type === 'shield' ? 255 : 0);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 20, 20);
    }

    applyEffect(snake) {
        if (this.type === "life") {
            lives++;
        } else if (this.type === "speed") {
            setSpeed(15);
            setTimeout(() => setSpeed(10), 5000);
        } else if (this.type === "shield") {
            snake.shielded = true;
            setTimeout(() => snake.shielded = false, 5000);
        }
    }
}
