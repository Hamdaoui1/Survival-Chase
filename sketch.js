// Mise à jour du fichier sketch.js
let snake;
let enemies = [];
let obstacles = [];
let golds = [];
let playing = false;
let paused = false;
let lives = 8; // Nombre initial de vies
let goldCollected = 0; // Nombre de gold collectés
let currentLevel = 1;      // Niveau actuel
let maxLevel = 5;          // Nombre maximum de niveaux
let baseEnemyCount = 5;    // Nombre de base d'ennemis au niveau 1
let baseObstacleCount = 2; // Nombre de base d'obstacles au niveau 1
let baseSpeed = 20;        // Vitesse de base au niveau 1

let movementInterval; // Pour gérer le mouvement continu du joueur
let backgroundImage;
let collectSound, gameOverSound, gameStartSound, loseLifeSound;
function preload() {
    backgroundImage = loadImage("src/images/background.jpg");
    collectSound = loadSound("src/sound/collect-points.mp3");
    gameOverSound = loadSound("src/sound/game-over.mp3");
    gameStartSound = loadSound("src/sound/game-start.mp3");
    loseLifeSound = loadSound("src/sound/game-character.mp3");
}


function setup() {
    createCanvas(1200, 600);
    frameRate(10);
    snake = new Snake();

    // Création de 3 obstacles aléatoires sans chevauchement
    for (let i = 0; i < 3; i++) {
        let x, y, size, type;
        do {
            x = random(100, width - 100);
            y = random(100, height - 100);
            size = random(70, 120);
            let types = ["circle", "rectangle", "triangle"];
            type = random(types);
        } while (isPositionOnObstacle(x, y, size, type));
        obstacles.push(new Obstacle(x, y, size, "red", type));
    }

    // Création de plusieurs ennemis en évitant les obstacles
    for (let i = 0; i < 5; i++) {
        let x, y;
        do {
            x = random(width);
            y = random(height);
        } while (isPositionOnObstacle(x, y));
        enemies.push(new Enemy(x, y));
    }

    // Création de 5 gold à des positions aléatoires en évitant les obstacles
    for (let i = 0; i < 5; i++) {
        let x, y;
        do {
            x = random(50, width - 50);
            y = random(50, height - 50);
        } while (isPositionOnObstacle(x, y));
        golds.push(new Gold(x, y));
    }

    // Connect buttons
    const startButton = document.getElementById("start");
    const pauseButton = document.getElementById("pause");


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

}

function isPositionOnObstacle(x, y, size = 0, type = "circle") {
    for (let obstacle of obstacles) {
        let margin = 20; // Marge de sécurité pour éviter les chevauchements

        if (obstacle.type === "circle" && type === "circle") {
            let distance = dist(x, y, obstacle.pos.x, obstacle.pos.y);
            if (distance < obstacle.size + size + margin) {
                return true;
            }
        } else if (obstacle.type === "rectangle" || type === "rectangle") {
            let halfWidth1 = obstacle.size / 2;
            let halfHeight1 = obstacle.size / 2;
            let halfWidth2 = size / 2;
            let halfHeight2 = size / 2;
            if (
                x + halfWidth2 + margin > obstacle.pos.x - halfWidth1 &&
                x - halfWidth2 - margin < obstacle.pos.x + halfWidth1 &&
                y + halfHeight2 + margin > obstacle.pos.y - halfHeight1 &&
                y - halfHeight2 - margin < obstacle.pos.y + halfHeight1
            ) {
                return true;
            }
        } else if (obstacle.type === "triangle" || type === "triangle") {
            let halfSize1 = obstacle.size / 2;
            let halfSize2 = size / 2;
            if (
                x > obstacle.pos.x - halfSize1 - margin &&
                x < obstacle.pos.x + halfSize1 + margin &&
                y > obstacle.pos.y - halfSize1 - margin &&
                y < obstacle.pos.y + halfSize1 + margin
            ) {
                return true;
            }
        }
    }
    return false;
}


