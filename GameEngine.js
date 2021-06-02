var GameEngine = function() {};

/**
 * Initialize/Construction method - Initializes state of the game world
 *
 * @param Canvas canvas: A handle to the HTML canvas element in which we render
 *
 * @return GameEngine: Returns itself
 */
GameEngine.prototype.initialize = function(canvas, backgroundCanvas) {
  this.canvas = canvas;
  this.performanceStats = new PerformanceStats();
  this.renderer = new Renderer().initialize(this.canvas.getContext('2d'), backgroundCanvas.getContext('2d'));
  this.inputManager = new InputManager().initialize({
    pause: this.togglePause.bind(this),
    fire: this.fire.bind(this)
  });
  this.enemiesPerSquad = 10;

  this.paused = true;

  this.playerBullets = [new Bullet().initialize(), new Bullet().initialize()];
  this.enemyBullets = [];

  this.particleManagers = [];
  this.particleCount = 45;

  this.player = new Player().initialize();
  this.player.frame.x = (this.canvas.clientWidth / 2) - (this.player.frame.width / 2);
  this.player.frame.y = this.canvas.clientHeight;

  this.firstWave = new EnemyManager().initialize('firstWave', this.enemiesPerSquad, {
    x: this.canvas.clientWidth / 2 - (Enemies.hank.frame.width / 2),
    y: -Enemies.hank.frame.height
  });
  // this.firstWave.renderable = true;

  this.secondWave = new EnemyManager().initialize('secondWave', this.enemiesPerSquad, {
    x: (this.canvas.clientWidth / 2) - (Enemies.dean.frame.width * 2.9),
    y: -Enemies.dean.frame.height
  });
  this.secondWave.renderable = true;

  this.player.frame.y = this.canvas.clientHeight - this.player.frame.height * 1.1;

  this.allEnemies = this.getAllEnemies();
  this.allLivingEnemies = this.getAllLivingEnemies();
  this.lastFrameTime = +new Date;

  this.renderer.clear();
  this.renderer.renderStarField()

  return this;
};

/**
 * Update function: This function is the main loop of the game. All cyclical game-related calls originate here
 *
 * @param Number dt: The number of miliseconds since the last frame
 *    under ideal circumstances, this will be 16 (1000/16 = 62.5 fps)
 */
GameEngine.prototype.update = function(dt) {
  var timeScalar = dt/2;

  this.allEnemies = this.getAllEnemies();
  this.allLivingEnemies = this.getAllLivingEnemies();

  // only update positions if the game isn't paused
  if (!this.paused) {
    if (this.player.alive) {
      this.updatePlayer(this.getPressedKeys(), timeScalar);
      this.updateEnemies(timeScalar);
      this.updateBullets(timeScalar);
      this.detectCollisions();
    }
    this.updateParticles(timeScalar / 15);
  }

  this.render(dt);
};

GameEngine.prototype.render = function(dt) {
  this.renderer.clear();

  if (this.player.alive) {
    this.renderer.renderPlayer(this.player);
  }

  var allRenderableItems = this.getAllRenderableItems();
  for (var i = 0, l = allRenderableItems.length; i < l; i++) {
    this.renderer.renderCharacterSprite(allRenderableItems[i]);
  }

  var particles = this.getAllParticles();
  for (var i = 0, l = particles.length; i < l; i++) {
    if (!particles[i].alive) { continue; }

    this.renderer.renderParticle(particles[i]);
  }

  this.updatePerfStats(dt);
}

/**
 * Umbrella function that does general updates of the player in the game world
 * Updates the player's position if the player is moving
 *
 * @param Object keys: An object map representing which keys are currently pressed
 * @param Number timeScalar: Time since last frame adjusted by game engine
 */
GameEngine.prototype.updatePlayer = function(keys, timeScalar) {
  var units = this.calculatePlayerMovement(keys, timeScalar);
  if (units !== 0) {
    this.player.move(units);
  }
};

/**
 * Updates all the enemies
 *
 * @param Number timeScalar: Time since last frame adjusted by game engine
 */
GameEngine.prototype.updateEnemies = function(timeScalar) {
  this.firstWave.firstWave(timeScalar, { left: 0, right: this.canvas.clientWidth });
};

GameEngine.prototype.updateParticles = function(timeScalar) {
  for (var i = 0, l = this.particleManagers.length; i < l; i++) {
    if (this.particleManagers[i].active) {
      this.particleManagers[i].update(timeScalar);
    }
  }
};

