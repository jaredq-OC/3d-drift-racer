# Plan — 3D Drift Racer

> Project ID: 3d-drift-racer  
> Grade: Personal Use  
> Generated: Pre-Dev Stage 3 (Quality Gate)

---

## Build Order

### Phase 1: Foundation

#### TASK-01: Project Setup
- [ ] Initialize Vite + vanilla TypeScript project
- [ ] Install: `three`, `cannon-es`, `nipplejs`, `@types/three`
- [ ] Verify all packages import correctly (no ESM/CJS conflicts)
- [ ] Create `index.html` shell with full-viewport canvas
- [ ] Verify WebGL context initializes without error

#### TASK-02: Physics World + Car
- [ ] Set up cannon-es World with gravity (0, 0, -9.82)
- [ ] Create RaycastVehicle with 4 wheels (suspension + friction)
- [ ] Apply throttle/brake forces via `vehicle.applyEngineForce()` and `vehicle.setBrake()`
- [ ] Apply steering via `vehicle.setSteeringValue()`
- [ ] Verify car drives forward/backward and steers
- [ ] Sync Three.js mesh to physics body each frame

#### TASK-03: Track Generation
- [ ] Define ~12 CatmullRomCurve3 control points for closed loop
- [ ] Generate ExtrudeGeometry from spline (12-unit track width)
- [ ] Create array of box-based static collision bodies along track path
- [ ] Add neon barrier strips (MeshBasicMaterial, cyan/magenta)
- [ ] Verify car stays on track; test corners

### Phase 2: Core Drift Loop

#### TASK-04: Drift Detection + Scoring
- [ ] Compute slip angle each frame: `angle(velocity, car.forward)`
- [ ] Implement drift state machine: idle → drifting → scoring_end
- [ ] Implement score accumulation: `score += rate × dt`
- [ ] Implement multiplier tiers (2×/4×/8× based on angle)
- [ ] Add drift combo text HUD (appears center screen during drift)
- [ ] Verify score increments in real-time; clamp at 90°

#### TASK-05: Boost System
- [ ] Add boost meter state (0–100)
- [ ] Fill meter at 20 pts/s during any drift
- [ ] Implement boost activation (auto + Space key)
- [ ] Apply 1.5× max speed multiplier for 2 seconds
- [ ] Camera FOV snap to 80° on boost, lerp back
- [ ] Reset meter on boost consumption

### Phase 3: Visuals

#### TASK-06: Low-Poly Car Mesh
- [ ] Build car from BoxGeometry (body) + 4× CylinderGeometry (wheels)
- [ ] Apply MeshLambertMaterial with flatShading: true
- [ ] Vibrant orange body, dark wheels
- [ ] Parent wheels to car group for easy rotation
- [ ] Rotate wheels to match physics wheel rotation

#### TASK-07: Neon Visual Effects
- [ ] UnrealBloomPass via EffectComposer (threshold 0.8, strength 1.5, radius 0.5)
- [ ] Tire trails: Line geometry using MeshBasicMaterial (pink)
- [ ] Track barriers: cyan + magenta MeshBasicMaterial strips
- [ ] Boost activation particle burst (simple sphere particles or sprite)
- [ ] Verify bloom only affects emissive/neon elements (not whole scene)

#### TASK-08: Dynamic Camera
- [ ] Third-person follow camera (10 behind, 4 above)
- [ ] Camera lerp position (0.08) and rotation (0.1) per frame
- [ ] FOV widening on boost (65° → 80°)
- [ ] Drift camera bank (5° yaw toward drift direction)
- [ ] Tune all lerp factors for smooth, non-jerky motion

### Phase 4: HUD + Polish

#### TASK-09: HUD Overlay
- [ ] Score display: top-left, Orbitron font, large
- [ ] Speed indicator: top-right, km/h
- [ ] Boost meter: bottom-center, horizontal bar (yellow → red)
- [ ] Drift combo text: center, appears during drift, fades on end
- [ ] Style: dark semi-transparent backgrounds, neon glow text-shadow

#### TASK-10: Input Polish
- [ ] Keyboard: WASD + arrows + Space
- [ ] Touch: nipplejs virtual joystick on left half of screen
- [ ] Input mode detection (touch vs keyboard)
- [ ] Restart: R key or tap-restart button

#### TASK-11: Performance + Error Safety
- [ ] FPS counter (hidden in production)
- [ ] Physics NaN detection → auto-reset to start
- [ ] WebGL unavailable graceful error message
- [ ] Dispose all geometry/material on restart
- [ ] Cap pixel ratio at 2

### Phase 5: Validation

#### TEST-01: Controls + Track
- Car responds to keyboard WASD within 1 frame
- Car stays on track through all corners
- Car resets to start on R key press

#### TEST-02: Drift Physics
- Drift triggers within 0.5s of hard steering at speed
- Slip angle > 15° persists during drift
- Rear wheel lateral friction visibly reduced (car slides)

#### TEST-03: Scoring
- Score increments in real-time during drift
- Score final value matches expected formula
- Multiplier tier changes visible in HUD text

#### TEST-04: Boost
- Boost meter fills after 5s of continuous drift
- Boost activates and increases speed noticeably
- Camera FOV widens during boost

#### TEST-05: Visuals
- Car and track are visibly low-poly (flat shading)
- Neon barriers glow with bloom effect
- Tire trails appear during drift and are neon-colored

#### TEST-06: Camera
- Camera follows car smoothly without jarring
- Camera FOV changes noticeably on boost
- No camera clipping through track walls

#### TEST-07: Performance
- Page loads < 3s on modern browser
- Stable 60fps (no continuous frame drops below 50fps for >2s)

---

## Deferred Items

| DEFER-ID | Item | Phase |
|----------|------|-------|
| DEFER-01 | Custom lateral friction curve per drift phase | v2 |
| DEFER-02 | Audio/music | v2 |
| DEFER-03 | Multiple tracks | v2 |
| DEFER-04 | Persistent high score | v2 |
| DEFER-05 | Shadow quality settings | v2 |
| DEFER-06 | Manual touch boost button | v2 |
| DEFER-07 | Advanced track geometry details | v2 |

---

## Blocker

- **BLOCKER-01:** None at start — all P0 dependencies are npm-installable

---

## Spike

- **SPIKE-01:** If RaycastVehicle lateral friction control doesn't produce convincing drift feel in TASK-02, spike custom force-based drift immediately before proceeding to TASK-04
