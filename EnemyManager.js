var EnemyManager = function() {};

/**
 * @param String enemyType: The type of enemy to initialize [hank|dean|doc|brock]
 */
EnemyManager.prototype.initialize = function(enemyType, enemyCount) {
  this.enemies = [];

  if (enemyType.toLowerCase() === 'hank') {
    for (var i = 0; i < enemyCount; i++) {
      this.enemies.push(new Hank().initialize({ y: 50, x: (i + 2) * 55 }));
    }
  }

  return this;
};

// TODO: change this so that it doesn't need the change in time this deep
EnemyManager.prototype.update = function(dt) {
  var length = this.enemies.length;
  var modifier = 1;

  if (this.enemies[length - 1].frame.x > 400 && modifier === 1) {
    modifier = -1;
  } else if (this.enemies[0].frame.x < 100 && modifier === -1) {
    modifier = 1;
  }

  for (var i = 0; i < length; i++) {
    this.enemies[i].frame.x += 1 * modifier * (dt/2);
  }
};