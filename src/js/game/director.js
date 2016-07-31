import { areColliding } from './physics';
import Control from './control';

export default class Galaga {
  constructor() {
    this.timing = {
      lastFrameTime: 0,
      startTime: new Date,
      now: new Date,
      dt: 0
    };

    this.control = new Control();

    this.gameState = {
      paused: false,
      pressedKeys: this.control.getPressedKeys()
    };
  }

  load = () => {
    console.log('loading')
  };

  startGame = () => {
    this.load();

    this.gameState.paused = false;
    this.run();
  };

  update = dt => {
    this.pollInput(dt);

    if (!this.gameState.paused) {
      // update stuff
    }

    this.render(dt);
  };

  pollInput = dt => {
    this.gameState.pressedKeys = this.control.getPressedKeys();

    Object.keys(this.gameState.pressedKeys).map(key => {
      if (key === 'escape') {
        if (this.gameState.pressedKeys[key]) {
          this.gameState.paused = !this.gameState.paused;
        }
      }
    });
  };

  render = dt => {
    if (this.gameState.paused) {
      console.log('paused');
    } else {
      console.log('not paused');
    }
  };

  run = () => {
    requestAnimationFrame(this.run);

    this.timing.now = new Date;
    this.timing.dt = (this.timing.now - this.timing.lastFrameTime);

    if (this.timing.dt < 160) {
      this.update(this.timing.dt);
    }

    this.timing.lastFrameTime = this.timing.now;
  };
};
