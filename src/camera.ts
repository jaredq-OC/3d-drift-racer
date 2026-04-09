import * as THREE from 'three';
import { Car } from './car';

export class FollowCamera {
  private readonly _targetPos = new THREE.Vector3();
  private readonly _behind = new THREE.Vector3();
  private readonly _lookAt = new THREE.Vector3();

  constructor(private camera: THREE.PerspectiveCamera, private car: Car) {}

  update(_dt: number, isBoosting: boolean, isDrifting: boolean, _slipAngle: number) {
    const carPos = this.car.meshRef.position;
    const carQuat = this.car.meshRef.quaternion;

    // Simple, reliable third-person follow camera.
    this._behind.set(0, 3.2, -8.5).applyQuaternion(carQuat);
    this._targetPos.copy(carPos).add(this._behind);
    this.camera.position.lerp(this._targetPos, 0.08);

    this._lookAt.set(carPos.x, carPos.y + 0.8, carPos.z + 3.5);
    this.camera.lookAt(this._lookAt);

    let targetFOV = 65;
    if (isBoosting) targetFOV = 80;
    else if (isDrifting) targetFOV = 72;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFOV, 0.08);
    this.camera.updateProjectionMatrix();
  }
}