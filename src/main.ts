// @ts-ignore — CSS module
import './style.css';
import { Game } from './game';

const canvas = document.createElement('canvas');
document.getElementById('app')!.appendChild(canvas);

const game = new Game();

game.init(canvas);
window.addEventListener('resize', () => game.resize());

let lastTime = performance.now();
function loop() {
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  game.update(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);