/**
 * Fires the bullet passed in. Computes where the player's ship is then fires from the front of it
 *
 * @param Object bullet: An inactive bullet from GameEngine's bullet list
 */
GameEngine.prototype.fireBullet = function(bullet) {
  bullet.frame.x = this.player.frame.x + (this.player.frame.width / 2) - 4;
  bullet.frame.y = this.canvas.clientHeight - this.player.frame.height - 15;
  bullet.active = true;
};

/**
 * Moves the active bullets, deactivates off-screen bullets, ignores deactived bullets
 *
 * @param Number timeScalar: Time since last frame adjusted by game engine
 */
GameEngine.prototype.updateBullets = function(timeScalar) {
  for (var i = 0, l = this.playerBullets.length; i < l; i++) {
    if (this.playerBullets[i].active) {
      var bullet = this.playerBullets[i];
      if (bullet.frame.y + bullet.frame.height <= 0) {
        bullet.die();
        continue;
      }
      bullet.move(-bullet.velocity.y * timeScalar);
    }
  }
};

GameEngine.prototype.getRenderableBullets = function() {
  var renderableBullets = [];
  for (var i = 0, l = this.playerBullets.length; i < l; i++) {
    if (this.playerBullets[i].active) {
      renderableBullets.push(this.playerBullets[i]);
    }
  }

  return renderableBullets;
};

/**
 * Get all particles for rendering from active particle managers
 *
 * @return Array: The array of particles to render
 */
GameEngine.prototype.getAllParticles = function() {
  var particles = [];

  for (var i = 0, l = this.particleManagers.length; i < l; i++) {
    if (this.particleManagers[i].active) {
      particles = particles.concat(this.particleManagers[i].particles);
    }
  }

  return particles;
};

GameEngine.prototype.getAllRenderableItems = function () {
  var itemsToRender = [];
  for (var i = 0; i < this.allEnemies.length; i++) {
    if (this.allEnemies[i].alive) {
      itemsToRender.push(this.allEnemies[i]);
    }
  }

  return itemsToRender.concat(this.getRenderableBullets());
}

/**
 * Determines which objects in the game world to test for collisions
 */
GameEngine.prototype.detectCollisions = function() {
  this.detectBulletCollisions();
  this.detectPlayerCollisions();
};

GameEngine.prototype.detectBulletCollisions = function() {
  var enemies = this.allLivingEnemies;
  var enemyCount = enemies.length;
  var playerBulletCount = this.playerBullets.length;

  for (var i = 0; i < playerBulletCount; i++) {
    if (this.playerBullets[i].active) {
      for (var j = 0; j < enemyCount; j++) {
        if (enemies[j].alive) {
          if (this.colliding(enemies[j], this.playerBullets[i])) {
            enemies[j].die();
            this.explode({
                x: enemies[j].frame.x + enemies[j].frame.width / 2,
                y: enemies[j].frame.y + enemies[j].frame.height / 2
              }, enemies[j].characterType);
            this.playerBullets[i].die();
          }
        }
      }
    }
  }
};

GameEngine.prototype.detectPlayerCollisions = function() {
  var enemies = this.allLivingEnemies;

  for (var i = 0, l = enemies.length; i < l; i ++) {
    if (enemies[i].alive) {
      if (this.colliding(this.player ,enemies[i])) {
        this.player.die();
        this.explode({
          x: this.player.frame.x + this.player.frame.width / 2,
          y: this.player.frame.y + this.player.frame.height / 2
        }, 'player');

        enemies[i].die();
        this.explode({
          x: enemies[i].frame.x + enemies[i].frame.width / 2,
          y: enemies[i].frame.y + enemies[i].frame.height / 2
        }, enemies[i].characterType);
      }
    }
  }
};

/**
 * Does rectangle-based collision detection
 *
 * @param Character ship: The ship to test (can be player ship or enemy ship)
 * @param Bullet bullet: The bullet being fired
 */
GameEngine.prototype.colliding = function(ship, bullet) {
  /* If the following evaluates to true, the two rectangles are not colliding
     (ship.bottom < bullet.top) || (ship.top > bullet.bottom) ||
   (ship.left > bullet.right) || (ship.right < bullet.left) */
  return !((ship.frame.height + ship.frame.y) < bullet.frame.y ||
         ship.frame.y > (bullet.frame.height + bullet.frame.y) ||
         ship.frame.x > (bullet.frame.x + bullet.frame.width) ||
         (ship.frame.x + ship.frame.width) < bullet.frame.x);
};

