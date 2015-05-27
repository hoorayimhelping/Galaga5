Player.prototype = new Character();
Player.prototype.constructor = Player;

Player.prototype.initialize = function() {
  Character.prototype.initialize.call(this);

  this.frame = { x: 0, y: 0 };

  this.sprite = new Image(); 
  this.sprite.src = SPRITESHEET_LOCATION;
  this.sprite.frame = { x: 241, y: 46, width: 136, height: 152 };
  this.characterType = 'player';

  // the sprite is too large, so we want to srhink it a bit
  this.frame.width = this.sprite.frame.width / 3;
  this.frame.height = this.sprite.frame.height / 3;

  return this;
};

Player.prototype.die = function() {
  this.alive = false;
};

/**
 * Move's the player's position units on the x axis
 *
 * @param Number units: A positive or negative number to move the player along the x axis
 */
Player.prototype.move = function(units) {
  this.frame.x += units;
};

Player.prototype.fire = function() {
  console.log('player.fire')
};