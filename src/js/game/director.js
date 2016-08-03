import keypress from 'keypress';

import { areColliding } from '../engine/physics';
import { Player } from './character';
import Bullet from './bullet';

export default class Galaga {

  enemies;
  keyboardListener;
  player;
  renderer;
  stage

  constructor(renderer, performance, stage) {
    this.renderer = renderer;
    this.performance = performance;
    this.stage = stage;

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
      paused: false,
      bullets: [],
      activeBullet: null
    };
  }

  loadAssets = () => {
    this.keyboardListener = new keypress.Listener(window);
    this.player = new Player();
  };

  bindKeyboard = () => {
    this.keyboardListener.simple_combo("escape", this.togglePause);
    this.keyboardListener.simple_combo("space", this.fireBullet);
  };

  initializeGameState = () => {
    this.player.location.x = (this.stage.width / 2) - (this.player.frame.width / 2);
    this.player.location.y = this.stage.height - this.player.frame.height;

    this.gameState.bullets = [new Bullet(), new Bullet()];
    this.gameState.activeBullet = this.gameState.bullets[0];
  };

  startGame = () => {
    this.loadAssets();
    this.bindKeyboard();
    this.initializeGameState();

    this.gameState.paused = false;
    this.run();
  };

  togglePause = () => {
    this.gameState.paused = !this.gameState.paused;
  };

  fireBullet = () => {
    if (this.gameState.paused || !this.player.alive) { return; }

    this.gameState.activeBullet = this.gameState.bullets.find(bullet => bullet.alive === false) || null;

    if (!this.gameState.activeBullet) { return; }

    this.gameState.activeBullet.location.x = this.player.location.x + (this.player.frame.width / 2) - 4;
    this.gameState.activeBullet.location.y = this.stage.height - this.player.frame.height - 15;
    this.gameState.activeBullet.spawn();
  };

  update = dt => {
    if (!this.gameState.paused) {
      this.gameState.bullets.map(bullet => {
        if (bullet.location.y + bullet.frame.height <= 0) {
          bullet.die();
          return;
        }
        bullet.update(-bullet.velocity.y * dt / 2);
      });
    }

    if (this.stats.shouldDisplay) {
      this.performance.update(dt);
    }

    this.render(dt);
    this.previousGameState = Object.assign({}, this.gameState);
  };

  render = dt => {
    this.renderer.render([this.player, ...this.gameState.bullets]);

    if (this.stats.shouldDisplay) {
      this.performance.render(dt);
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
