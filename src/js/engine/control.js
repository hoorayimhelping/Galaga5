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

  clearPressedKey = key => this.pressedKeys[key] = false;
  clearPressedKeys = () => Object.keys(this.pressedKeys).map(clearPressedKey);

  bindKeyboard = () => {
    window.addEventListener('keydown', event => {
      // ignore spacebar presses, so the keypress handler below can pick this event up
      if (event.which == 32) {
        this.pressedKeys['spacebar'] = true;
        return false;
      }

      // chrome handles escape strangely
      if (event.which == 27) {
        this.pressedKeys['escape'] = true;
        return false;
      }

      if (event.which == 37) {
        this.pressedKeys['leftArrow'] = true;
        return false
      }
      if (event.which == 38) {
        this.pressedKeys['upArrow'] = true;
        return false
      }
      if (event.which == 39) {
        this.pressedKeys['rightArrow'] = true;
        return false
      }
      if (event.which == 40) {
        this.pressedKeys['downArrow'] = true;
        return false
      }

      return true;
    });

    window.addEventListener('keyup', event => {
      if (event.which == 27) {
        this.pressedKeys['escape'] = false;
        return false;
      }

      if (event.which == 32) {
        this.pressedKeys['spacebar'] = false;
        return false;
      }
      if (event.which == 37) {
        this.pressedKeys['leftArrow'] = false;
        return false
      }
      if (event.which == 38) {
        this.pressedKeys['upArrow'] = false;
        return false
      }
      if (event.which == 39) {
        this.pressedKeys['rightArrow'] = false;
        return false
      }
      if (event.which == 40) {
        this.pressedKeys['downArrow'] = false;
        return false
      }

      return true;
    });
  };
};
