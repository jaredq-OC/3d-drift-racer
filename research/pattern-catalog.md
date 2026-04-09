# Pattern Catalog — 3D Drift Racer

## P0 Feature Patterns

### RQ-03/04: 3D Rendering + Physics Engine

**Chosen:** Three.js (r160+) + cannon-es (ES module fork of Cannon.js)
- Three.js: de-facto standard for web 3D; excellent Three.js ecosystem
- cannon-es: maintained ES module fork of Cannon.js; better npm compatibility than original cannon.js
- Rapier rejected: younger ecosystem, less drift-specific community examples, heavier WASM payload for marginal gain in this use case
- Bundle: Vite for zero-config ESM bundling with hot reload

**Pattern:** Three.js scene (Scene, PerspectiveCamera, WebGLRenderer) + cannon-es World stepped at fixed 60Hz + visual mesh synced to physics body each frame

### RQ-01/04: Car Control + Drift Mechanics

**Chosen:** Raycast vehicle model via cannon-es RaycastVehicle
- cannon-es has built-in RaycastVehicle with suspension, friction, steer applied per wheel
- Drift detection: slip angle = angle(velocity_direction, car_heading_direction); threshold ~15°
- Drift state: ON when slip_angle > threshold AND throttle/deconstruct active
- Drift physics: reduce lateral friction on rear wheels to simulate tire slip
- Steering: front wheel angle + counter-steer assist to maintain drift

**Rejected alternatives:**
- Pure rigid body + manual force application: too much custom physics tuning required
- Ammo.js: heavier, less maintained, no clear advantage here

### RQ-05: Racetrack Environment

**Chosen:** Procedural track mesh from CatmullRomCurve3 path + extruded shape
- Track shape defined by control points → closed spline → extruded ribbon mesh
- Static collision body: ConvexPolyhedron or multiple Box shapes approximating track
- Track barriers: visual-only neon strips at edges; physics walls optional for P0

**Rejected alternatives:**
- GLTF track import: adds build step, external asset dependency
- Procedural infinite runner style: not a racing game

### RQ-06/07: Drift Scoring

**Pattern:** 
- drift_score = drift_angle_degrees × drift_duration_seconds × base_multiplier
- Multiplier tiers: angle >30° = 2x, >60° = 4x, >90° = 8x
- Score accumulates in real-time during drift; committed on drift end
- Visual: score popup floats above car during drift

### RQ-08: Speed Boost Reward

**Pattern:**
- Boost meter: 0–100; fills proportionally to drift duration and angle
- Threshold: minimum 2 seconds sustained drift to start filling boost
- Activation: automatic on drift end, OR tap/boost key to activate manually
- Effect: +50% max speed for 2 seconds; camera FOV widens temporarily
- Visual: car trail intensifies, particle burst on activation

### RQ-09/10/11: Low-Poly + Neon Visual Style

**Pattern:**
- Car mesh: procedurally built from BoxGeometry primitives (body + wheels)
- Flat shading: MeshLambertMaterial with flatShading: true; or MeshToonMaterial
- Vibrant colors: saturated HSV palette — hot pink, electric blue, lime, orange
- Neon: MeshBasicMaterial (emissive, not affected by scene lighting) for trails and accents
- Post-processing: UnrealBloomPass from Three.js examples for bloom/glow on emissive materials
- Camera: PerspectiveCamera with dynamic FOV (65° normal → 80° during drift/boost)

### RQ-12: Dynamic Camera

**Pattern:**
- Base: smooth follow camera, offset behind and above car
- Drift response: camera rotates slightly toward drift direction (bank angle simulation)
- Boost response: camera FOV expands from 65° to 80°, slight forward pull
- Smoothing: lerp all camera params with factor 0.05–0.1 per frame

---

## Evidence Records

EV-01: cannon-es docs (pmndrs/cannon-es) — lightweight physics, ES module, RaycastVehicle support
EV-02: Three.js r160 — MeshToonMaterial + flatShading for stylized low-poly look
EV-03: Three.js examples — UnrealBloomPass for neon glow post-processing
EV-04: schteppe/cannon.js GitHub — maintained fork is cannon-es; original is unmaintained
