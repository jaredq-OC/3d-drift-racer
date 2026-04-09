import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Track {
  constructor(private scene: THREE.Scene, private physicsWorld: CANNON.World) {}

  build() {
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(800, 800);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x0d0015 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.01;
    this.scene.add(groundMesh);

    // Ground physics body
    const groundBody = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
    groundBody.addShape(new CANNON.Plane());
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.physicsWorld.addBody(groundBody);

    // Track curve — closed circuit (PRD §2.4)
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(30, 0, -20),
      new THREE.Vector3(60, 0, -10),
      new THREE.Vector3(80, 0, 20),
      new THREE.Vector3(70, 0, 55),
      new THREE.Vector3(40, 0, 75),
      new THREE.Vector3(0, 0, 85),
      new THREE.Vector3(-40, 0, 75),
      new THREE.Vector3(-70, 0, 45),
      new THREE.Vector3(-75, 0, 10),
      new THREE.Vector3(-55, 0, -20),
      new THREE.Vector3(-20, 0, -25),
    ];

    const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);

    // Track surface mesh (PRD §2.4: charcoal #1a1a2e, 12-unit wide)
    const trackWidth = 12;
    const divisions = 200;
    const positions: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= divisions; i++) {
      const t = i / divisions;
      const pt = curve.getPoint(t);
      const tan = curve.getTangent(t).normalize();
      // Perpendicular right vector
      const rightX = -tan.z;
      const rightZ = tan.x;

      const leftX = pt.x - (trackWidth / 2) * rightX;
      const leftZ = pt.z - (trackWidth / 2) * rightZ;
      const rightX2 = pt.x + (trackWidth / 2) * rightX;
      const rightZ2 = pt.z + (trackWidth / 2) * rightZ;

      positions.push(leftX, 0.02, leftZ);
      positions.push(rightX2, 0.02, rightZ2);
    }

    for (let i = 0; i < divisions; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      indices.push(a, b, c, b, d, c);
    }

    const trackGeo = new THREE.BufferGeometry();
    trackGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    trackGeo.setIndex(indices);
    trackGeo.computeVertexNormals();

    const trackMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
    this.scene.add(new THREE.Mesh(trackGeo, trackMat));

    // Neon barriers — cyan (left) and magenta (right) poles + top strips
    this.buildBarriers(curve, trackWidth);

    // Box collision bodies for track walls (RULE-08: box-based, not convex)
    this.buildCollisionBodies(curve, trackWidth);
  }

  private buildBarriers(curve: THREE.CatmullRomCurve3, trackWidth: number) {
    const divisions = 80;
    const cyanMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const magentaMat = new THREE.MeshBasicMaterial({ color: 0xff00aa });

    // Ground strip lights — left (cyan) and right (magenta)
    for (const side of [-1, 1]) {
      const stripPositions: number[] = [];
      for (let i = 0; i <= divisions; i++) {
        const t = i / divisions;
        const pt = curve.getPoint(t);
        const tan = curve.getTangent(t).normalize();
        const rightX = -tan.z;
        const rightZ = tan.x;
        const edgeX = pt.x + side * (trackWidth / 2 + 0.4) * rightX;
        const edgeZ = pt.z + side * (trackWidth / 2 + 0.4) * rightZ;
        stripPositions.push(edgeX, 0.04, edgeZ);
      }

      // Build strip as line segments
      const verts: number[] = [];
      for (let i = 0; i < divisions; i++) {
        const ax = stripPositions[i * 3], ay = stripPositions[i * 3 + 1], az = stripPositions[i * 3 + 2];
        const bx = stripPositions[(i + 1) * 3], by = stripPositions[(i + 1) * 3 + 1], bz = stripPositions[(i + 1) * 3 + 2];
        // Each segment is a thin quad (0.15 wide)
        const mat = side < 0 ? cyanMat : magentaMat;

        // Segment geometry — thin box
        const midX = (ax + bx) / 2;
        const midZ = (az + bz) / 2;
        const segLen = Math.sqrt((bx - ax) ** 2 + (bz - az) ** 2);
        const segGeo = new THREE.BoxGeometry(0.15, 0.12, segLen);
        const segMesh = new THREE.Mesh(segGeo, mat);
        segMesh.position.set(midX, 0.06, midZ);
        // Rotate to align with track direction
        segMesh.rotation.y = -Math.atan2(bz - az, bx - ax);
        this.scene.add(segMesh);
      }
    }

    // Tall poles at intervals
    const poleDivisions = 40;
    for (let i = 0; i < poleDivisions; i++) {
      for (const side of [-1, 1]) {
        const t = i / poleDivisions;
        const pt = curve.getPoint(t);
        const tan = curve.getTangent(t).normalize();
        const rightX = -tan.z;
        const rightZ = tan.x;
        const baseX = pt.x + side * (trackWidth / 2 + 0.6) * rightX;
        const baseZ = pt.z + side * (trackWidth / 2 + 0.6) * rightZ;

        const poleGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1);
        const pole = new THREE.Mesh(poleGeo, side < 0 ? cyanMat : magentaMat);
        pole.position.set(baseX, 0.45, baseZ);
        this.scene.add(pole);
      }
    }
  }

  private buildCollisionBodies(curve: THREE.CatmullRomCurve3, trackWidth: number) {
    const divisions = 40;
    const halfWidth = trackWidth / 2 + 0.4;

    for (let i = 0; i < divisions; i++) {
      const t = i / divisions;
      const pt = curve.getPoint(t);
      const tan = curve.getTangent(t).normalize();

      for (const side of [-1, 1]) {
        const rightX = -tan.z;
        const rightZ = tan.x;
        const bodyX = pt.x + side * halfWidth * rightX;
        const bodyZ = pt.z + side * halfWidth * rightZ;

        const body = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
        body.addShape(new CANNON.Box(new CANNON.Vec3(0.4, 0.6, 2.5)));
        body.position.set(bodyX, 0.6, bodyZ);
        body.quaternion.setFromVectors(
          new CANNON.Vec3(0, 0, 1),
          new CANNON.Vec3(tan.x, 0, tan.z)
        );
        this.physicsWorld.addBody(body);
      }
    }
  }
}