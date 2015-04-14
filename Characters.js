var Character = function() {};
var Player = function() {};
var Enemy = function() {};
var Bullet = function() {};

/**
 * This function provides a generic way to initialize a character.
 */
Character.prototype.initialize = function() {
  this.frame = { x: 0, y: 0 };
  this.velocity = { x: 0, y: 0 };
  this.acceleration = { x: 0, y: 0 };
  this.alive = true;
  this.sprite = '';
  this.characterType = 'default';

  return this;
};

/**
 * This function kills the character by setting alive to false
 */
Character.prototype.die = function() {
  this.alive = false;

  console.log(this.characterType, 'die');
};

/**
 * Initialize/Construction method - Initializes the bullet.
 * This function sets the velocity of the bullet and the sprite of the bullet.
 * It's up to the GameEngine to handle setting its position
 */
Bullet.prototype.initialize = function() {
  this.frame = { x: 0, y: 0 };

  this.active = false;
  this.velocity = { x: 0, y: 2 };

  this.sprite = new Image();
  this.sprite.src = SPRITESHEET_LOCATION;
  this.sprite.frame = { x: 39, y: 227, width: 26, height: 46 };

  this.frame.width = this.sprite.frame.width/3;
  this.frame.height = this.sprite.frame.height/3;

  return this;
};

/**
 * Move's the bullet's position units on the x axis
 *
 * @param Number units: A positive number to move the bullet along the y axis
 */
Bullet.prototype.move = function(units) {
  this.frame.y += units;
};

/**
 * Make the bullet marked as unrenderable by deactivating it
 */
Bullet.prototype.die = function() {
  this.active = false;
};