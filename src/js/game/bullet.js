import { SPRITESHEET_LOCATION } from '../constants';
import { Character } from './character';


export default class Bullet extends Character {
  constructor() {
    super();

    this.alive = false;
    this.velocity = { x: 0, y: 2 };

    this.sprite = new Image();
    this.sprite.src = SPRITESHEET_LOCATION;
    this.sprite.frame = { x: 39, y: 227, width: 26, height: 46 };

    this.frame.width = this.sprite.frame.width / 3;
    this.frame.height = this.sprite.frame.height / 3;
  };

  update = units => {
    this.location.y += units;
  };
};
