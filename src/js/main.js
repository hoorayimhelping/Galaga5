import Galaga from './game/director';
import Renderer from './engine/renderer';
import Performance from './engine/performance';

let $canvas = document.getElementById('canvas');
let $performance = document.getElementById('performance');

let renderer = new Renderer($canvas.getContext('2d'));
let performanceMonitor = new Performance($performance);

let game = new Galaga(renderer, performanceMonitor);
game.stats.shouldDisplay = true;
game.startGame();
