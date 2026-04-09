import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { World, Vec3 } from 'cannon-es';
import { Car } from './car';
import { Track } from './track';
import { InputManager } from './input';
import { ScoreSystem } from './score';
import { FollowCamera } from './camera';
import { HUD } from './hud';
import { setupRenderer } from './renderer';

export class Game {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private composer!: any;

  physicsWorld!: World;
  car!: Car;
  track!: Track;
  input!: InputManager;
  score!: ScoreSystem;
  followCam!: FollowCamera;
  hud!: HUD;

  init(canvas: HTMLCanvasElement) {
    const { renderer, scene, camera, composer } = setupRenderer(canvas);
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.composer = composer;

    // Scene is Y-up (track lies on X/Z plane, camera height is Y), so physics must also be Y-up.
    this.physicsWorld = new World({ gravity: new Vec3(0, -9.82, 0) });
    (this.physicsWorld as any).broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    (this.physicsWorld as any).solver.iterations = 10;
    (this.physicsWorld as any).defaultContactMaterial.friction = 0.3;

    this.track = new Track(this.scene, this.physicsWorld);
    this.track.build();

    this.car = new Car(this.physicsWorld, this.scene);
    this.car.build();

    this.input = new InputManager();
    this.input.init();

    this.score = new ScoreSystem();
    this.followCam = new FollowCamera(this.camera, this.car);
    this.hud = new HUD();
    this.hud.init();

    console.log('[Game] Initialized — 3D Drift Racer ready');
  }

  update(dt: number) {
    // Fixed timestep physics (RULE-07)
    const FIXED_DT = 1 / 60;
    this.physicsWorld.step(FIXED_DT, dt, 3);

    // Boost speed multiplier (RULE-04: 1.5× for 2s)
    const speedMult = this.score.boostSpeedMult;
    const rawThrottle = this.input.throttle;
    const throttle = speedMult > 1 ? Math.min(rawThrottle * speedMult, 1) : rawThrottle;

    this.car.update(dt, { throttle, brake: this.input.brake, steer: this.input.steer });
    this.followCam.update(dt, this.score.isBoosting, this.car.isDrifting, this.car.slipAngle);
    this.input.update(dt);

    const slipAngle = this.car.slipAngle;
    const speed = this.car.speed;

    if (slipAngle > 15 && speed > 5 && this.input.throttle > 0) {
      if (this.score.driftTime === 0) this.score.startDrift(slipAngle, speed);
      this.score.updateDrift(slipAngle, speed);
    } else {
      if (this.score.driftTime > 0) this.score.endDrift();
    }

    this.score.update(dt, this.input.throttle > 0 && slipAngle > 15, this.car.speed);
    this.hud.update(this.score, this.car.speed * 3.6, this.input.isTouch);

    if (this.input.restart) {
      this.car.reset();
      this.score.reset();
    }

    // Direct render for now — explicit clear to ensure the frame is committed to the canvas.
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }
}