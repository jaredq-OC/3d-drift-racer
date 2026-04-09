import * as THREE from 'three';
import { Car } from './car';

export class FollowCamera {
  // Pre-allocated — reuse every frame, no GC pressure (RULE-07)
  private readonly _behind = new THREE.Vector3();
  private readonly _ahead = new THREE.Vector3();
  private readonly _targetLook = new THREE.Vector3();
  private readonly _lookDir = new THREE.Vector3();

  private currentFOV = 65;

  constructor(private camera: THREE.PerspectiveCamera, private car: Car) {}

  update(_dt: number, isBoosting: boolean, isDrifting: boolean, slipAngle: number) {
    const carPos = this.car.meshRef.position;
    const carQuat = this.car.meshRef.quaternion;

    // Target: 10 behind, 4 above
    this._behind.set(0, 0, -10).applyQuaternion(carQuat);
    this.camera.position.set(
      carPos.x + this._behind.x,
      carPos.y + 4,
      carPos.z + this._behind.z
    );

    // Look-at: slightly ahead of car + drift bank (5° yaw toward drift)
    this._ahead.set(0, 0.5, 5).applyQuaternion(carQuat);
    this._targetLook.copy(carPos).add(this._ahead);

    // Drift bank: rotate look-at toward drift direction
    if (isDrifting && slipAngle > 15) {
      const bankAmount = Math.min(slipAngle / 90, 1) * 5 * (Math.PI / 180);
      const bankDir = new THREE.Vector3(Math.sin(bankAmount), 0, Math.cos(bankAmount));
      bankDir.applyQuaternion(carQuat);
      this._targetLook.add(bankDir.multiplyScalar(2));
    }

    // Smooth look-at
    this.camera.getWorldDirection(this._lookDir);
    this._lookDir.lerp(
      this._targetLook.clone().sub(this.camera.position).normalize(),
      0.1
    );
    this.camera.lookAt(this.camera.position.clone().add(this._lookDir));

    // FOV: normal 65°, drift 72°, boost 80° (PRD §3.2)
    let targetFOV = 65;
    if (isBoosting) targetFOV = 80;
    else if (isDrifting) targetFOV = 72;

    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFOV, 0.1);
    this.camera.updateProjectionMatrix();
  }
}