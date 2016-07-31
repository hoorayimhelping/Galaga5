import { SPRITESHEET_LOCATION } from '../constants';

export class Character {
  constructor() {
    this.frame = { width: 0, height: 0 };
    this.location = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.alive = true;
    this.sprite = {};
  };

  die = () => {
    this.alive = false;
  }
};

export class Player extends Character {
  constructor() {
    super();

    this.sprite = new Image();
    this.sprite.src = SPRITESHEET_LOCATION;
    this.sprite.frame = { x: 241, y: 46, width: 136, height: 152 };

    this.frame.width = this.sprite.frame.width / 3;
    this.frame.height = this.sprite.frame.height / 3;
  }

  render = () => {
    return {
      type: 'sprite',
      attributes: [
        this.sprite, this.sprite.frame.x, this.sprite.frame.y,
        this.sprite.frame.width, this.sprite.frame.height,
        this.location.x, this.location.y, this.frame.width, this.frame.height
      ]
    };
  }
};
