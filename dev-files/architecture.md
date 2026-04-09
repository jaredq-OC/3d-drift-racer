# Architecture — 3D Drift Racer

> Project ID: 3d-drift-racer  
> Grade: Personal Use  
> Generated: Pre-Dev Stage 3 (Quality Gate)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   index.html                     │
│  (or Vite dev server /dist output)              │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │      Game Manager        │
    │  (orchestrates lifecycle)│
    └────────────┬────────────┘
                 │
  ┌──────────────┼──────────────────┐
  │              │                  │
 ▼              ▼                  ▼
InputManager  PhysicsWorld    SceneManager
  │              │                  │
  │         CannonES             Three.js
  │         RaycastVehicle         │
  │                                  │
  └──────────┬───────────────────────┘
             │
    ┌────────▼────────┐
    │  DriftDetector  │──▶ ScoreSystem
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │   CameraCtrl    │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │    HUDRenderer │
    └─────────────────┘
```

---

## DEC-01: Stack Selection
**Decision:** Three.js r160 + cannon-es + Vite 5
**Rationale:** cannon-es is the maintained ESM fork of cannon.js (EV-04). Vite provides zero-config ESM bundling (EV-06). This is the standard stack for browser-based 3D physics games in 2024+.

---

## DEC-02: Physics Architecture
**Decision:** cannon-es RaycastVehicle with reduced lateral friction for drift
- 4-wheel RaycastVehicle with adjustable per-wheel friction
- Rear wheel lateral friction: 0.1 during drift (normally 0.8)
- Front wheel lateral friction: 0.5 (always higher — front wheels steer)
- Fixed timestep: 1/60s, maxSubSteps: 3
- Slip angle computed as: `angle(velocity, carHeading)` each frame

---

## DEC-03: Track Architecture
**Decision:** Procedural CatmullRomCurve3 → extruded ribbon + box collision segments
- Track path defined by ~12 control points (hand-tuned for interesting drift lines)
- Extruded using THREE.ExtrudeGeometry from a 12-unit-wide Shape
- Collision: array of box bodies (one per track segment) — simpler than convex hull
- Static bodies (mass: 0)

---

## DEC-04: Scoring Architecture
**Decision:** In-memory state machine: `idle → drifting → scoring_end`
- `drift_state = { active, startTime, angle, cumulativeScore, boostMeter }`
- Score accumulates per-frame at `score_rate × dt`
- Boost meter fills at 20 pts/s; caps at 100

---

## DEC-05: Boost Architecture
**Decision:** Temporary speed multiplier + FOV snap
- Max speed multiplier: 1.5× for 2 seconds
- Camera FOV: 65° → 80° (lerped)
- Boost consumed immediately on activation; meter resets to 0

---

## DEC-06: Car Mesh Architecture
**Decision:** Procedural low-poly from BoxGeometry primitives
- Body: BoxGeometry(2, 0.6, 4) — 2 wide, 0.6 tall, 4 long
- Wheels: 4× CylinderGeometry(0.4, 0.4, 0.3, 8) — 8-sided cylinders
- No external model file required

---

## DEC-07: Neon Glow Architecture
**Decision:** MeshBasicMaterial + UnrealBloomPass
- All neon elements (trails, barriers) use MeshBasicMaterial
- UnrealBloomPass: threshold 0.8, strength 1.5, radius 0.5
- Applied via EffectComposer after scene render

---

## DEC-08: Camera Architecture
**Decision:** Programmatic follow camera with drift-aware dynamics
- Position target: `car.position + (-car.forward × 10) + (0, 4, 0)`
- Rotation target: look-at car with drift yaw offset
- FOV lerp: 0.1/frame toward target FOV
- Position lerp: 0.08/frame

---

## Data Model

```
GameState {
  phase: 'idle' | 'playing' | 'paused'
  score: number
  highScore: number
  drift: DriftState
  boost: BoostState
  car: CarState
}

DriftState {
  active: boolean
  startTime: number
  duration: number
  peakAngle: number
  boostMeter: number  // 0-100
}

CarState {
  position: Vec3
  velocity: Vec3
  heading: number  // radians
  speed: number    // m/s
  steerAngle: number
}
```

---

## Error Handling

- **Physics explosion (NaN):** Detect via `body.position.isNaN()`, reset car to track start
- **WebGL unavailable:** Show full-screen error message with browser upgrade suggestion
- **FPS drop:** Monitor via RAF timestamp delta; if avg < 30fps for 2s, reduce bloom quality
