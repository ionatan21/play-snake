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

      return true;
    }
    return false;
  };

  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  };

  this.death = function () {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      if (this.x === pos.x && this.y === pos.y) {
        gameOver = true;
        updateScore();
        score = 0;
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
    for (var i = 0; i < this.tail.length; i++) {
      let c = map(i, 0, this.tail.length, 50, 255);
      fill(0, c, 0);
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    fill(0, 255, 0);
    rect(this.x, this.y, scl, scl);
  };
}
