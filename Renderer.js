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

// uses poisson disc sampling
// see https://bl.ocks.org/mbostock/19168c663618b7f07158
Renderer.prototype.renderStarField = function() {
  function poissonDiscSampler(width, height, radius) {
    const maxSamples = 30; // maximum number of samples before rejection
    const squaredRadius = radius * radius;
    const R = 3 * squaredRadius;
    const cellSize = radius * Math.SQRT1_2;
    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);
    const grid = new Array(gridWidth * gridHeight);
    const queue = [];
    let queueSize = 0;
    let sampleSize = 0;

    return function() {
      
      if (!sampleSize) {
        return sample(0, 0);
      }

      // Pick a random existing sample and remove it from the queue.
      while (queueSize) {
        var i = Math.random() * queueSize | 0,
            s = queue[i];

        // Make a new candidate between [radius, 2 * radius] from the existing sample.
        for (var j = 0; j < maxSamples; ++j) {
          var a = 2 * Math.PI * Math.random(),
              r = Math.sqrt(Math.random() * R + squaredRadius),
              x = s[0] + r * Math.cos(a),
              y = s[1] + r * Math.sin(a);

          // Reject candidates that are outside the allowed extent,
          // or closer than 2 * radius to any existing sample.
          if (x >= 0 && x < width && 
              y >= 0 && y < height && 
              far(x, y)) {
            return sample(x, y);
          }
        }

        queue[i] = queue[--queueSize];
        queue.length = queueSize;
      }
    };

    function far(x, y) {
      var i = x / cellSize | 0,
          j = y / cellSize | 0,
          i0 = Math.max(i - 2, 0),
          j0 = Math.max(j - 2, 0),
          i1 = Math.min(i + 3, gridWidth),
          j1 = Math.min(j + 3, gridHeight);

      for (j = j0; j < j1; ++j) {
        var o = j * gridWidth;
        let s;

        for (i = i0; i < i1; ++i) {
          if (s = grid[o + i]) {
            let dx = s[0] - x;
            let dy = s[1] - y;
            
            if (dx * dx + dy * dy < squaredRadius) {
              return false;
            }
          }
        }
      }

      return true;
    }

    function sample(x, y) {
      const sample = [x, y];

      queue.push(sample);
      grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = sample;

      sampleSize++;
      queueSize++;

      return sample;
    }
  }

  this.backgroundContext.fillStyle = "rgba(0, 0, 0, 1)";
  this.backgroundContext.fillRect(0, 0, this.backgroundContext.canvas.clientWidth, this.backgroundContext.canvas.clientHeight);

  this.backgroundContext.fillStyle = "rgba(255, 255, 255, 1)";
  var sample = poissonDiscSampler(this.backgroundContext.canvas.clientWidth, this.backgroundContext.canvas.clientHeight, 12);
  let radius = 1;
  do {
    for (let j = 0; j < 10; j++) {
      s = sample()
      if (s) {
        this.backgroundContext.fillStyle = `rgba(255, 255, 255, 1)`;
        radius = Math.random() * (1 - 0.2) + 0.2;
        this.backgroundContext.beginPath();
        this.backgroundContext.arc(s[0], s[1], radius, 0, 2 * Math.PI, false);
        this.backgroundContext.fill()
      }
    }
  } while (s && s[0] < this.backgroundContext.canvas.clientWidth && s[1] < this.backgroundContext.canvas.clientHeight)
}

// old way that modifies image data directly
Renderer.prototype.renderStarField_ = function() {
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
