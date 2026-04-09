import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { World, Vec3, Body, Box, RaycastVehicle } from 'cannon-es';

export class Car {
  private vehicle!: RaycastVehicle;
  private mesh!: THREE.Group;
  get meshRef() { return this.mesh; }
  private wheelMeshes: THREE.Mesh[] = [];
  private chassisBody!: Body;

  private _speed = 0;
  private _slipAngle = 0;
  private _isDrifting = false;
  get isDrifting() { return this._isDrifting; }

  get speed() { return this._speed; }
  get slipAngle() { return this._slipAngle; }

  private readonly MAX_FORCE = 1500;
  private readonly MAX_BRAKE = 50;
  private readonly MAX_STEER = 0.55;
  private readonly REST_FRICTION = 0.8;
  private readonly DRIFT_FRICTION = 0.1;

  // Reusable vectors — allocated once, mutated in-place (per RULE-07)
  private readonly _fwd = new THREE.Vector3();
  private readonly _velDir = new THREE.Vector3();
  private readonly _startPos = new CANNON.Vec3(0, 1.0, 0);

  constructor(private physicsWorld: World, private scene: THREE.Scene) {}

  build() {
    const chassisShape = new Box(new Vec3(0.7, 0.4, 1.1));
    this.chassisBody = new Body({ mass: 150 });
    this.chassisBody.addShape(chassisShape);
    this.chassisBody.position.copy(this._startPos);
    this.chassisBody.linearDamping = 0.15;
    this.chassisBody.angularDamping = 0.4;
    this.physicsWorld.addBody(this.chassisBody);

    this.vehicle = new RaycastVehicle({
      chassisBody: this.chassisBody,
      indexRightAxis: 0,
      indexUpAxis: 1,
      indexForwardAxis: 2,
    });

    const wheelRadius = 0.38;
    const wheelPositions = [
      { x: -0.85, y: 0, z: 1.1 },
      { x: 0.85, y: 0, z: 1.1 },
      { x: -0.85, y: 0, z: -1.1 },
      { x: 0.85, y: 0, z: -1.1 },
    ];

    for (const pos of wheelPositions) {
      this.vehicle.addWheel({
        radius: wheelRadius,
        directionLocal: new Vec3(0, -1, 0),
        axleLocal: new Vec3(-1, 0, 0),
        suspensionStiffness: 35,
        suspensionRestLength: 0.45,
        frictionSlip: 1.8,
        dampingRelaxation: 2.5,
        dampingCompression: 4,
        maxSuspensionForce: 120000,
        rollInfluence: 0.01,
        chassisConnectionPointLocal: new Vec3(pos.x, pos.y, pos.z),
        maxSuspensionTravel: 0.35,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,
      });
    }

    this.vehicle.addToWorld(this.physicsWorld);

    this.mesh = this.buildMesh();
    this.scene.add(this.mesh);
  }

  private buildMesh(): THREE.Group {
    const group = new THREE.Group();

    const orangeMat = new THREE.MeshLambertMaterial({ color: 0xff6b00, flatShading: true });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a, flatShading: true });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffdd });
    const cabinMat = new THREE.MeshLambertMaterial({ color: 0x111122, flatShading: true });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2.4), orangeMat);
    body.position.y = 0.1;
    group.add(body);

    // Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 1.1), cabinMat);
    cabin.position.set(0, 0.55, -0.2);
    group.add(cabin);

    // Front splitter
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.25), darkMat);
    splitter.position.set(0, -0.1, 1.25);
    group.add(splitter);

    // Rear wing
    for (const side of [-0.7, 0.7]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.4), orangeMat);
      wing.position.set(side, 0.55, -1.1);
      group.add(wing);
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), darkMat);
      stand.position.set(side, 0.42, -1.1);
      group.add(stand);
    }

    // Headlights
    for (const sx of [-0.55, 0.55]) {
      group.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.06), lightMat), { position: new THREE.Vector3(sx, 0.18, 1.23) }));
    }

    // Tail lights
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0022 });
    for (const sx of [-0.55, 0.55]) {
      group.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.06), tailMat), { position: new THREE.Vector3(sx, 0.18, -1.23) }));
    }

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 14);
    for (let i = 0; i < 4; i++) {
      const wm = new THREE.Mesh(wheelGeo, darkMat);
      wm.rotation.z = Math.PI / 2;
      this.wheelMeshes.push(wm);
      group.add(wm);
    }

    return group;
  }

  update(dt: number, input: { throttle: number; brake: number; steer: number }) {
    const { throttle, brake, steer } = input;

    // Rear-wheel drive
    const force = throttle * this.MAX_FORCE;
    this.vehicle.applyEngineForce(force, 2);
    this.vehicle.applyEngineForce(force, 3);

    // Brake all wheels
    this.vehicle.setBrake(brake * this.MAX_BRAKE, 0);
    this.vehicle.setBrake(brake * this.MAX_BRAKE, 1);
    this.vehicle.setBrake(brake * this.MAX_BRAKE, 2);
    this.vehicle.setBrake(brake * this.MAX_BRAKE, 3);

    // Steering on front wheels
    this.vehicle.setSteeringValue(steer * this.MAX_STEER, 0);
    this.vehicle.setSteeringValue(steer * this.MAX_STEER, 1);

    // Drift lateral friction — applied to rear wheels only
    this._isDrifting = this._slipAngle > 15 && this._speed > 5 && throttle > 0;
    const rearFriction = this._isDrifting ? this.DRIFT_FRICTION : this.REST_FRICTION;
    const frontFriction = this.REST_FRICTION;

    this.vehicle.wheelInfos[0].frictionSlip = frontFriction * 2;
    this.vehicle.wheelInfos[1].frictionSlip = frontFriction * 2;
    this.vehicle.wheelInfos[2].frictionSlip = rearFriction * 2;
    this.vehicle.wheelInfos[3].frictionSlip = rearFriction * 2;

    // Sync mesh to chassis
    const p = this.chassisBody.position;
    const q = this.chassisBody.quaternion;
    this.mesh.position.set(p.x, p.y, p.z);
    this.mesh.quaternion.set(q.x, q.y, q.z, q.w);

    // Sync wheels
    for (let i = 0; i < 4; i++) {
      const t = this.vehicle.wheelInfos[i].worldTransform;
      this.wheelMeshes[i].position.set(t.position.x, t.position.y, t.position.z);
      this.wheelMeshes[i].quaternion.set(t.quaternion.x, t.quaternion.y, t.quaternion.z, t.quaternion.w);
    }

    // Speed (m/s)
    const v = this.chassisBody.velocity;
    this._speed = Math.sqrt(v.x * v.x + v.z * v.z);

    // Slip angle — reuse vectors, no allocations per frame (RULE-07)
    this._fwd.set(0, 0, 1).applyQuaternion(this.mesh.quaternion);
    this._velDir.set(v.x, 0, v.z);
    if (this._velDir.lengthSq() > 0.001) {
      this._velDir.normalize();
      // Absolute angle, clamped to 90°
      this._slipAngle = Math.min(this._fwd.angleTo(this._velDir) * (180 / Math.PI), 90);
    }
  }

  reset() {
    this.chassisBody.position.copy(this._startPos);
    this.chassisBody.velocity.set(0, 0, 0);
    this.chassisBody.angularVelocity.set(0, 0, 0);
    this.chassisBody.quaternion.set(0, 0, 0, 1);
    this._speed = 0;
    this._slipAngle = 0;
    this._isDrifting = false;
  }
}