/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _director = __webpack_require__(1);
	
	var _director2 = _interopRequireDefault(_director);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var game = new _director2.default();
	game.startGame();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _physics = __webpack_require__(2);
	
	var _control = __webpack_require__(3);
	
	var _control2 = _interopRequireDefault(_control);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Galaga = function Galaga() {
	  var _this = this;
	
	  _classCallCheck(this, Galaga);
	
	  this.load = function () {
	    console.log('loading');
	  };
	
	  this.startGame = function () {
	    _this.load();
	
	    _this.gameState.paused = false;
	    _this.run();
	  };
	
	  this.update = function (dt) {
	    _this.pollInput(dt);
	
	    if (!_this.gameState.paused) {
	      // update stuff
	    }
	
	    _this.render(dt);
	  };
	
	  this.pollInput = function (dt) {
	    _this.gameState.pressedKeys = _this.control.getPressedKeys();
	
	    Object.keys(_this.gameState.pressedKeys).map(function (key) {
	      if (key === 'escape') {
	        if (_this.gameState.pressedKeys[key]) {
	          _this.gameState.paused = !_this.gameState.paused;
	        }
	      }
	    });
	  };
	
	  this.render = function (dt) {
	    if (_this.gameState.paused) {
	      console.log('paused');
	    } else {
	      console.log('not paused');
	    }
	  };
	
	  this.run = function () {
	    requestAnimationFrame(_this.run);
	
	    _this.timing.now = new Date();
	    _this.timing.dt = _this.timing.now - _this.timing.lastFrameTime;
	
	    if (_this.timing.dt < 160) {
	      _this.update(_this.timing.dt);
	    }
	
	    _this.timing.lastFrameTime = _this.timing.now;
	  };
	
	  this.timing = {
	    lastFrameTime: 0,
	    startTime: new Date(),
	    now: new Date(),
	    dt: 0
	  };
	
	  this.control = new _control2.default();
	
	  this.gameState = {
	    paused: false,
	    pressedKeys: this.control.getPressedKeys()
	  };
	};
	
	exports.default = Galaga;
	;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* If the following evaluates to true, the two rectangles are not colliding
	 * (first.bottom < second.top) || (first.top > second.bottom) ||
	 * (first.left > second.right) || (first.right < second.left)
	 */
	var areColliding = exports.areColliding = function areColliding(first, second) {
	  return !(first.frame.height + first.frame.y < second.frame.y || first.frame.y > second.frame.height + second.frame.y || first.frame.x > second.frame.x + second.frame.width || first.frame.x + first.frame.width < second.frame.x);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Control = function Control() {
	  var _this = this;
	
	  _classCallCheck(this, Control);
	
	  this.getPressedKeys = function () {
	    return _this.pressedKeys;
	  };
	
	  this.clearPressedKeys = function () {
	    return Object.keys(_this.pressedKeys).map(function (pressedKey) {
	      return _this.pressedKeys[pressedKey] = false;
	    });
	  };
	
	  this.bindKeyboard = function () {
	    window.addEventListener('keydown', function (e) {
	      // ignore spacebar presses, so the keypress handler below can pick this event up
	      if (e.which == 32) {
	        return true;
	      }
	
	      // chrome handles escape strangely
	      if (e.which == 27) {
	        _this.pressedKeys['escape'] = true;
	        return false;
	      }
	
	      if (e.which == 37) {
	        _this.pressedKeys['leftArrow'] = true;
	        return false;
	      }
	      if (e.which == 38) {
	        _this.pressedKeys['upArrow'] = true;
	        return false;
	      }
	      if (e.which == 39) {
	        _this.pressedKeys['rightArrow'] = true;
	        return false;
	      }
	      if (e.which == 40) {
	        _this.pressedKeys['downArrow'] = true;
	        return false;
	      }
	
	      return true;
	    });
	
	    window.addEventListener('keyup', function (e) {
	      if (e.which == 27) {
	        _this.pressedKeys['escape'] = false;
	        return false;
	      }
	
	      if (e.which == 32) {
	        _this.pressedKeys['spacebar'] = false;
	        return false;
	      }
	      if (e.which == 37) {
	        _this.pressedKeys['leftArrow'] = false;
	        return false;
	      }
	      if (e.which == 38) {
	        _this.pressedKeys['upArrow'] = false;
	        return false;
	      }
	      if (e.which == 39) {
	        _this.pressedKeys['rightArrow'] = false;
	        return false;
	      }
	      if (e.which == 40) {
	        _this.pressedKeys['downArrow'] = false;
	        return false;
	      }
	
	      return true;
	    });
	
	    window.addEventListener('keypress', function (e) {
	      if (e.which == 32) {
	        _this.pressedKeys['spacebar'] = true;
	        // should fire
	      }
	      return false;
	    });
	  };
	
	  this.pressedKeys = {
	    leftArrow: false,
	    upArrow: false,
	    rightArrow: false,
	    downArrow: false,
	    escape: false,
	    spacebar: false
	  };
	  this.bindKeyboard();
	};
	
	exports.default = Control;
	;

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map