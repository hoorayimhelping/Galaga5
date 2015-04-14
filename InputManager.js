var InputManager = function() {};

InputManager.prototype.initialize = function(functions) {
  this.characters = {
    'leftArrow': false,
    'upArrow': false,
    'rightArrow': false,
    'downArrow': false,
    'escape': false
  };
  this.engineFunctions = functions;
  this.bindShit();

  return this;
};

/**
 * Get which keys are being pressed
 *
 * @return Object this.characters: The character object, which represents which keys are being pressed
 */
InputManager.prototype.getPressedKeys = function() {
  return this.characters;
};

/**
 * Convenience method to clear the pressed characters.
 */
InputManager.prototype.clear = function() {
  for (var character in this.characters) {
    if (this.characters.hasOwnProperty(character)) {
      this.characters[character] = false;
    }
  }
}

InputManager.prototype.bindShit = function() {
  var ret = true;

  $('body, canvas').bind('keydown', function(e) {
    // ignore spacebar presses, so the keypress handler below can pick this event up
    if (e.which == 32) { return true; }

    // chrome handles escape strangely
    if (e.which == 27) {
      this.engineFunctions.pause();
    }

    if (e.which == 37) {
      this.characters['leftArrow'] = true;
      ret = false;
    }
    if (e.which == 38) {
      this.characters['upArrow'] = true;
      ret = false;      
    }
    if (e.which == 39) {
      this.characters['rightArrow'] = true;
      ret = false;
    }
    if (e.which == 40) {
      this.characters['downArrow'] = true;
      ret = false;
    }

    return ret;
  }.bind(this)).bind('keyup', function(e) {
    if (e.which == 37) {
      this.characters['leftArrow'] = false;
      ret = false;
    }
    if (e.which == 38) {
      this.characters['upArrow'] = false;
      ret = false;
    }
    if (e.which == 39) {
      this.characters['rightArrow'] = false;
      ret = false;
    }
    if (e.which == 40) {
      this.characters['downArrow'] = false;
      ret = false;
    }
    return ret;
  }.bind(this)).bind('keypress', function(e) {
    if (e.which == 32) {
      this.engineFunctions.fire();
    }
    return false;
  }.bind(this));
};