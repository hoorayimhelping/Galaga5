var EnemyManager = function() {};

/**
 * @param String enemyType: The type of enemy to spawn [hank|dean|doc|brock]
 * @param Number enemyCount: The number of enemies to spawn
 * @param Object startingCoordinates: Coordinates of first ship in the formation {x: 0, y: 0}
 */
EnemyManager.prototype.initialize = function(enemyType, enemyCount, startingCoordinates) {
  this.enemies = [];
  this.angle = 5;
  this.angleIncrement = 2;
  this.direction = 1;
  this.startingCoordinates = startingCoordinates;

  if (enemyType.toLowerCase() === 'hank') {
    for (var i = 0; i < enemyCount; i++) {
      this.enemies.push(new Hank().initialize(
        { x: startingCoordinates.x, y: startingCoordinates.y - (i * Enemies.hank.frame.height) }
      ));
    }
  }

  if (enemyType.toLowerCase() === 'dean') {
    for (var i = 0; i < enemyCount; i++) {
      this.enemies.push(new Dean().initialize({ y: 90, x: (i + 2) * 55 }));
    }
  }

  if (enemyType.toLowerCase() === 'circle_man') {
    for (var i = 0; i < enemyCount; i++) {
      var man = i % 2 ? new Dean() : new Hank();
      this.enemies.push(man.initialize({ y: 130, x: (i + 2) * 55 }));
    }
  }

  if (enemyType.toLowerCase() === 'sine_man') {
    for (var i = 0; i < enemyCount; i++) {
      var man = i % 2 ? new Dean() : new Hank();
      this.enemies.push(man.initialize({ y: 170, x: (i + 2) * 55 }));
    }
  }

  if (enemyType.toLowerCase() === 'shuffle_man') {
    for (var i = 0; i < enemyCount; i++) {
      this.enemies.push(new Brock().initialize({ y: 50, x: (i + 2) * 55 }));
    }
  }

  return this;
};

EnemyManager.prototype.initialAttack = function(timeScalar, bounds) {
  this.initial_y_value = 350;
  this.second_y_value = this.initial_y_value + 100;

  for (var i = 0, l = this.enemies.length; i < l; i++) {
    var enemy = this.enemies[i];
    if (!enemy.alive) {
      continue;
    }

    if (enemy.frame.y >= this.initial_y_value) {
      enemy.frame.x -= timeScalar * (i % 2 === 0 ? 1 : -1);
      if (enemy.frame.y <= this.second_y_value) {
        enemy.frame.y += (timeScalar / 10);
      }
    } else {
      enemy.frame.y += timeScalar;
    }

    if (enemy.frame.x >= bounds.right || enemy.frame.x <= bounds.left) {
      enemy.frame.x = this.startingCoordinates.x;
      enemy.frame.y = this.startingCoordinates.y - (i * enemy.frame.height);
    }
  }
};

/**
 * Make the dude do a circle I guess
 */
EnemyManager.prototype.circle = function(timeScalar, centerPoint, radius) {
  var radians = (this.angle) * (Math.PI/180);

  for (var i = 0, l = this.enemies.length; i < l; i++) {
    this.enemies[i].frame.y = centerPoint + Math.sin(radians * i) * radius;
    this.enemies[i].frame.x = centerPoint + Math.cos(radians * (i%5)) * radius;
  }

  this.angle += 0.5 * timeScalar;
  if (this.angle > 360) {
    this.angle = 0;
  }
};

/**
 * Make the mans follow a sine pattern, bro
 */
EnemyManager.prototype.sine = function(speed, centerPoint, radius) {
  var radians = (this.angle) * (Math.PI/180);

  for (var i = 0, l = this.enemies.length; i < l; i++) {
    this.enemies[i].frame.y = centerPoint + Math.sin(radians * (i + 2)) * radius;
    this.enemies[i].frame.x = centerPoint + Math.cos(radians) * radius;
  }

  this.angle += 2.3 * speed;
  if (this.angle > 360) {
    this.angle = 0;
  }
};

/**
 * Move the enemies horizontally until they hit a wall, then switch directions and move the other way
 *
 * @param Number timeScalar: The amount of time since the last frame passed (ensures smooth animations across framerates)
 * @param Object bounds: The left and right bounds of the gameplay area
 */
EnemyManager.prototype.shuffle = function(timeScalar, bounds) {
  var enemyCount = this.enemies.length;

  if (this.direction === 1) {
    var rightEnemy = this.getLastLivingEnemy();

    if (rightEnemy && rightEnemy.frame.x + rightEnemy.frame.width >= bounds.right) {
      this.direction = -1;
    }
  } else {
    var firstEnemy = this.getFirstLivingEnemy();
    if (firstEnemy && firstEnemy.frame.x <= bounds.left) {
      this.direction = 1;
    }
  }

  for (var i = 0; i < enemyCount; i++) {
    this.enemies[i].frame.x += timeScalar * this.direction;
  }
};

// Time to do stuff, bro.
EnemyManager.prototype.update = function(timeScalar) {
  var length = this.enemies.length,
      modifier = 1;

  if (this.enemies[length - 1].frame.x > 400 && modifier === 1) {
    modifier = -1;
  } else if (this.enemies[0].frame.x < 100 && modifier === -1) {
    modifier = 1;
  }

  for (var i = 0; i < length; i++) {
    this.enemies[i].frame.x += 1 * modifier * timeScalar;
  }
};

/**
 * Return the first living enemy in the enemies array
 *
 * @return Object|null: Either the first living enemy or null if all enmies are dead
 */
EnemyManager.prototype.getFirstLivingEnemy = function() {
  for (var i = 0, l = this.enemies.length; i < l; i++) {
    if (this.enemies[i].alive) {
      return this.enemies[i];
    }
  }
  return null;
};

/**
 * Return the last living enemy in the enemies array
 *
 * @return Object|null: Either the last living enemy or null if all enemies are dead
 */
EnemyManager.prototype.getLastLivingEnemy = function() {
  var enemyCount = this.enemies.length - 1;

  for (var i = enemyCount; i >= 0; i--) {
    if (this.enemies[i].alive) {
      return this.enemies[i];
    }
  }
  return null;
};