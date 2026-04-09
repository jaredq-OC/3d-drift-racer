# Gotchas — 3D Drift Racer

## Cannon-es Gotchas

1. **cannon.js vs cannon-es:** The npm package `cannon` is unmaintained (last update ~2015). Use `cannon-es` (ES module fork, actively maintained by pmndrs).
2. **RaycastVehicle not in default build:** RaycastVehicle is in cannon-es but must be imported explicitly. Default CANNON global build may not include it.
3. **Fixed timestep required:** Physics will explode if you don't step with a fixed dt (1/60) and maxSubSteps (3). Never pass real frame dt directly.
4. **Body.sync() doesn't work:** You must manually copy `body.position` and `body.quaternion` to your Three.js mesh each frame.
5. **Gravity units:** Cannon uses SI (m/s²). Set gravity to (0, 0, -9.82) not arbitrary values.

## Three.js Gotchas

1. **UnrealBloomPass is in examples/jsm:** Not in the main three module; must be imported from `three/addons/postprocessing/`.
2. **EffectComposer order matters:** Add passes in order: RenderPass → UnrealBloomPass → OutputPass.
3. **flatShading on MeshToonMaterial:** May require `geometry.computeVertexNormals()` before material application.
4. **Pixel ratio:** Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to avoid retina performance tax.
5. **dispose() textures:** In single-page game, not critical. But if game is extended, always dispose geometry/material/textures.

## Vite Gotchas

1. **Import path for three addons:** Use `three/addons/path` not `three/examples/jsm/path` in Vite.
2. **cannon-es ESM:** Use named imports `import * as CANNON from 'cannon-es'` not default import.

## Drift Physics Gotchas

1. **Slip angle > 90°:** Cap slip angle at 90° to prevent score exploits.
2. **Drift while stationary:** Don't score drift until speed > minimum threshold (e.g., 5 m/s).
3. **Counter-steer detection:** Need to detect player is actively steering, not just sliding passively.
4. **Boost while airborne:** Boost should be disabled when car is not on track surface.
