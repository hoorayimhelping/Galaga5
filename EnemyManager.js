var EnemyManager = function() {};

/**
 * @param String enemyType: The type of enemy to initialize [hank|dean|doc|brock]
 */
EnemyManager.prototype.initialize = function(enemyType, enemyCount) {
  this.enemies = [];
  this.angle = 5;
  this.angleIncrement = 2;

  if (enemyType.toLowerCase() === 'hank') {
    for (var i = 0; i < enemyCount; i++) {
      this.enemies.push(new Hank().initialize({ y: 50, x: (i + 2) * 55 }));
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

  return this;
};

EnemyManager.prototype.initialAttack = function(timeScalar) {
  
};

/**
 * Make the mans do a cirlce I guess
 */
EnemyManager.prototype.circle = function(speed, centerPoint, radius) {
  var radians = (this.angle) * (Math.PI/180);

  for (var i = 0, l = this.enemies.length; i < l; i++) {
    this.enemies[i].frame.y = centerPoint + Math.sin(radians * i) * radius;
    this.enemies[i].frame.x = centerPoint + Math.cos(radians * (i%5)) * radius;
  }

  this.angle += 2.3 * speed;
  if (this.angle > 360) {
    this.angle = 0;
  }
};

/**
 * Pretty busted ass sine wave
 */
EnemyManager.prototype.sine = function(speed, centerPoint, radius) {
  var radians = (this.angle) * (Math.PI/180);

  for (var i = 0, l = this.enemies.length; i < l; i++) {
    this.enemies[i].frame.y = centerPoint + Math.sin(radians * i) * radius;
    this.enemies[i].frame.x = centerPoint + Math.sin(radians * i) * radius;
  }

  this.angle += 2.3 * speed;
  if (this.angle > 360) {
    this.angle = 0;
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