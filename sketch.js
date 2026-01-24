var scl = 20;
let alpha = 0;
let increasing = true;
let gameStarted = false;
let gameOver = false;
let gameWon = false;
let moveDelay = 100;
let lastMoveTime = 0;
let lastKeyPressTime = 0;
let keyDelay = 50;
let score = 0;
let highScore = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Sprites
let appleImg;
let headUp, headDown, headLeft, headRight;
let bodyHorizontal, bodyVertical;
let bodyTopLeft, bodyTopRight, bodyBottomLeft, bodyBottomRight;
let tailUp, tailDown, tailLeft, tailRight;

// Sonidos
let foodSound, gameOverSound, moveSound;

function preload() {
  appleImg = loadImage('Graphics/apple.png');
  headUp = loadImage('Graphics/head_up.png');
  headDown = loadImage('Graphics/head_down.png');
  headLeft = loadImage('Graphics/head_left.png');
  headRight = loadImage('Graphics/head_right.png');
  bodyHorizontal = loadImage('Graphics/body_horizontal.png');
  bodyVertical = loadImage('Graphics/body_vertical.png');
  bodyTopLeft = loadImage('Graphics/body_topleft.png');
  bodyTopRight = loadImage('Graphics/body_topright.png');
  bodyBottomLeft = loadImage('Graphics/body_bottomleft.png');
  bodyBottomRight = loadImage('Graphics/body_bottomright.png');
  tailUp = loadImage('Graphics/tail_up.png');
  tailDown = loadImage('Graphics/tail_down.png');
  tailLeft = loadImage('Graphics/tail_left.png');
  tailRight = loadImage('Graphics/tail_right.png');
  
  // Cargar sonidos
  foodSound = loadSound('music/food.mp3');
  gameOverSound = loadSound('music/gameover.mp3');
  moveSound = loadSound('music/move.mp3');
}

function setup() {
  createCanvas(floor(windowWidth / 100) * 100, floor(windowHeight / 100) * 80);
  highScore = localStorage.getItem("highScore");
  if (highScore > 0) {
    document.getElementById("highScore").textContent = highScore;
  }
  s = new Snake();
  frameRate(60);
  pickLocation();

  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchend", handleTouchEnd, false);
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
  // Dibujar patrón de tablero de ajedrez con dos tonos de verde
  let cols = width / scl;
  let rows = height / scl;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if ((i + j) % 2 === 0) {
        fill(170, 215, 81); // Verde claro
      } else {
        fill(162, 209, 73); // Verde más oscuro
      }
      noStroke();
      rect(i * scl, j * scl, scl, scl);
    }
  }
  
  if (!gameStarted) {
    textAlign(CENTER);
    fill(255);
    textSize(25);
    text("Press to start", width / 2, height / 2);
    textSize(20);
    text("Controls ⬆️⬇️➡️⬅️", width / 2, height / 1.7);
    return;
  }

  if (gameOver) {
    document.getElementById("score").textContent = 0;
    textAlign(CENTER);
    fill(255);
    textSize(25);
    text("GAME OVER\nPress to restart", width / 2, height / 2);
    noLoop();
    return;
  }

  if (gameWon) {
    textAlign(CENTER);
    fill(255, 215, 0); // Color dorado
    textSize(30);
    text("🎉 VICTORY! 🎉", width / 2, height / 2 - 20);
    textSize(20);
    fill(255);
    text("You conquered the board!\nPress to restart", width / 2, height / 2 + 30);
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

  // Dibujar manzana con sprite
  image(appleImg, food.x, food.y, scl, scl);
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
    gameWon = false;
    
    // Detener todos los sonidos antes de reiniciar
    if (foodSound && foodSound.isPlaying()) foodSound.stop();
    if (gameOverSound && gameOverSound.isPlaying()) gameOverSound.stop();
    if (moveSound && moveSound.isPlaying()) moveSound.stop();
    
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

function mousePressed() {
  if (!gameStarted) {
    gameStarted = true;
  }
}


function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;

  handleGesture();
}

function handleGesture() {
  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && s.xspeed === 0) {
      s.dir(1, 0); // Deslizar a la derecha
    } else if (dx < 0 && s.xspeed === 0) {
      s.dir(-1, 0); // Deslizar a la izquierda
    }
  } else {
    if (dy > 0 && s.yspeed === 0) {
      s.dir(0, 1); // Deslizar hacia abajo
    } else if (dy < 0 && s.yspeed === 0) {
      s.dir(0, -1); // Deslizar hacia arriba
    }
  }
}
