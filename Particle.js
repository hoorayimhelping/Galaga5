var Particle = function() {
  this.position = { x: 0, y: 0 };
  this.velocity = { x: 0, y: 0 };
  this.acceleration = { x: 1, y: 1 };
  this.fill = { r: 0, g: 0, b: 0, a: 1.0 };
  this.alive = false;
  this.radius = 2;

  this.angle = 0.0;
  this.mass = 1;
  this.age = 1;
  this.ageRate = 1;
};

/**
 * Update the particle's position and age
 *
 * @param Number scalar: The number to shift animation by (represents time elapsed since last frame)
 */
Particle.prototype.update = function(scalar) {
  if (this.age > this.ageLimit) { this.alive = false; return; }
  this.position.x -= (this.velocity.x + this.acceleration.x) * scalar;
  this.position.y -= (this.velocity.y + this.acceleration.y) * scalar;
  this.age += this.ageRate * scalar;
};

Particle.prototype.die = function() {
	this.alive = false;
};

Particle.prototype.spawn = function() {
	this.alive = true;
	this.age = 0;
};

Particle.prototype.getFillStyle = function() {
	return 'rgba(' + this.fill.r + ', ' + this.fill.g + ', ' + this.fill.b + ', ' + this.fill.a + ')';
}