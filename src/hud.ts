import { ScoreSystem } from './score';

export class HUD {
  private scoreEl!: HTMLElement;
  private speedEl!: HTMLElement;
  private boostFill!: HTMLElement;
  private driftCombo!: HTMLElement;
  private driftRate!: HTMLElement;

  init() {
    document.body.innerHTML += `
      <div id="hud">
        <div id="score-display">
          <div id="score-label">SCORE</div>
          <div id="score-value">0</div>
        </div>
        <div id="speed-display">
          <div id="speed-value">0</div>
          <div id="speed-unit">KM/H</div>
        </div>
        <div id="boost-bar-container">
          <div id="boost-label">BOOST</div>
          <div id="boost-bar-bg"><div id="boost-bar-fill"></div></div>
        </div>
        <div id="drift-combo">
          <div id="drift-multiplier"></div>
          <div id="drift-rate"></div>
        </div>
        <div id="restart-hint">R — RESTART</div>
      </div>
      <div id="boost-flash"></div>
      <div id="joystick-zone"></div>
      <div id="touch-restart">R</div>
    `;

    this.scoreEl = document.getElementById('score-value')!;
    this.speedEl = document.getElementById('speed-value')!;
    this.boostFill = document.getElementById('boost-bar-fill')!;
    this.driftCombo = document.getElementById('drift-combo')!;
    this.driftRate = document.getElementById('drift-rate')!;
  }

  update(score: ScoreSystem, speedKmh: number, _isTouch: boolean) {
    this.scoreEl.textContent = Math.floor(score.totalScore).toLocaleString();
    this.speedEl.textContent = String(Math.round(speedKmh * 3.6));

    this.boostFill.style.width = score.boostMeter + '%';
    this.boostFill.style.background = score.boostMeter > 80
      ? 'linear-gradient(90deg, #ff0080, #ff00aa)'
      : 'linear-gradient(90deg, #ffff00, #ff6b00)';

    if (score.driftTime > 0) {
      this.driftCombo.classList.add('active');
      this.driftCombo.textContent = `${score.multiplier}x`;
      this.driftRate.textContent = `${Math.round(score.currentDriftScore)} pts/s`;
    } else {
      this.driftCombo.classList.remove('active');
    }

    const flash = document.getElementById('boost-flash')!;
    if (score.isBoosting) {
      flash.classList.add('active');
    } else {
      flash.classList.remove('active');
    }
  }
}