/**
 * Creates a particle explosion in the color palette of the enemy that was killed
 *
 * @param Object point: The coordinates of the explosion in of the type {x: Number, y: Number}
 * @param String type: The type of the enemy exploding
 */
GameEngine.prototype.explode = function(point, type) {
  var manager = null;
  for (var i = 0, l = this.particleManagers.length; i < l; i++) {
    if (!this.particleManagers[i].active) {
      manager = this.particleManagers[i];
      break;
    }
  }

  manager = manager || new ParticleManager();
  manager.initialize(this.particleCount).create(point, type);

  // only push to the end of the array if it's a brand new manager
  if (manager !== this.particleManagers[i]) {
    this.particleManagers.push(manager);
  }  
};

/**
 * Calculate how many units to move the player character
 *
 * @param Object movement: The object map of the pressed keys
 * @param Number timeScalar: Time since last frame adjusted by game engine
 */
GameEngine.prototype.calculatePlayerMovement = function(movement, timeScalar) {
  //guard for player hitting both left and right at the same time
  if (movement.right > 0 && movement.left > 0) { return 0; }

  // guard for player being at the left edge and hitting left
  if (this.player.frame.x <= 0 && movement.left > 0) { return 0; }

  // guard for player being at the right edge and hitting right
  if (this.player.frame.x >= this.canvas.clientWidth - this.player.frame.width && movement.right > 0) { return 0; }

  var units = movement.right > 0 ? movement.right : movement.left;
  var modifier = movement.right > 0 ? 1 : -1;

  return units * timeScalar * modifier;
};

/**
 * This funciton finds which keys are currently being pressed and returns the result
 *
 * @return Object movement: The results of the movement
 */
GameEngine.prototype.getPressedKeys = function() {
  var movement = {
    'left': 0, 'up': 0, 'right': 0, 'down': 0
  },
      keys = this.inputManager.getPressedKeys();

  for (var key in keys) {
    if (keys[key]) {
      if (key == 'leftArrow') {
        movement['left'] = 1;
      }

      if (key == 'rightArrow') {
        movement['right'] = 1;
      }
    }
  }

  return movement;
};

/**
 * @return Array: An array of enemy objects with each visible enemy in the game world
 */
GameEngine.prototype.getAllEnemies = function() {
  var enemies = [];

  if (this.firstWave.renderable) {
    enemies = this.firstWave.enemies;
  } else {
    enemies = this.secondWave.enemies;
  }

  return enemies;
};

GameEngine.prototype.getAllLivingEnemies = function() {
  var livingEnemies = [];

  for (var i = 0, l = this.allEnemies.length; i < l; i++) {
    if (this.allEnemies[i].alive) {
      livingEnemies.push(this.allEnemies[i]);
    }
  }

  return livingEnemies;
}

GameEngine.prototype.togglePause = function() {
  this.paused = !this.paused;
};

/**
 * A public/interface method currently used by InputManager to fire a player's bullet
 */
GameEngine.prototype.fire = function() {
  if (this.paused || !this.player.alive) { return; }

  for (var i = 0, j = this.playerBullets.length; i < j; i++) {
    if (!this.playerBullets[i].active) {
      this.fireBullet(this.playerBullets[i]);
      return;
    }
  }
};

GameEngine.prototype.renderCountdownText = function(countdown) {
  this.renderer.renderCountdownText(countdown);
};

/**
 * Toggles performance stat meter display
 *
 * @param String onOff: 'on'|'off' default: off
 * @param HTMLElement element: The html element to draw the stats into
 *
 * @return GameEngine Returns this
 */
GameEngine.prototype.togglePerformanceStats = function(onOff, element) {
  this.performanceStats.initialize(onOff, element);

  return this;
};

GameEngine.prototype.run = function() {
  requestAnimationFrame(this.run.bind(this));

  var now = +new Date;
  var dt = (now - this.lastFrameTime);

  if (dt < 160) {
    this.update(dt)
  }

  this.lastFrameTime = now;
};

GameEngine.prototype.startGame = function() {
  this.run();
  this.paused = false;

  this.updatePerfStats(1000);
};

GameEngine.prototype.updatePerfStats = function(dt) {
  if (this.performanceStats.on) {
    this.performanceStats.update(dt, this.allLivingEnemies.length);
  }  
}
