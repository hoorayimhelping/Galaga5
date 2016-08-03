export default class PerformanceStats {
  constructor($element) {
    this.$element = $element;
    this.fps = 0;
    this.elapsedTime = 0;
    this.frames = 0;
    this.adjustedFPS = 0;

    let $fps = document.createElement('p');
    this.$element.appendChild($fps);

    this.draw(0, 0);
  };

  update = (dt, enemies) => {
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

  draw = (dt, enemies) => {
    this.adjustedFPS = (this.fps / this.frames).toFixed(2);
    if (isNaN(this.adjustedFPS) || !isFinite(this.adjustedFPS)) {
      this.adjustedFPS = 'Calculating';
    }

    this.$element.children[0].innerHTML = 'FPS: ' + this.adjustedFPS
    + '<br>Frames: ' + this.frames;
  };
};
