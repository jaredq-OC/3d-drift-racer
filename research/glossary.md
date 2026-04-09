# Glossary — 3D Drift Racer

## Actors
- **Player** — single human user interacting via keyboard or touch

## Systems
- **Three.js** — WebGL 3D rendering engine (renderer, scene, camera, meshes)
- **Physics Engine** — Cannon.js or Rapier for rigid body physics and drift simulation
- **Game Loop** — fixed-timestep update/render cycle (60fps target)
- **HUD** — heads-up display showing score, boost meter, speed
- **Camera System** — dynamic follow camera with drift-aware offset

## Data Objects
- **Car** — player-controlled vehicle; rigid body + visual mesh
- **Track** — race circuit; static collision mesh + visual mesh
- **Drift State** — { active: bool, angle: float, duration: float, score: float }
- **Boost Meter** — fill level 0–100; consumed on boost activation
- **Score** — cumulative integer; reset on game restart

## External Services / Environments
- **Browser** — Chrome/Firefox/Safari/Edge; WebGL 2.0 required
- **Node.js** — build tooling only (Vite bundler); not a server runtime
- **npm/pnpm** — package manager for dependencies

## Roles
- Player: input source, score observer

## Key Terms
- **Slip angle** — angle between car heading and velocity direction; threshold for drift detection
- **Drift combo** — sustained drift earning multiplier score
- **Boost** — temporary speed increase awarded after long drift
- **Low-poly** — stylized 3D with minimal polygon count, flat/toon shading
- **Neon accents** — emissive materials or post-processing glow on key elements
- **Dynamic camera** — camera that shifts FOV/offset based on car speed and drift state
