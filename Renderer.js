var Renderer = function() {};

/**
 * This function initializes the renderer 
 *
 * @param Context context: The canvas' context into which to render
 */
Renderer.prototype.initialize = function(context, backgroundContext) {
  this.context = context;
  this.backgroundContext = backgroundContext
  return this;
};

/**
 * This function clears the context of any previously drawn elements.
 * Under most circumstance, this will be called once a frame.
 */
Renderer.prototype.clear = function() {
  this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
};

/**
 * Render the background
 */
Renderer.prototype.renderBackground = function() {
  this.context.fillStyle = "rgba(0, 0, 0, 1)";
  this.context.fillRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
  this.context.fill();
};

Renderer.prototype.renderStarField = function() {
  this.backgroundContext.fillStyle = "rgba(0, 0, 0, 1)";
  this.backgroundContext.fillRect(0, 0, this.backgroundContext.canvas.clientWidth, this.backgroundContext.canvas.clientHeight);
  this.backgroundContext.fill();

  const imageData = this.backgroundContext.getImageData(0, 0, this.backgroundContext.canvas.clientWidth, this.backgroundContext.canvas.clientHeight);
  for(let i = 0; i < imageData.data.length; i+= 4) {
    if (Math.floor(Math.random() * 200) === 0) {
      imageData.data[i] = 255;
      imageData.data[i + 1] = 255;
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;

      // color the next pixel
      if (Math.floor(Math.random() * 15) === 0) {
        imageData.data[i + 4] = 255;
        imageData.data[i + 5] = 255;
        imageData.data[i + 6] = 255;
        imageData.data[i + 7] = 255;
      }

      // color the pixel one row down and next to this one
      if (Math.floor(Math.random() * 15) === 0) {
        imageData.data[(this.backgroundContext.canvas.clientWidth * i)] = 255;
        imageData.data[(this.backgroundContext.canvas.clientWidth * i) + 1] = 255;
        imageData.data[(this.backgroundContext.canvas.clientWidth * i) + 2] = 255;
        imageData.data[(this.backgroundContext.canvas.clientWidth * i) + 3] = 255;
        imageData.data[(this.backgroundContext.canvas.clientWidth * i) + 4] = 255;
        imageData.data[(this.backgroundContext.canvas.clientWidth * i) + 5] = 255;
        imageData.data[(this.backgroundContext.canvas.clientWidth * i) + 6] = 255;
        imageData.data[(this.backgroundContext.canvas.clientWidth * i) + 7] = 255;
      }
    }
  }
  this.backgroundContext.putImageData(imageData, 0, 0)
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

Renderer.prototype.renderCountdownText = function(countdown) {
  this.clear();
  this.renderBackground();

  this.context.font = "48px Helvetica";
  this.context.fillStyle = 'white';
  this.context.fillText(countdown, this.context.canvas.clientWidth / 2, this.context.canvas.clientHeight / 2);
};
