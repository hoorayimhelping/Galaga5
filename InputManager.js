var InputManager = function() {};

InputManager.prototype.initialize = function(engine) {
  this.characters = {
    'leftArrow': false,
    'upArrow': false,
    'rightArrow': false,
    'downArrow': false,
    'escape': false
  };
  this.engine = engine;
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
  var self = this,
      ret = true;

  $('body, canvas').bind('keydown', function(e) {
    // ignore spacebar presses, so the keypress handler below can pick this event up
    if (e.which == 32) { return true; }

    // chrome handles escape strangely
    if (e.which == 27) {
      self.engine.togglePause();
    }

    if (e.which == 37) {
      self.characters['leftArrow'] = true;
      ret = false;
    }
    if (e.which == 38) {
      self.characters['upArrow'] = true;
      ret = false;      
    }
    if (e.which == 39) {
      self.characters['rightArrow'] = true;
      ret = false;
    }
    if (e.which == 40) {
      self.characters['downArrow'] = true;
      ret = false;
    }

    return ret;
  }).bind('keyup', function(e) {
    if (e.which == 37) {
      self.characters['leftArrow'] = false;
      ret = false;
    }
    if (e.which == 38) {
      self.characters['upArrow'] = false;
      ret = false;
    }
    if (e.which == 39) {
      self.characters['rightArrow'] = false;
      ret = false;
    }
    if (e.which == 40) {
      self.characters['downArrow'] = false;
      ret = false;
    }
    return ret;
  }).bind('keypress', function(e) {
    if (e.which == 32) {
      self.engine.fire();
    }
    return false;
  });
};