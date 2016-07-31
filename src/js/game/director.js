import keypress from 'keypress';

import { areColliding } from './physics';
import Control from './control';

export default class Galaga {
  control;
  keyboardListener;

  constructor() {
    this.timing = {
      lastFrameTime: 0,
      startTime: new Date,
      now: new Date,
      dt: 0
    };

    this.gameState = {
      paused: false
    };

    this.previousGameState = { ...this.gameState };
  }

  loadAssets = () => {
    this.keyboardListener = new keypress.Listener(window);
  };

  startGame = () => {
    this.loadAssets();
    this.bindKeyboard();

    this.gameState.paused = false;
    this.run();
  };

  update = dt => {

    if (!this.gameState.paused) {
      // update stuff
    }

    this.render(dt);
    this.previousGameState = Object.assign({}, this.gameState);
  };

  pollInput = dt => {  };

  render = dt => {
    if (this.gameState.paused) {
      console.log('paused');
    } else {
      console.log('not paused');
    }
  };

  pause = () => {
    this.gameState.paused = !this.gameState.paused;
  };

  bindKeyboard = () => {
    this.keyboardListener.simple_combo("escape", this.pause);
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
