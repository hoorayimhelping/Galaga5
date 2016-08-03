import Galaga from './game/director';
import Renderer from './engine/renderer';
import Performance from './engine/performance';

let $canvas = document.getElementById('canvas');
let $performance = document.getElementById('performance');

let renderer = new Renderer($canvas.getContext('2d'));
let performanceMonitor = new Performance($performance);

const stage = {
  height: $canvas.clientHeight,
  width: $canvas.clientWidth
};

let game = new Galaga(renderer, performanceMonitor, stage);
game.stats.shouldDisplay = true;
game.startGame();
