var GameEngine = function() {};

/**
 * Initialize/Construction method - Initializes state of the game world
 *
 * @param Canvas canvas: A handle to the HTML canvas element in which we render
 *
 * @return GameEngine: Returns itself
 */
GameEngine.prototype.initialize = function(canvas) {
  this.canvas = canvas;
  this.performanceStats = new PerformanceStats();
  this.renderer = new Renderer().initialize(this.canvas.getContext('2d'));
  this.player = new Player().initialize();
  this.inputManager = new InputManager().initialize(this);
  this.paused = false;

  this.playerBullets = [new Bullet().initialize(), new Bullet().initialize()];
  this.enemyBullets = [];

  this.particleColors = {
    blue: { r: 77, g: 109, b: 243, a: 1 },
    yellow: { r: 255, g: 242, b: 0, a: 1 },
    red: { r: 238, g: 28, b: 36, a: 1 },
    pink: { r: 255, g: 163, b: 177, a: 1 }
  };
  this.particleManagers = [];
  this.particleCount = 45;

  this.hankManager = new EnemyManager().initialize('hank', 4);
  this.deanManager = new EnemyManager().initialize('dean', 4);

  // this puts the player's ship at the bottom of the screen and offsets it by the ship's height and a few extra pixels
  this.player.frame.y = this.canvas.height - this.player.frame.height * 1.1;

  return this;
};

/**
 * Update function: This function is the main loop of the game. All cyclical game-related calls originate here
 *
 * @param Number dt: The number of miliseconds since the last frame
 *    under ideal circumstances, this will be 16 (1000/16 = 62.5 fps)
 */
GameEngine.prototype.update = function(dt) {
  this.renderer.clear();
  this.renderer.renderBackground();

  this.renderer.renderPlayer(this.player);
  this.renderer.renderEnemies(this.getAllEnemies());
  this.renderer.renderBullets(this.playerBullets);
  if (this.particleManagers.length) {
    this.renderer.renderParticles(this.getAllParticles());
  }

  var timeScalar = dt/2;

  if (!this.paused) {
    this.updatePlayer(this.getPressedKeys(), timeScalar);
    this.updateEnemies(timeScalar);
    this.updateBullets(timeScalar);
    this.updateParticles(timeScalar/15);
    this.detectCollisions();
  }

  if (this.performanceStats.on) {
    this.performanceStats.update(dt);
  }
};

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
 * @param Number dt: Time change in milliseconds
 */
GameEngine.prototype.updateEnemies = function(timeScalar) {
//  this.hankManager.update(timeScalar);
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
  bullet.frame.x = this.player.frame.x + (this.player.frame.width/2) - 4;
  bullet.frame.y = this.canvas.height - this.player.frame.height - 15;
  bullet.active = true;
};

/**
 * Moves the active bullets, deactivates off-screen bullets, ignores deactived bullets
 *
 * @param Number timeScalar: Time since last frame adjusted by game engine
 */
GameEngine.prototype.updateBullets = function(timeScalar) {
  for (var i = 0, j = this.playerBullets.length; i < j; i++) {
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

/**
 * Determines which objects in the game world to test for collisions
 */
GameEngine.prototype.detectCollisions = function() {
  var enemies = this.getAllEnemies(),
    enemyLength = enemies.length,
    playerBulletCount = this.playerBullets.length;

  for (var i = 0; i < playerBulletCount; i++) {
	  if (this.playerBullets[i].active) {
      for (var j = 0; j < enemyLength; j++) {
        if (enemies[j].alive) {
          if (this.colliding(enemies[j], this.playerBullets[i])) {
            enemies[j].die();
            this.explode({ x: enemies[j].frame.x + enemies[j].frame.width/2, y: enemies[j].frame.y + enemies[j].frame.height/2 }, enemies[j].type);
            this.playerBullets[i].die();
	        }
        }
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
  manager.initialize(this.particleCount);

  if (type === 'hank') {
    manager.create(point, [this.particleColors.blue, this.particleColors.red, this.particleColors.yellow]);
  }
  if (type === 'dean') {
    manager.create(point, [this.particleColors.blue, this.particleColors.red, this.particleColors.pink]);
  }

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
  if (this.player.frame.x >= this.canvas.width - this.player.frame.width && movement.right > 0) { return 0; }

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
  return this.hankManager.enemies.concat(this.deanManager.enemies);;
};

GameEngine.prototype.pause = function() {
  console.log('paused');
};

/**
 * A public/interface method currently used by InputManager to fire a player's bullet
 */
GameEngine.prototype.fire = function() {
  for (var i = 0, j = this.playerBullets.length; i < j; i++) {
    if (!this.playerBullets[i].active) {
      this.fireBullet(this.playerBullets[i]);
      return;
    }
  }
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

/**
 * Function to feature test browsers and provide an abstract way to animate
 * Please see https://gist.github.com/1114293#file_anim_loop_x.js
 */
(function(window, Date) {
  // feature testing
  var raf = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

  GameEngine.prototype.run = function(element) {
    var running,
        lastFrame = +new Date,
        that = this;

    function loop(now) {
      if (running !== false) {
        raf ? raf(loop, element) : setTimeout(loop, 16);
        // Make sure to use a valid time, since:
        // - Chrome 10 doesn't return it at all
        // - setTimeout returns the actual timeout
        now = now && now > 1E4 ? now : +new Date;
        var dt = now - lastFrame;
        // do not render frame when dt is too high
        if (dt < 160) {
          that.update(dt);
        }
        lastFrame = now;
      }
    }
    loop();
  };
})(window, Date);