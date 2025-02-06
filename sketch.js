var scl = 20;
let alpha = 0;
let increasing = true;
let gameStarted = false;
let gameOver = false;
let moveDelay = 50;
let lastMoveTime = 0;
let lastKeyPressTime = 0;
let keyDelay = 50;
let score = 0;
let highScore = 0;

function setup() {
  createCanvas(floor(windowWidth / 100) * 100, floor(windowHeight / 100) * 80);
  highScore = localStorage.getItem("highScore");
  if (highScore > 0) {
    document.getElementById("highScore").textContent = highScore;
  }
  s = new Snake();
  frameRate(24);
  pickLocation();
}

function pickLocation() {
  var cols = (floor(windowWidth / 100) * 100) / scl;
  var rows = (floor(windowHeight / 100) * 80) / scl;
  console.log("cols", cols, "rows", rows);

  let validPosition = false;
  let newFood;

  while (!validPosition) {
    newFood = createVector(floor(random(cols)), floor(random(rows)));
    newFood.mult(scl);

    validPosition = true;
    if (s.x === newFood.x && s.y === newFood.y) {
      validPosition = false;
    }
    for (let i = 0; i < s.tail.length; i++) {
      if (s.tail[i].x === newFood.x && s.tail[i].y === newFood.y) {
        validPosition = false;
        break;
      }
    }
  }

  food = newFood;
}


function draw() {
  background(51);
  if (!gameStarted) {
    textAlign(CENTER);
    fill(255);
    textSize(32);
    text("Presiona Enter para comenzar", width / 2, height / 2);
    textSize(24);
    text("Controles ⬆️⬇️➡️⬅️", width / 2, height / 1.7);
    return;
  }

  if (gameOver) {
    document.getElementById("score").textContent = 0;
    textAlign(CENTER);
    fill(255);
    textSize(32);
    text("GAME OVER\nPresiona Enter para reiniciar", width / 2, height / 2);
    noLoop();
    return;
  }

  if (millis() - lastMoveTime > moveDelay) {
    s.update();
    lastMoveTime = millis();
  }

  s.death();
  s.show();
  if (s.eat(food)) {
    pickLocation();
  }

  alpha = increasing ? alpha + 5 : alpha - 5;
  if (alpha > 255 || alpha < 100) increasing = !increasing;

  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);
}

function keyPressed() {
  let currentTime = millis(); // Obtiene el tiempo actual

  // Si no ha pasado suficiente tiempo, ignorar la pulsación
  if (currentTime - lastKeyPressTime < keyDelay) return;

  // Actualizar el tiempo de la última pulsación
  lastKeyPressTime = currentTime;

  if (!gameStarted && keyCode === ENTER) {
    gameStarted = true;
  } else if (!isLooping()) {
    gameStarted = true;
    gameOver = false;
    s = new Snake();
    loop();
  } else if (keyCode === UP_ARROW && s.yspeed === 0) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW && s.yspeed === 0) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW && s.xspeed === 0) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW && s.xspeed === 0) {
    s.dir(-1, 0);
  }
}

function updateScore() {
  document.getElementById("score").textContent = score;
  document.getElementById("highScore").textContent = highScore;
  localStorage.setItem("highScore", highScore);
}
