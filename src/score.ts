export class ScoreSystem {
  driftTime = 0;
  totalScore = 0;
  multiplier = 1;
  isBoosting = false;
  boostMeter = 0;
  currentDriftScore = 0;

  private readonly BOOST_FILL_RATE = 20;
  private readonly BOOST_THRESHOLD = 100;
  private readonly BOOST_DURATION = 2;
  private readonly BOOST_SPEED_MULT = 1.5;

  private boostTimer = 0;
  private driftStartTime = 0;

  startDrift(slipAngle: number, _speed: number) {
    this.driftStartTime = performance.now();
    this.currentDriftScore = 0;
    this.multiplier = this.getMultiplier(slipAngle);
  }

  updateDrift(slipAngle: number, speed: number) {
    const dt = 1 / 60;
    const rate = this.calculateRate(slipAngle, speed);
    this.currentDriftScore += rate * dt;
    this.driftTime = (performance.now() - this.driftStartTime) / 1000;

    const tier = Math.floor(this.driftTime / 0.5);
    this.multiplier = Math.min(this.getMultiplier(slipAngle) + tier, 8);
    this.boostMeter = Math.min(100, this.boostMeter + this.BOOST_FILL_RATE * dt);

    if (this.boostMeter >= this.BOOST_THRESHOLD && !this.isBoosting) {
      this.activateBoost();
    }
  }

  endDrift() {
    this.totalScore += Math.floor(this.currentDriftScore);
    this.currentDriftScore = 0;
    this.driftTime = 0;
    this.multiplier = 1;
  }

  activateBoost() {
    this.isBoosting = true;
    this.boostTimer = this.BOOST_DURATION;
    this.boostMeter = 0;
  }

  update(dt: number, isDrifting: boolean, _speed: number) {
    if (isDrifting) {
      this.boostMeter = Math.min(100, this.boostMeter + this.BOOST_FILL_RATE * dt);
    }
    if (this.isBoosting) {
      this.boostTimer -= dt;
      if (this.boostTimer <= 0) this.isBoosting = false;
    }
  }

  private calculateRate(slipAngle: number, speed: number): number {
    const angleFactor = Math.min(slipAngle, 90) / 90;
    const speedFactor = Math.min(speed / 30, 1);
    return this.multiplier * angleFactor * speedFactor * 100;
  }

  private getMultiplier(slipAngle: number): number {
    if (slipAngle >= 60) return 8;
    if (slipAngle >= 30) return 4;
    if (slipAngle >= 15) return 2;
    return 1;
  }

  get boostSpeedMult() { return this.isBoosting ? this.BOOST_SPEED_MULT : 1; }
  get boostFOV() { return this.isBoosting ? 80 : 65; }

  reset() {
    this.totalScore = 0;
    this.multiplier = 1;
    this.driftTime = 0;
    this.boostMeter = 0;
    this.isBoosting = false;
    this.boostTimer = 0;
    this.currentDriftScore = 0;
    this.driftStartTime = 0;
  }
}