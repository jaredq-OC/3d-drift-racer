import nipplejs from 'nipplejs';

export class InputManager {
  throttle = 0;
  brake = 0;
  steer = 0;
  boost = false;
  isTouch = false;
  restart = false;

  private keys: Record<string, boolean> = {};
  private nipple?: ReturnType<typeof nipplejs.create>;

  init() {
    window.addEventListener('keydown', e => { this.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', e => { this.keys[e.key.toLowerCase()] = false; });
    window.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'r') this.restart = true; });

    const zone = document.getElementById('joystick-zone') as HTMLElement;
    if (zone) {
      try {
        this.nipple = nipplejs.create({ zone, mode: 'dynamic', position: { left: '25%', top: '50%' } });
        (this.nipple as any).on('move', (_ev: any, data: any) => {
          this.isTouch = true;
          this.steer = data.vector.x;
          this.throttle = Math.max(0, -data.vector.y);
          this.brake = Math.max(0, data.vector.y);
        });
        this.nipple.on('end', () => { this.steer = 0; this.throttle = 0; this.brake = 0; });
        zone.style.display = 'block';
      } catch (e) {
        console.warn('[Input] nipplejs unavailable:', e);
      }
    }

    const restartBtn = document.getElementById('touch-restart');
    if (restartBtn) {
      restartBtn.style.display = 'flex';
      restartBtn.addEventListener('click', () => { this.restart = true; });
    }
  }

  update(_dt: number) {
    const k = this.keys;
    this.throttle = (k['w'] || k['arrowup']) ? 1 : 0;
    this.brake = (k['s'] || k['arrowdown']) ? 1 : 0;
    this.boost = !!(k[' '] || k['space']);

    const leftKey = (k['a'] || k['arrowleft']) ? 1 : 0;
    const rightKey = (k['d'] || k['arrowright']) ? 1 : 0;
    this.steer = rightKey - leftKey;

    // Clear one-shot signals
    this.restart = false;
  }
}