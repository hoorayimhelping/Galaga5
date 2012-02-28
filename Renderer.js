var Renderer = function() {};

/**
 * This function initializes the renderer 
 *
 * @param Context context: The canvas' context into which to render
 */
Renderer.prototype.initialize = function(context) {
  this.context = context;

  return this;
};

/**
 * This function clears the context of any previously drawn elements.
 * Under most circumstance, this will be called once a frame.
 */
Renderer.prototype.clear = function() {
  this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
};

/**
 * Render the background
 */
Renderer.prototype.renderBackground = function() {
  this.context.fillStyle = "rgba(0, 0, 0, 1)";
  this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  this.context.fill();
};

/**
 * Render the player's location on the canvas based on the data in the player object
 * player.sprite is the Image object with an additional anonymous object appended
 * with information on how to slice the image to access the player sprite
 *
 * @param Player player: The player object 
 */
Renderer.prototype.renderPlayer = function(player) {
  this.context.drawImage(player.sprite, player.sprite.frame.x, player.sprite.frame.y,
	player.sprite.frame.width, player.sprite.frame.height,
	player.frame.x, player.frame.y, player.frame.width, player.frame.height);
};

/**
 * @param Array enemies: An array of Enemy objects
 */
Renderer.prototype.renderEnemies = function(enemies) {
  for (var i = 0, j = enemies.length; i < j; i++) {
    if (enemies[i].alive) {
      this.context.drawImage(enemies[i].sprite, enemies[i].sprite.frame.x, enemies[i].sprite.frame.y,
	  enemies[i].sprite.frame.width, enemies[i].sprite.frame.height,
   	  enemies[i].frame.x, enemies[i].frame.y, enemies[i].frame.width, enemies[i].frame.height);
    }
  }
}

/**
 * Render all active bullets
 *
 * @param Array bullets: The array of player bullets
 */
Renderer.prototype.renderBullets = function(bullets) {
  for (var i = 0, l = bullets.length; i < l; i++) {
    if (bullets[i].active) {
      this.context.drawImage(bullets[i].sprite, bullets[i].sprite.frame.x, bullets[i].sprite.frame.y,
        bullets[i].sprite.frame.width, bullets[i].sprite.frame.height,
        bullets[i].frame.x, bullets[i].frame.y, bullets[i].frame.width, bullets[i].frame.height);
    }
  }
};