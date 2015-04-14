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

Renderer.prototype.renderCharacterSprite = function(character) {
  this.context.drawImage(character.sprite, character.sprite.frame.x, character.sprite.frame.y,
  character.sprite.frame.width, character.sprite.frame.height,
  character.frame.x, character.frame.y, character.frame.width, character.frame.height);
}

/**
 * Render the player's location on the canvas based on the data in the player object
 * player.sprite is the Image object with an additional anonymous object appended
 * with information on how to slice the image to access the player sprite
 *
 * @param Player player: The player object 
 */
Renderer.prototype.renderPlayer = function(player) {
  this.renderCharacterSprite(player);
};


/**
 * Render a single particle
 *
 * @param Object particle: the particle to render
 */
Renderer.prototype.renderParticle = function(particle) {
  this.context.beginPath();
    this.context.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI*2, true);
  this.context.closePath();

  this.context.fillStyle = particle.getFillStyle();
  this.context.fill();

  if (particle.hasOwnProperty('strokeStyle') && particle.strokeStyle !== '') {
    this.context.strokeStyle = particle.strokeStyle;
    this.context.stroke();
  }
};