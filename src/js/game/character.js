export default class Character {
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
