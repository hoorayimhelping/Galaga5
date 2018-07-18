import { areColliding } from '../engine/physics';
import { Player, EnemyOne } from './character';
import Bullet from './bullet';

const left = Symbol.for('left');
const right = Symbol.for('right');

export default class Galaga {
  enemies;
  keyboard;
  player;
  renderer;
  stage

  constructor(renderer, performance, stage, keyboard) {
    this.renderer = renderer;
    this.performance = performance;
    this.stage = stage;
    this.keyboard = keyboard;

    this.enemyOnes = [];
    this.enemies = [];

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
    this.player = new Player();

    for (let i = 0; i < 8; i++) {
      this.enemyOnes.push(new EnemyOne());
    }
  };

  bindKeyboard = () => {
    this.keyboard.bindKeyboard();
  };

  initializeGameState = () => {
    this.player.location.x = (this.stage.width / 2) - (this.player.frame.width / 2);
    this.player.location.y = this.stage.height - this.player.frame.height;

    this.enemyOnes.map((enemy, i) => {
      enemy.location.x = (i + 1) * enemy.frame.width;
      enemy.location.y = enemy.frame.height;
    });

    this.gameState.bullets = [new Bullet(), new Bullet()];
    this.gameState.activeBullet = this.gameState.bullets[0];
    this.enemies = [...this.enemies, ...this.enemyOnes];
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
    if (this.gameState.paused || !this.player.alive) {
      return;
    }

    this.gameState.activeBullet = this.gameState.bullets.find(bullet => bullet.alive === false) || null;

    if (!this.gameState.activeBullet) {
      return;
    }

    this.gameState.activeBullet.location.x = this.player.location.x + (this.player.frame.width / 2) - 4;
    this.gameState.activeBullet.location.y = this.stage.height - this.player.frame.height - 15;
    this.gameState.activeBullet.spawn();
  };

  movePlayer = direction => {
    // guard for player being at the right edge and hitting right
    if (this.player.location.x <= 0 && direction === right) {
      return;
    }

    // guard for player being at the left edge and hitting left
    if (this.player.location.x >= this.stage.width - this.player.frame.width && direction === left) {
      return;
    }

    this.player.move((direction === right ? -1 : 1) * 10);
  };

  updateBullets = dt => {
    if (this.keyboard.spacebar()) {
      this.keyboard.clearPressedKey('spacebar');
      this.fireBullet();
    }

    this.gameState.bullets.forEach(bullet => {
      if (!bullet.alive) {
        return;
      }

      if (bullet.location.y + bullet.frame.height <= 0) {
        bullet.die();
        return;
      }

      bullet.update(-bullet.velocity.y * dt / 2);
    });
  };

  updatePlayer = dt => {
    if (this.keyboard.right()) {
      this.movePlayer(left);
    } else if (this.keyboard.left()) {
      this.movePlayer(right);
    }
  };

  update = dt => {
    if (!this.gameState.paused) {
      this.updateBullets(dt);
      this.updatePlayer(dt);
    }

    if (this.stats.shouldDisplay) {
      this.performance.update(dt);
    }
  };

  render = dt => {
    this.renderer.render([this.player, ...this.enemies, ...this.gameState.bullets]);

    if (this.stats.shouldDisplay) {
      this.performance.render(dt);
    }
  };

  run = () => {
    requestAnimationFrame(this.run);

    this.timing.now = new Date();
    this.timing.dt = (this.timing.now - this.timing.lastFrameTime);

    if (this.timing.dt < 160) {
      this.update(this.timing.dt);
    }
    this.render();

    this.timing.lastFrameTime = new Date();
  };
};
