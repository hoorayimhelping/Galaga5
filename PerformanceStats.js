var PerformanceStats = function() {};

/**
 * Initializes Performance Stats. Creates a child p element of element
 *
 * @param String onOff: 'on'|'off' default: off
 * @param HTMLElement element: The HTML Element to draw the stats into
 */
PerformanceStats.prototype.initialize = function(onOff, element) {
  this.on = onOff == 'on' ? true : false;
  this.element = element;
  this.fps = 0;
  this.elapsedTime = 0;
  this.frames = 0;

  var fpsElement = document.createElement('p');
  element.appendChild(fpsElement);

  this.draw(0, 0);

  return this;
};

/**
 * Updates the stats based on the change in milliseconds
 *
 * @param Number dt: Number of miliseconds since last frame was rendered
 * @param Number enemies: Number of enemies currently alive
 */
PerformanceStats.prototype.update = function(dt, enemies) {
  this.elapsedTime += dt;
  this.fps += 1000 / dt;
  this.frames++;

  if (this.elapsedTime >= 1000) {
    this.draw(dt, enemies);
    this.elapsedTime = 0;
    this.fps = 0;
    this.frames = 0;
  }
};

/**
 * Draws the stats to the current html element's paragraph child
 */
PerformanceStats.prototype.draw = function(dt, enemies) {
  var adjustedFPS = (this.fps / this.frames).toFixed(2);
  if (isNaN(adjustedFPS) || !isFinite(adjustedFPS)) {
    adjustedFPS = 'Calculating';
  }

  this.element.children[0].innerHTML = 'FPS: ' + adjustedFPS
  + '<br>Enemies: ' + enemies;
};