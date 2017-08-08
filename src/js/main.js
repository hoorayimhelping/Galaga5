import Galaga from './game/director';

import Control from './engine/control';
import Renderer from './engine/renderer';
import Performance from './engine/performance';

let $canvas = document.getElementById('canvas');
let $performance = document.getElementById('performance');

let renderer = new Renderer($canvas.getContext('2d'));
let performanceMonitor = new Performance($performance);
let keyboard = new Control();

const stage = {
  height: $canvas.clientHeight,
  width: $canvas.clientWidth
};

let game = new Galaga(renderer, performanceMonitor, stage, keyboard);
game.stats.shouldDisplay = true;
game.startGame();
