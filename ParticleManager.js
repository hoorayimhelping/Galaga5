var ParticleManager = function() {};

/**
 * Initialize/Construction method - Initializes a blank particle manager
 *
 * @param Number count: The number of particles to initialize
 *
 * @return ParticleManager: Returns itself
 */
ParticleManager.prototype.initialize = function(count) {
  this.particles = [];
  this.particleCount = count;
  this.deadCount = 0;
  this.active = true;

  this.particleColors = {
    blue: { r: 77, g: 109, b: 243, a: 1 },
    yellow: { r: 255, g: 242, b: 0, a: 1 },
    red: { r: 238, g: 28, b: 36, a: 1 },
    pink: { r: 255, g: 163, b: 177, a: 1 },
    purple: { r: 111, g: 49, b: 152, a: 1 },
    green: { r: 34, g: 177, b: 76, a: 1 },
    white: { r: 255, g: 255, b: 255, a: 1}
  };

  this.gravity = .3;
  this.tolerance = 0.0009;

  return this;
};

/**
 * Create a particle explosion at origin. Sets the particles' colors, accelerations and directions
 *
 * @param Object origin: An object with x and y values representing the epicenter of the particle explosion
 * @param String type: The type of the enemy exploding
 *
 * @return ParticleManager: Returns itself
 */
ParticleManager.prototype.create = function(origin, type) {
  var colors = [];
  if (type === 'hank') {
    colors = [this.particleColors.blue, this.particleColors.red, this.particleColors.yellow];
  }
  if (type === 'dean') {
    colors = [this.particleColors.blue, this.particleColors.red, this.particleColors.pink];
  }
  if (type === 'brock') {
    colors = [this.particleColors.green, this.particleColors.yellow, this.particleColors.red];
  }
  if (type == 'player') {
    colors = [this.particleColors.white, this.particleColors.red, this.particleColors.white];
  }

  for (var i = 0; i < this.particleCount; i++) {
    var particle = new Particle();

    particle.fill = colors[Math.floor(Math.random() * 3)]
    particle.position.x = origin.x;
    particle.position.y = origin.y;
    particle.age = 0;
    particle.verticalBounces = 0;
    particle.mass = Math.max(0.8, Math.random())

    particle.angle = (360 / this.particleCount) * i;
    particle.ageRate = (Math.floor(Math.random() * 3));
    particle.ageLimit = 70.0;

    particle.acceleration.x = (Math.random() * 100) / 7;
    particle.acceleration.y = (Math.random() * 100) / 8;

    if (particle.angle >= 90 && particle.angle < 180) {
      particle.acceleration.y = -particle.acceleration.y;
    } else if (particle.angle >= 180 && particle.angle < 270) {
      particle.acceleration.y = -particle.acceleration.y;
      particle.acceleration.x = -particle.acceleration.x;
    } else if (particle.angle >= 270 && particle.angle < 360) {
      particle.acceleration.x = -particle.acceleration.x;
    }
    particle.alive = true;

    this.particles.push(particle);
  }

  return this;
}

/**
 * Update all the particles based on the time scalar
 *
 * @param Number timeScalar: Time since last frame adjusted by game engine
 */
ParticleManager.prototype.update = function(timeScalar) {
  for (var i = 0; i < this.particleCount; i++ ) {
    // if a large portion of the particles are dead, deactivate this manager
    if (this.deadCount && this.particleCount/this.deadCount > .95) { this.active = false; break; }

    if (!this.particles[i].alive) { this.deadCount++; continue; }

    var particle = this.particles[i];
    particle.acceleration.y -= this.gravity * particle.mass * timeScalar;
    particle.update(timeScalar);
  }
};