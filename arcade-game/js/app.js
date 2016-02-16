// Enemies our player must avoid.
var Enemy = function(x, y, speed) {

  this.sprite = 'images/enemy-bug.png';
  // this.x and this.y provided in render function.
  // speed provided in random function.
  this.x = x;
  this.y = y;
  this.speed = speed;
};

Enemy.prototype.update = function(dt) {

  // Match speed for any devices.
  this.x += this.speed * dt;

  // When enemy object reaches the end, its position is reset and it is given
  // a new random speed.
  if (this.x > 540) {
    this.x = -105;
    this.random();
  }

  // Give our enemy objects hitboxes.
  var enemyHitLeft = this.x - 60;
  var enemyHitRight = this.x + 60;
  var enemyHitTop = this.y - 60;
  var enemyHitBottom = this.y + 60;

  // Check if our player object collides with an enemy object, reset if true.
  if (player.x > enemyHitLeft && player.x < enemyHitRight && player.y > enemyHitTop && player.y < enemyHitBottom) {
    player.reset();
  }

};

// Randomise the speed of enemies
Enemy.prototype.random = function() {
  var randomSpd = Math.floor(Math.random() * 5 + 1);
  this.speed = 100 * randomSpd;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create Player as exact copy of Enemy class
var Player = function(x, y) {
  // Make sure the image for the sprite you want to use is loaded in engine.
  this.sprite = 'images/char-cat-girl.png';
  this.x = x;
  this.y = y;
};

Player.prototype.update = function(dt){
  // Do we need any code here?
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {

  if (direction === 'left' && this.x !== border.left) {
    this.x -= 101;
  }
  if (direction === 'right' && this.x !== border.right) {
    this.x += 101;
  }
  if (direction === 'up' && this.y !== border.top) {
    this.y -= 85;
  } else if (direction === 'up' && this.y === 40) {
    this.reset();
    //Here we could implement a score.
  }
  if (direction === 'down' && this.y !== border.bottom) {
    this.y += 85;
  }
};

// For when a collision occurs, reset Player object.
Player.prototype.reset = function() {
  this.x = 202.5;
  this.y = 380;
};

// Create borders to restrict our Player object.
var border = {
  top: 40,
  right: 404.5,
  bottom: 380,
  left: 0.5
};

// X position would be a negative value, to prevent pop-in of enemy object.
// Y position closely matches the layout of the path.
// Speed is initially randomised, then again later in update function.
var allEnemies = [];

for (var i = 0; i < 3; i++) {
  var startSpeed = Math.floor(Math.random() * 6 + 1) * 80;
  allEnemies.push(new Enemy(-105, 60 + 85 * i, startSpeed));
}

// Place the player object in a variable called player
var player = new Player(202.5, 380);

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);

});
