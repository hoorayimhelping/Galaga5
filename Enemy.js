Enemy.prototype = new Character();
Enemy.prototype.constructor = Enemy;

/**
 * @param Object position: Object with x and y number coordinates { x: 0, y: 0 };
 */
Enemy.prototype.initialize = function(position) {
  Character.prototype.initialize.call(this);

  this.sprite = new Image();
  this.sprite.src = SPRITESHEET_LOCATION;

  if (typeof position !== 'undefined' && position.hasOwnProperty('x') && position.hasOwnProperty('y')) {
    this.frame.x = position.x;
    this.frame.y = position.y;
  }

  return this;
}

Enemy.prototype.die = function() {
  this.alive = false;
  console.log('enemy die');
};

// Hank is the blue waspy guy
var Hank = function() {};
Hank.prototype = new Enemy();
Hank.prototype.constructor = Hank;

Hank.prototype.initialize = function(position) {
  Enemy.prototype.initialize.call(this, position);

  this.sprite.frame = { x: 120, y: 240, width: 104, height: 80 };

  // the sprite is too large, so we want to srhink it a bit
  this.frame.width = this.sprite.frame.width/3;
  this.frame.height = this.sprite.frame.height/3;

  this.type = 'hank';

  return this;
};

// Dean is the red butterfly looking fellow
var Dean = function() {};
Dean.prototype = new Enemy();
Dean.prototype.constructor = Dean;

Dean.prototype.initialize = function(position) {
  Enemy.prototype.initialize.call(this, position);

  this.sprite.frame = { x: 628, y: 24, width: 104, height: 80 };

  this.frame.width = this.sprite.frame.width/3;
  this.frame.height = this.sprite.frame.height/3;

  this.type = 'dean';

  return this;
};