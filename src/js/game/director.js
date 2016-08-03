import keypress from 'keypress';

import { areColliding } from '../engine/physics';
import { Player } from './character';

export default class Galaga {

  enemies;
  keyboardListener;
  player;
  renderer;

  constructor(renderer, performance) {
    this.renderer = renderer;
    this.performance = performance;

    this.timing = {
      lastFrameTime: 0,
      startTime: new Date,
      now: new Date,
      dt: 0
    };

    this.stats = {
      shouldDisplay: false
    };
    this.gameState = {
      paused: false
    };
  }

  loadAssets = () => {
    this.keyboardListener = new keypress.Listener(window);
    this.player = new Player();
  };

  bindKeyboard = () => {
    this.keyboardListener.simple_combo("escape", this.pause);
  };

  initializeGameState = () => {
    this.player.location.x = 100;
    this.player.location.y = 100;
  };

  startGame = () => {
    this.loadAssets();
    this.bindKeyboard();
    this.initializeGameState();

    this.gameState.paused = false;
    this.run();
  };

  update = dt => {

    if (!this.gameState.paused) {
      // update stuff
    }

    if (this.stats.shouldDisplay) {
      this.performance.update(dt, 0);
    }

    this.render(dt);
    this.previousGameState = Object.assign({}, this.gameState);
  };

  pollInput = dt => {  };

  render = dt => {
    this.renderer.render([this.player]);
  };

  pause = () => {
    this.gameState.paused = !this.gameState.paused;
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
