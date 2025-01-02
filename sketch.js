let snake;
let enemies = [];
let playing = false;
let paused = false;
let lives = 8; // Nombre initial de vies
let movementInterval; // Pour gérer le mouvement continu du joueur
let level = 1;
let powerUps = [];
let obstacles = [];
let goldObjects = [];
let goldCollected = 0;

function setup() {
    createCanvas(1200, 600);
    frameRate(10);
    snake = new Snake();

    initializeGoldObjects(); // Initialiser les golds dès le départ

    // Création de plusieurs ennemis
    for (let i = 0; i < 5; i++) {
        let x = random(width);
        let y = random(height);
        enemies.push(new Enemy(x, y));
    }
    print("powerUps", powerUps);
    // Connect buttons
    const startButton = document.getElementById("start");
    const pauseButton = document.getElementById("pause");
    const speed1Button = document.getElementById("speed1");
    const speed2Button = document.getElementById("speed2");
    const speed3Button = document.getElementById("speed3");

    startButton.addEventListener("click", () => {
        if (!playing) {
            startGame();
            startButton.innerText = "🔄";
        } else {
            restartGame();
            startButton.innerText = "▶";
        }
    });

    pauseButton.addEventListener("click", () => {
        togglePause();
        pauseButton.innerText = paused ? "⏵" : "⏸";
    });

    speed1Button.addEventListener("click", () => setSpeed(5));
    speed2Button.addEventListener("click", () => setSpeed(10));
    speed3Button.addEventListener("click", () => setSpeed(15));
}

function initializeGoldObjects() {
    goldObjects = [];
    for (let i = 0; i < 5; i++) {
        let x = random(20, width - 20); // S'assurer que les golds ne sortent pas des limites de l'écran
        let y = random(20, height - 20);
        goldObjects.push(new Gold(x, y));
    }
}

function startLevel(level) {
    console.log(`Starting level ${level}`);
    enemies = [];
    powerUps = [];
    obstacles = [];
    goldObjects = [];
    goldCollected = 0;

    for (let i = 0; i < level * 5; i++) {
        let x = random(20, width - 20);
        let y = random(20, height - 20); // Empêcher les golds de dépasser l'écran
        goldObjects.push(new Gold(x, y));
    }
    console.log("Gold objects:", goldObjects);

    for (let i = 0; i < level * 5; i++) {
        let x = random(width);
        let y = random(height);
        enemies.push(new Enemy(x, y));
    }

    for (let i = 0; i < level * 2; i++) {
        let x = random(width);
        let y = random(height);
        powerUps.push(new PowerUp(x, y));
    }

    for (let i = 0; i < level * 2; i++) {
        let x = random(width);
        let y = random(height);
        obstacles.push(new Obstacle(x, y));
    }
}

function nextLevel() {
    level++;
    startLevel(level);
    alert(`Niveau suivant ${level}!`);
}

function setSpeed(speed) {
    frameRate(speed);
}

function checkCollisions() {
    for (let enemy of enemies) {
        if (snake.collidesWith(enemy)) {
            lives--;
            if (lives <= 0) {
                playing = false;
                alert("Vous avez perdu !");
                return;
            }
        }
    }

    for (let powerUp of powerUps) {
        if (snake.collidesWith(powerUp)) {
            powerUp.applyEffect(snake);
            powerUps.splice(powerUps.indexOf(powerUp), 1);
        }
    }

    for (let obstacle of obstacles) {
        if (snake.collidesWith(obstacle)) {
            lives--;
            if (lives <= 0) {
                playing = false;
                alert("Vous avez perdu !");
                return;
            }
        }
    }

    for (let i = goldObjects.length - 1; i >= 0; i--) {
        if (snake.collidesWith(goldObjects[i])) {
            goldObjects.splice(i, 1);
            goldCollected++;
            if (goldCollected >= level * 5) {
                print("next");
                nextLevel();
            }
        }
    }
}

function updateGoldObjects() {
    for (let gold of goldObjects) {
        gold.display();
    }
}

