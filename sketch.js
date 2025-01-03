// Mise à jour du fichier sketch.js
let snake;
let enemies = [];
let obstacles = [];
let playing = false;
let paused = false;
let lives = 8; // Nombre initial de vies
let movementInterval; // Pour gérer le mouvement continu du joueur

function setup() {
    createCanvas(1200, 600);
    frameRate(10);
    snake = new Snake();

    // Création de plusieurs ennemis
    for (let i = 0; i < 5; i++) {
        let x = random(width);
        let y = random(height);
        enemies.push(new Enemy(x, y));
    }

    // Création d'obstacles fixes
  //  obstacles.push(new Obstacle(300, 200, 40, "blue"));
    obstacles.push(new Obstacle(600, 400, 50, "red"));

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

function draw() {
    background(30);

    // Mise à jour de l'affichage des vies
    document.getElementById("lives").innerText = `Vies : ${lives}`;

    if (!playing) {
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(255, 0, 0);
        text("Cliquez sur START pour démarrer le jeu", width / 2, height / 2);
        return;
    }

    if (lives <= 0) {
        textSize(48);
        textAlign(CENTER, CENTER);
        fill(255, 0, 0);
        text("GAME OVER !", width / 2, height / 2);
        noLoop();
        return;
    }

    // Affichage des obstacles
    for (let obstacle of obstacles) {
        obstacle.show();
    }

    if (playing) {
        snake.animate();
    }

    if (playing && !paused) {
        for (let enemy of enemies) {
            let playerHead = snake.body[snake.body.length - 1];

            // Si l'ennemi touche le joueur
            if (dist(enemy.pos.x, enemy.pos.y, playerHead.x, playerHead.y) < 40) {
                // Réduire les vies
                lives--;

                // Réapparaître l'ennemi à une position aléatoire éloignée du joueur
                do {
                    enemy.pos.x = random(width);
                    enemy.pos.y = random(height);
                } while (dist(enemy.pos.x, enemy.pos.y, playerHead.x, playerHead.y) < 100);

                continue; // Passe au prochain ennemi
            }

            // Déplacement des ennemis
            let target = playerHead;
           // print(" \n&& obstacle " ,obstacles);
            let pathSteer = enemy.calculateAvoidancePath(target, obstacles);
            enemy.applyForce(pathSteer);
            enemy.update();
        }
    }

    for (let enemy of enemies) {
        enemy.show();
    }

    snake.show();
}

function keyPressed() {
    if (!playing) return;

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
    clearInterval(movementInterval); // Arrête le mouvement continu lorsque la touche est relâchée
}

function startGame() {
    playing = true;
}

function restartGame() {
    playing = false;
    paused = false;
    lives = 8;
    enemies = [];
    snake = new Snake();
    for (let i = 0; i < 5; i++) {
        let x = random(width);
        let y = random(height);
        enemies.push(new Enemy(x, y));
    }
    obstacles = [];
    loop();
}

function togglePause() {
    paused = !paused;
}

function setSpeed(speed) {
    frameRate(speed);
}
