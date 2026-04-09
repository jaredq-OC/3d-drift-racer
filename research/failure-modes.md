# Failure Modes — 3D Drift Racer

## Critical Failure Modes (Core Loop)

### FM-01: Drift never triggers
- **Cause:** Slip angle threshold too high, or lateral friction not reduced enough
- **Symptom:** Player steers hard but car just understeers
- **Detection:** Console log slip angle; visual inspection
- **Fix:** Reduce friction cutoff, lower slip angle threshold to 10–15°

### FM-02: Car explodes (physics body becomes NaN)
- **Cause:** Force application too high, dt too large on a lag spike
- **Symptom:** Car suddenly teleports or spins at infinite speed
- **Detection:** Check body.position.hasNaN() each frame
- **Fix:** Cap max force; clamp dt; add body wakeup() after large impulse

### FM-03: Score doesn't accumulate during drift
- **Cause:** drift_active flag not set, or score not added per frame
- **Symptom:** Score jumps to final value on drift end, not incrementally
- **Detection:** HUD score value not updating in real-time
- **Fix:** Add score += rate × dt inside drift-active branch

## Performance Failure Modes

### FM-04: FPS drops below 30 on mid-range device
- **Cause:** BloomPass too heavy, too many particles, high poly count
- **Fix:** Reduce bloom strength/pixel ratio; cap particle count; reduce shadow map

### FM-05: Memory leak on restart
- **Cause:** Not disposing old car mesh/geometry on game restart
- **Fix:** Call dispose() on all geometries/materials before recreating scene

## Input Failure Modes

### FM-06: Touch joystick doesn't appear or track touch
- **Cause:** Event listener on wrong element; touch events blocked by canvas
- **Fix:** Attach touch events to canvas; use pointer events for unified touch+mouse

### FM-07: Keyboard and touch conflict
- **Cause:** Both handlers firing simultaneously
- **Fix:** Detect active input mode; disable one when other is active

## Visual Failure Modes

### FM-08: Neon trails look flat/missing
- **Cause:** MeshBasicMaterial not bright enough; bloom threshold too high
- **Fix:** Increase bloom strength; set trail material emissiveIntensity to 2+

### FM-09: Camera shakes violently during drift
- **Cause:** Camera lerp factor too high on rotation; acceleration spike
- **Fix:** Use separate lerp factors for position (0.1) and rotation (0.05)
