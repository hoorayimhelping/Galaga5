export default class Control {
  constructor() {
    this.pressedKeys = {
      leftArrow: false,
      upArrow: false,
      rightArrow: false,
      downArrow: false,
      escape: false,
      spacebar: false
    };
  }

  getPressedKeys = () => this.pressedKeys;

  clearPressedKeys = () => Object.keys(this.pressedKeys).map(key => this.pressedKeys[key] = false);

  bindKeyboard = () => {
    window.addEventListener('keydown', e => {
      // ignore spacebar presses, so the keypress handler below can pick this event up
      if (e.which == 32) {
        this.pressedKeys['spacebar'] = true;
        return false;
      }

      // chrome handles escape strangely
      if (e.which == 27) {
        this.pressedKeys['escape'] = true;
        return false;
      }

      if (e.which == 37) {
        this.pressedKeys['leftArrow'] = true;
        return false
      }
      if (e.which == 38) {
        this.pressedKeys['upArrow'] = true;
        return false
      }
      if (e.which == 39) {
        this.pressedKeys['rightArrow'] = true;
        return false
      }
      if (e.which == 40) {
        this.pressedKeys['downArrow'] = true;
        return false
      }

      return true;
    });

    window.addEventListener('keyup', e => {
      if (e.which == 27) {
        this.pressedKeys['escape'] = false;
        return false;
      }

      if (e.which == 32) {
        this.pressedKeys['spacebar'] = false;
        return false;
      }
      if (e.which == 37) {
        this.pressedKeys['leftArrow'] = false;
        return false
      }
      if (e.which == 38) {
        this.pressedKeys['upArrow'] = false;
        return false
      }
      if (e.which == 39) {
        this.pressedKeys['rightArrow'] = false;
        return false
      }
      if (e.which == 40) {
        this.pressedKeys['downArrow'] = false;
        return false
      }

      return true;
    });
  };
};
