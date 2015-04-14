var Enemies = {
  hank: {
    sprite: { x: 120, y: 240, width: 104, height: 80 },
  }, 
  dean: {
    sprite: { x: 628, y: 24, width: 104, height: 80 },
  },
  brock: {
    // y: 313 for purple
    sprite: { x: 591, y: 163, width: 120, height: 128 },
  }
};

// sprites are too large, gotta shrink it some
Enemies.hank.frame = { x: 0, y: 0, width: Enemies.hank.sprite.width / 3, height: Enemies.hank.sprite.height / 3 };
Enemies.dean.frame = { x: 0, y: 0, width: Enemies.dean.sprite.width / 3, height: Enemies.dean.sprite.height / 3 };
Enemies.brock.frame = { x: 0, y: 0, width: Enemies.brock.sprite.width / 3, height: Enemies.brock.sprite.height / 3 };

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

// Hank is the blue waspy guy
var Hank = function() {};
Hank.prototype = new Enemy();
Hank.prototype.constructor = Hank;

Hank.prototype.initialize = function(position) {
  Enemy.prototype.initialize.call(this, position);

  this.sprite.frame = Enemies.hank.sprite;

  this.frame.width = Enemies.hank.frame.width;
  this.frame.height = Enemies.hank.frame.height;

  this.characterType = 'hank';

  return this;
};

// Dean is the red butterfly looking fellow
var Dean = function() {};
Dean.prototype = new Enemy();
Dean.prototype.constructor = Dean;

Dean.prototype.initialize = function(position) {
  Enemy.prototype.initialize.call(this, position);

  this.sprite.frame = Enemies.dean.sprite;

  this.frame.width = Enemies.dean.frame.width;
  this.frame.height = Enemies.dean.frame.height

  this.characterType = 'dean';

  return this;
};

var Brock = function() {};
Brock.prototype = new Enemy();
Brock.prototype.constructor = Brock;

Brock.prototype.initialize = function(position) {
  Enemy.prototype.initialize.call(this, position);

  this.sprite.frame = Enemies.brock.sprite;

  this.frame.width = Enemies.brock.frame.width;
  this.frame.height = Enemies.brock.frame.height;

  this.characterType = 'brock';

  return this;
};
