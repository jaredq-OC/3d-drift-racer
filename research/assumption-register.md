# Assumption Register — 3D Drift Racer

| AS-ID | Assumption | Why | Risk if False | Validation |
|-------|-----------|-----|---------------|------------|
| AS-01 | Cannon-es RaycastVehicle supports lateral friction reduction for drift | This is the standard way to simulate tire slip in cannon-es | Drift mechanic not achievable → switch to custom force application | Dev will test slip angle at iteration 1 |
| AS-02 | UnrealBloomPass integrates cleanly with Vite + Three.js | Standard Three.js example addon | Bloom doesn't compile → use MeshBasicMaterial glow as fallback | Dev will verify build compiles |
| AS-03 | MeshToonMaterial with flatShading achieves the low-poly look | Standard Three.js material | Doesn't look stylized enough → switch to MeshLambertMaterial + flatShading | Dev will verify visual output |
| AS-04 | Touch joystick (nipplejs) works inside Vite ESM context | Common library | Touch controls fail → build custom canvas joystick | Dev will test on mobile |
| AS-05 | Single HTML file output (Vite lib mode) is the right build target | Personal Use grade | Not applicable | Not a risk for this grade |
| AS-06 | Car weight/mass values of 1500kg produce realistic feel | Industry standard for sedans | Too slow/fast → adjust during tuning phase | Dev will tune |
| AS-07 | 60fps is achievable on target device (modern desktop browser) | Target device is modern browser | FPS drops → reduce bloom quality or shadow resolution | Dev will profile |
