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

  this.gravity = .3;
  this.tolerance = 0.0009;

  return this;
};

/**
 * Create a particle explosion at origin. Sets the particles' accelerations and directions
 *
 * @param Object origin: An object with x and y values representing the epicenter of the particle explosion
 * @param Array colors: An array of colors to use as particle colors
 *
 * @return ParticleManager: Returns itself
 */
ParticleManager.prototype.create = function(origin, colors) {
  for (i = 0; i < this.particleCount; i++) {
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
    if (!this.particles[i].alive) { this.deadCount++; continue; }

    if (this.deadCount && this.particleCount/this.deadCount > .95) { this.active = false; }

    var particle = this.particles[i];
    particle.acceleration.y -= this.gravity * particle.mass * timeScalar;
    particle.update(timeScalar);
  }
};