function draw() {
    image(backgroundImage, 0, 0, width, height); // Affiche l'image en fond, ajustée à la taille du canvas

    // Mise à jour de l'affichage des vies et des golds collectés
    document.getElementById("lives").innerText = `Vies : ${lives} | Golds : ${goldCollected}/5`;

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
        gameOverSound.play();

        noLoop();
        return;
    }

    if (goldCollected === 5) {
        if (currentLevel < maxLevel) {
            currentLevel++;  // Passer au niveau suivant
            goldCollected = 0;
            golds = [];      // Réinitialiser les golds pour le nouveau niveau

            // Créer de nouveaux golds
            for (let i = 0; i < 5; i++) {
                let x, y;
                do {
                    x = random(50, width - 50);
                    y = random(50, height - 50);
                } while (isPositionOnObstacle(x, y));
                golds.push(new Gold(x, y));
            }

            setupLevel(); // Configurer le nouveau niveau
        } else {
            // Si le joueur atteint le niveau maximum, il gagne la partie
            textSize(48);
            textAlign(CENTER, CENTER);
            fill(0, 255, 0);
            text("VICTOIRE ! Vous avez terminé tous les niveaux !", width / 2, height / 2);
            gameOverSound.play();
            noLoop();
            return;
        }
    }


    // Affichage des obstacles
    for (let obstacle of obstacles) {
        obstacle.show();
    }

    // Affichage des golds
    for (let gold of golds) {
        gold.show();
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
                loseLifeSound.play();

                // Réapparaître l'ennemi à une position aléatoire éloignée du joueur
                do {
                    enemy.pos.x = random(width);
                    enemy.pos.y = random(height);
                } while (dist(enemy.pos.x, enemy.pos.y, playerHead.x, playerHead.y) < 100);

                continue; // Passe au prochain ennemi
            }

            // Déplacement des ennemis
            let target = playerHead;
            let pathSteer = enemy.calculateAvoidancePath(target, obstacles);
            let avoidEnemiesSteer = enemy.avoidEnemies(enemies);
            pathSteer.add(avoidEnemiesSteer);
            enemy.applyForce(pathSteer);
            enemy.update();
        }

        // Vérification de la collecte des golds
        for (let i = golds.length - 1; i >= 0; i--) {
            let gold = golds[i];
            let playerHead = snake.body[snake.body.length - 1];

            if (dist(playerHead.x, playerHead.y, gold.pos.x, gold.pos.y) < 20) {
                // Gold collecté
                golds.splice(i, 1);
                goldCollected++;

                // Jouer le son de collecte
                collectSound.play();
            }
        }
    }

    for (let enemy of enemies) {
        enemy.show();
    }

    snake.show();
}

function isNextMoveOnObstacle(nextX, nextY) {
    let nextPos = createVector(nextX, nextY);
    let snakeRadius = 20; // Rayon réel de la snake (diamètre 40 pixels)

    for (let obstacle of obstacles) {
        if (obstacle.type === "circle") {
            // Détection précise pour les cercles
            let distance = p5.Vector.dist(nextPos, obstacle.pos);
            let radiusSum = obstacle.size + snakeRadius;
            if (distance < radiusSum) {
                return true; // Collision détectée avec un cercle
            }
        } else if (obstacle.type === "rectangle") {
            // Détection précise pour les rectangles
            let halfWidth = obstacle.size;
            let halfHeight = obstacle.size / 2;
            let margin = snakeRadius;

            if (
                nextX > obstacle.pos.x - halfWidth - margin &&
                nextX < obstacle.pos.x + halfWidth + margin &&
                nextY > obstacle.pos.y - halfHeight - margin &&
                nextY < obstacle.pos.y + halfHeight + margin
            ) {
                return true; // Collision détectée avec un rectangle
            }
        } else if (obstacle.type === "triangle") {
            // Détection précise pour les triangles avec vérification des points du périmètre de la snake
            let halfSize = obstacle.size / 2;

            // Coordonnées des sommets du triangle
            let a = createVector(obstacle.pos.x, obstacle.pos.y - halfSize);
            let b = createVector(obstacle.pos.x - halfSize, obstacle.pos.y + halfSize);
            let c = createVector(obstacle.pos.x + halfSize, obstacle.pos.y + halfSize);

            // Vérification si le centre de la snake est dans le triangle
            if (isPointInTriangle(nextPos, a, b, c)) {
                return true; // Collision détectée avec un triangle
            }

            // Vérification supplémentaire : points du périmètre de la snake
            let numPoints = 8; // Nombre de points autour du périmètre du cercle
            for (let i = 0; i < numPoints; i++) {
                let angle = (TWO_PI / numPoints) * i;
                let perimeterPoint = createVector(
                    nextPos.x + cos(angle) * snakeRadius,
                    nextPos.y + sin(angle) * snakeRadius
                );

                if (isPointInTriangle(perimeterPoint, a, b, c)) {
                    return true; // Collision détectée avec un point du périmètre de la snake
                }
            }
        }
    }

    return false; // Pas de collision détectée
}


