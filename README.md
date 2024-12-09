# Survival Chase

## Description
Survival Chase is an exciting game developed in JavaScript with **p5.js**, where the main objective is to survive by dodging enemies relentlessly chasing the player. The player starts with a limited number of lives, and each collision with an enemy reduces these lives. Once all lives are depleted, the game stops and displays a game over message.

This **1.0 version** is the first iteration of the project, with plans to implement more reactive behaviors in the future to enhance gameplay.

---

## Current Features
- **Player Movement**:
  - The player can be controlled using keyboard arrow keys.
  - Continuous movement is possible if a key is held down.
- **Enemy Management**:
  - Enemies chase the player using vector-based logic.
  - When an enemy touches the player, it disappears and reappears at a random position far from the player.
- **Life Management**:
  - The player starts with 8 lives.
  - Lives are displayed outside the canvas.
  - A collision with an enemy reduces the player's lives by 1.
  - If lives reach 0, the game ends with a "GAME OVER" message.
- **Pause and Speed Control**:
  - Buttons to start, pause, and adjust the speed of the game.

---

## Requirements
To run this project, you will need:
- A modern browser supporting JavaScript.
- The **p5.js** library for animations and vector logic.

---

## Installation and Execution
1. Clone the project from GitHub:
   ```bash
   git clone https://github.com/Hamdaoui1/Survival-Chase.git
   ```
2. Navigate to the project folder:
   ```bash
   cd Survival-Chase
   ```
3. Open the `index.html` file in a browser to run the game.

---

## Future Enhancements
- Implement new reactive behaviors to enrich enemy interactions.
- Add levels and new game mechanics.
- Enable player and enemy customization.
- Optimize the collision avoidance algorithm.

---

## Contribution
If you wish to contribute to the project, feel free to fork the repository and submit your pull requests. Suggestions and improvements are always welcome!

---

## License
This project is licensed under the **MIT License**, meaning you are free to use, modify, and distribute this code, provided that you include a copyright notice. See the [LICENSE](./LICENSE) file for more details.

---

## Author
This project was created by **Hamdaoui1** & **Linhkobe**.
