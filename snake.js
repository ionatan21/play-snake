function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.length = 0;
  this.tail = [];

  this.eat = function (pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.length++;
      score++;
      if (score > highScore) highScore = score;
      updateScore();

      // Verificar victoria (serpiente ocupa todo el tablero)
      var totalCells = (width / scl) * (height / scl);
      if (this.length >= totalCells - 1) {
        gameWon = true;
      }

      // Reproducir sonido de comida
      if (foodSound && foodSound.isLoaded()) {
        foodSound.play();
      }

      return true;
    }
    return false;
  };

  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
    
    // Reproducir sonido de movimiento
    if (moveSound && moveSound.isLoaded() && !moveSound.isPlaying()) {
      moveSound.play();
    }
  };

  this.death = function () {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      if (this.x === pos.x && this.y === pos.y) {
        gameOver = true;
        updateScore();
        score = 0;
        
        // Reproducir sonido de game over
        if (gameOverSound && gameOverSound.isLoaded()) {
          gameOverSound.play();
        }
      }
    }
  };

  this.update = function () {
    if (this.length > 0) {
      this.tail.push(createVector(this.x, this.y));
      if (this.tail.length > this.length) {
        this.tail.shift();
      }
    }

    this.x += this.xspeed * scl;
    this.y += this.yspeed * scl;

    // Permitir que atraviese los bordes
    if (this.x < 0) this.x = width - scl;
    if (this.x >= width) this.x = 0;
    if (this.y < 0) this.y = height - scl;
    if (this.y >= height) this.y = 0;
  };

  this.show = function () {
    // Dibujar cola y cuerpo
    for (var i = 0; i < this.tail.length; i++) {
      let segment = this.tail[i];
      let nextSegment, nextNextSegment;
      
      // Para el último segmento del tail, usar la posición y dirección de la cabeza
      if (i === this.tail.length - 1) {
        nextSegment = createVector(this.x, this.y);
        // Simular el próximo segmento basado en la velocidad actual
        nextNextSegment = createVector(this.x + this.xspeed * scl, this.y + this.yspeed * scl);
      } else {
        nextSegment = this.tail[i + 1];
        nextNextSegment = (i < this.tail.length - 2) ? this.tail[i + 2] : createVector(this.x, this.y);
      }
      
      let prevSegment = (i > 0) ? this.tail[i - 1] : null;
      
      // Si es el último segmento del tail, es la cola
      if (i === 0) {
        let tailImg = tailDown; // por defecto
        if (prevSegment === null) {
          // Determinar dirección basada en el siguiente segmento
          let dx = nextSegment.x - segment.x;
          let dy = nextSegment.y - segment.y;
          
          // Normalizar wrap around
          if (Math.abs(dx) > scl) dx = dx > 0 ? -scl : scl;
          if (Math.abs(dy) > scl) dy = dy > 0 ? -scl : scl;
          
          if (dx > 0) tailImg = tailLeft;
          else if (dx < 0) tailImg = tailRight;
          else if (dy > 0) tailImg = tailUp;
          else if (dy < 0) tailImg = tailDown;
        }
        image(tailImg, segment.x, segment.y, scl, scl);
      } else {
        // Determinar si es cuerpo recto o curva
        let dx1 = nextSegment.x - segment.x;
        let dy1 = nextSegment.y - segment.y;
        let dx2 = segment.x - prevSegment.x;
        let dy2 = segment.y - prevSegment.y;
        
        // Normalizar wrap around (cuando atraviesa bordes)
        if (Math.abs(dx1) > scl) dx1 = dx1 > 0 ? -scl : scl;
        if (Math.abs(dy1) > scl) dy1 = dy1 > 0 ? -scl : scl;
        if (Math.abs(dx2) > scl) dx2 = dx2 > 0 ? -scl : scl;
        if (Math.abs(dy2) > scl) dy2 = dy2 > 0 ? -scl : scl;
        
        let bodyImg = bodyHorizontal; // por defecto
        
        // Cuerpo recto horizontal o vertical
        if (dx1 !== 0 && dx2 !== 0 && dy1 === 0 && dy2 === 0) {
          bodyImg = bodyHorizontal;
        } else if (dy1 !== 0 && dy2 !== 0 && dx1 === 0 && dx2 === 0) {
          bodyImg = bodyVertical;
        }
        // Curvas - lógica completa corregida
        else if ((dx2 > 0 && dy1 < 0) || (dy2 > 0 && dx1 < 0)) {
          bodyImg = bodyTopLeft;
        } else if ((dx2 < 0 && dy1 < 0) || (dy2 > 0 && dx1 > 0)) {
          bodyImg = bodyTopRight;
        } else if ((dx2 > 0 && dy1 > 0) || (dy2 < 0 && dx1 < 0)) {
          bodyImg = bodyBottomLeft;
        } else if ((dx2 < 0 && dy1 > 0) || (dy2 < 0 && dx1 > 0)) {
          bodyImg = bodyBottomRight;
        }
        
        image(bodyImg, segment.x, segment.y, scl, scl);
      }
    }
    
    // Dibujar cabeza
    let headImg = headRight; // por defecto
    if (this.xspeed > 0) headImg = headRight;
    else if (this.xspeed < 0) headImg = headLeft;
    else if (this.yspeed > 0) headImg = headDown;
    else if (this.yspeed < 0) headImg = headUp;
    
    image(headImg, this.x, this.y, scl, scl);
  };
}