function updateGoldDisplay() {
    document.getElementById("gold").innerText = `Gold: ${goldCollected} / ${level * 5}`;
}

function draw() {
    background(30);

    snake.update();
    snake.show();

    for (let powerUp of powerUps) {
        powerUp.display();
    }

    for (let obstacle of obstacles) {
        obstacle.display();
    }

    for (let gold of goldObjects) {
        gold.display();
    }

    updateLivesDisplay();
    updateGoldDisplay();

    if (!playing) {
        showStartMessage();
        return;
    }

    if (lives <= 0) {
        showGameOverMessage();
        return;
    }

    if (playing) {
        snake.animate();
    }

    if (playing && !paused) {
        updateEnemies();
        updatePowerUps();
        updateObstacles();
        updateGoldObjects();
        checkCollisions();
    }

    updateEnemiesDisplay();
    snake.show();
}

function updateLivesDisplay() {
    document.getElementById("lives").innerText = `Vies : ${lives}`;
}

function showStartMessage() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text("Cliquez sur START pour démarrer le jeu", width / 2, height / 2);
}

function showGameOverMessage() {
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text("Vous avez perdu !", width / 2, height / 2);
    noLoop();
}

function updateEnemies() {
    for (let enemy of enemies) {
        let playerHead = snake.body[snake.body.length - 1];

        if (dist(enemy.pos.x, enemy.pos.y, playerHead.x, playerHead.y) < 20) {
            lives--;
            respawnEnemy(enemy, playerHead);
            continue;
        }

        let target = playerHead;
        let seekForce = enemy.seek(target);
        let avoidForce = enemy.avoid(enemies);
        enemy.applyForce(seekForce);
        enemy.applyForce(avoidForce);
        enemy.update();
    }
}

function respawnEnemy(enemy, playerHead) {
    do {
        enemy.pos.x = random(width);
        enemy.pos.y = random(height);
    } while (dist(enemy.pos.x, enemy.pos.y, playerHead.x, playerHead.y) < 100);
}

function updatePowerUps() {
    for (let powerUp of powerUps) {
        powerUp.display();
    }
}

function updateObstacles() {
    for (let obstacle of obstacles) {
        obstacle.display();
    }
}

function updateEnemiesDisplay() {
    for (let enemy of enemies) {
        if (!paused) {
            enemy.update(snake.body[snake.body.length - 1]);
        }
        enemy.show();
    }
}

function keyPressed() {
    if (!playing || paused) return;

    if (paused) {
        paused = false;
        document.getElementById("pause").innerText = "⏸";
    }

    clearInterval(movementInterval);
    if (keyCode === UP_ARROW) {
        movementInterval = setInterval(() => {
            snake.setDirection(0, -1);
            snake.update();
        }, 100);
    } else if (keyCode === DOWN_ARROW) {
        movementInterval = setInterval(() => {
            snake.setDirection(0, 1);
            snake.update();
        }, 100);
    } else if (keyCode === LEFT_ARROW) {
        movementInterval = setInterval(() => {
            snake.setDirection(-1, 0);
            snake.update();
        }, 100);
    } else if (keyCode === RIGHT_ARROW) {
        movementInterval = setInterval(() => {
            snake.setDirection(1, 0);
            snake.update();
        }, 100);
    }
}

function keyReleased() {
    if (playing) {
        clearInterval(movementInterval); // Arrête le mouvement continu lorsque la touche est relâchée
        snake.setDirection(0, 0);
    }
}

function startGame() {
    playing = true;
}

function restartGame() {
    playing = false;
    paused = false;
    lives = 8;
    level = 1;
    initializeGoldObjects(); // Réinitialiser les golds au redémarrage
    startLevel(level);
    enemies = [];
    snake = new Snake();
    for (let i = 0; i < 5; i++) {
        let x = random(width);
        let y = random(height);
        enemies.push(new Enemy(x, y));
    }
    loop();
}

function togglePause() {
    paused = !paused;
    document.getElementById("pause").innerText = paused ? "⏵" : "⏸";

    if (!paused) {
        clearInterval(movementInterval);
    }
}