function isPointInTriangle(p, a, b, c) {
    // Vecteurs du triangle
    let v0 = p5.Vector.sub(c, a);
    let v1 = p5.Vector.sub(b, a);
    let v2 = p5.Vector.sub(p, a);

    // Calcul des produits scalaires
    let dot00 = v0.dot(v0);
    let dot01 = v0.dot(v1);
    let dot02 = v0.dot(v2);
    let dot11 = v1.dot(v1);
    let dot12 = v1.dot(v2);

    // Calcul des barycentriques
    let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Le point est dans le triangle si u >= 0, v >= 0 et u + v <= 1
    return (u >= 0) && (v >= 0) && (u + v <= 1);
}





function keyPressed() {
    if (!playing) return;

    if (paused) {
        paused = false;
        document.getElementById("pause").innerText = "⏸";
    }

    clearInterval(movementInterval);

    let head = snake.body[snake.body.length - 1]; // Position actuelle de la tête
    let nextX = head.x;
    let nextY = head.y;

    // Calcul de la prochaine position en fonction de la direction choisie
    if (keyCode === UP_ARROW) {
        nextY -= 20;
    } else if (keyCode === DOWN_ARROW) {
        nextY += 20;
    } else if (keyCode === LEFT_ARROW) {
        nextX -= 20;
    } else if (keyCode === RIGHT_ARROW) {
        nextX += 20;
    }

    // Vérification de collision avec un obstacle
    if (isNextMoveOnObstacle(nextX, nextY)) {
        console.log("Collision détectée, mouvement annulé !");
        return; // Empêche le mouvement si une collision est détectée
    }

    // Si aucune collision n’est détectée, démarrer le mouvement
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
    currentLevel = 1;      // Réinitialise le niveau au début
    setupLevel();          // Configure le premier niveau
    gameStartSound.play(); // Jouer le son de démarrage
}

function restartGame() {
    playing = false;
    paused = false;
    lives = 8;
    goldCollected = 0;
    currentLevel = 1;      // Réinitialise le niveau
    enemies = [];
    golds = [];
    obstacles = [];
    snake = new Snake();

    setupLevel();          // Configure le premier niveau
    gameStartSound.play(); // Jouer le son de relance du jeu
    loop();
}
function setupLevel() {
    enemies = [];
    obstacles = [];
    golds = [];

    // Calculer le nombre d'ennemis et d'obstacles selon le niveau
    let enemyCount = baseEnemyCount + currentLevel - 1;
    let obstacleCount = baseObstacleCount + currentLevel - 1;

    // Création des obstacles
    for (let i = 0; i < obstacleCount; i++) {
        let x, y, size, type;
        do {
            x = random(100, width - 100);
            y = random(100, height - 100);
            size = random(70, 120);
            let types = ["circle", "rectangle", "triangle"];
            type = random(types);
        } while (isPositionOnObstacle(x, y, size, type));
        obstacles.push(new Obstacle(x, y, size, "red", type));
    }

    // Création des ennemis
    for (let i = 0; i < enemyCount; i++) {
        let x, y;
        do {
            x = random(width);
            y = random(height);
        } while (isPositionOnObstacle(x, y));
        enemies.push(new Enemy(x, y));
    }

    // Création des golds
    for (let i = 0; i < 5; i++) {
        let x, y;
        do {
            x = random(50, width - 50);
            y = random(50, height - 50);
        } while (isPositionOnObstacle(x, y));
        golds.push(new Gold(x, y));
    }

    // Définir la vitesse du jeu selon le niveau
    let speed = baseSpeed + (currentLevel - 1) * 5;
    setSpeed(speed);

    console.log(`Niveau ${currentLevel} : ${enemyCount} ennemis, ${obstacleCount} obstacles, vitesse ${speed}`);
}

function togglePause() {
    paused = !paused;
}

function setSpeed(speed) {
    frameRate(speed);
}
