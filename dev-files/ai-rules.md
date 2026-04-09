# AI Rules — 3D Drift Racer

> Project ID: 3d-drift-racer  
> Grade: Personal Use  
> Generated: Pre-Dev Stage 3 (Quality Gate)

---

## Hard Constraints

### RULE-01: Input System
- **DO:** Support both keyboard (WASD/arrows) and touch (virtual joystick)
- **DO:** Normalize all inputs to a `-1..+1` steer axis and `0..1` throttle/brake axis
- **DO NOT:** Hard-code only one input type; touch must work without keyboard
- **DO NOT:** Allow both input systems to fire simultaneously; use active-mode detection

### RULE-02: Drift Physics
- **DO:** Compute slip angle as `angleBetween(velocity.direction, car.forward)` every frame
- **DO:** Trigger drift state when slip_angle > 15° AND speed > 5 m/s AND throttle > 0
- **DO:** Reduce rear wheel lateral friction to 0.1 during active drift
- **DO NOT:** Award drift score if speed < 5 m/s (prevents exploitation while stationary)
- **DO NOT:** Score drift if slip_angle > 90° (cap at 90)

### RULE-03: Score System
- **DO:** Accumulate score at `rate × dt` per frame during drift (not lump-sum on end)
- **DO:** Apply multiplier tier based on peak drift angle during the drift
- **DO:** Clamp drift angle at 90° for scoring purposes
- **DO NOT:** Reset score unless player restarts the game
- **DO NOT:** Award score when drift is not active

### RULE-04: Boost System
- **DO:** Fill boost meter at 20 pts/s during any drift (even short ones)
- **DO:** Cap boost meter at 100
- **DO:** Auto-activate boost when meter reaches 100 at drift end, OR allow manual Space key activation
- **DO:** Apply 1.5× max speed multiplier for 2 seconds on activation
- **DO NOT:** Allow boost to stack (no double-boost)
- **DO NOT:** Allow boost activation while boost is already active

### RULE-05: Rendering Pipeline
- **DO:** Use flatShading on MeshLambertMaterial for car and track
- **DO:** Use MeshBasicMaterial for neon glow elements (trails, barriers)
- **DO:** Apply UnrealBloomPass as the final post-processing step via EffectComposer
- **DO:** Cap device pixel ratio at 2 to prevent retina performance drain
- **DO NOT:** Use PBR materials (MeshStandardMaterial/MeshPhysicalMaterial) on car or track

### RULE-06: Camera
- **DO:** Use a third-person follow camera, 10 units behind and 4 units above car
- **DO:** Lerp camera position and rotation each frame (position lerp: 0.08, rotation lerp: 0.1)
- **DO:** Widen FOV to 80° during boost and hold for duration of boost
- **DO NOT:** Use orbit controls or any manual camera — camera is always auto-following

### RULE-07: Performance
- **DO:** Step physics at fixed 1/60s with maxSubSteps of 3
- **DO:** Cap particle/trail element count at 200 to prevent memory bloat
- **DO:** Dispose all geometry/material on game restart to prevent memory leaks
- **DO NOT:** Pass raw RAF delta time directly to physics step (causes instability)

### RULE-08: Track Collision
- **DO:** Use box-based static bodies for track collision (not convex hulls)
- **DO:** Position car at track start position on game restart
- **DO NOT:** Trust visual mesh to match collision mesh perfectly; use simplified collision shapes

---

## Anti-Patterns (Forbidden)

- **FORBID:** Using `new THREE.Vector3()` inside a game loop without pooling or reusing — causes GC pressure
- **FORBID:** Adding bloom glow to the entire scene (set threshold so only emissive elements bloom)
- **FORBID:** Using `cannon` (unmaintained npm package) instead of `cannon-es`
- **FORBID:** Importing from `three/examples/jsm` in Vite (must use `three/addons`)
- **FORBID:** Shipping with `console.log` statements in production (use a debug flag)
- **FORBID:** Scoring points when the car is not on the track surface (raycast to verify)
