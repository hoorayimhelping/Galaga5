import { areColliding } from './physics';
import Control from './control';

export default class Galaga {
  constructor() {
    this.timing = {
      lastFrameTime: 0
    };

    this.control = new Control();

    this.load();
  }

  load = () => {};

  update = dt => {

  };

  run = () => {
    requestAnimationFrame(this.run);

    let now = +new Date;
    let dt = (now - this.timing.lastFrameTime);

    if (dt < 160) {
      this.update(dt)
    }

    this.timing.lastFrameTime = now;
  };
};
