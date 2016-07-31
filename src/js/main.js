import Galaga from './game/director';
import Renderer from './engine/renderer';

let $canvas = document.getElementById('canvas');

let renderer = new Renderer($canvas.getContext('2d'));

let game = new Galaga(renderer);
game.startGame();
