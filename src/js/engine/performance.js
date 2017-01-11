export default class PerformanceStats {
  constructor($element) {
    this.$element = $element;
    this.fps = 0;
    this.elapsedTime = 0;
    this.totalFrames = 0;
    this.frames = 0;
    this.adjustedFPS = 0;

    let $fps = document.createElement('p');
    this.$element.appendChild($fps);

    this.render(0);
  };

  update = dt => {
    this.elapsedTime += dt;
    this.fps += 1000 / dt;
    this.frames++;
    this.totalFrames++;
  };

  render = dt => {
    if (this.elapsedTime <= 100) {
      return;
    }

    this.adjustedFPS = (this.fps / this.frames).toFixed(2);
    if (isNaN(this.adjustedFPS) || !isFinite(this.adjustedFPS)) {
      this.adjustedFPS = 'Calculating';
    }

    this.$element.children[0].innerHTML = 'FPS: ' + this.adjustedFPS
    + '<br>Frames: ' + this.totalFrames;

    this.elapsedTime = 0;
    this.fps = 0;
    this.frames = 0;
  };
};
