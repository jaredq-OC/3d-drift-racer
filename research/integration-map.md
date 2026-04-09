# Integration Map — 3D Drift Racer

## OpenClaw Integrations
- **INT-01:** None — this is a standalone client-side web game with no OpenClaw backend dependency
- **Delivery:** Repo handoff via git push to remote; Kirt clones and runs locally

## External Integrations
- **INT-02:** Google Fonts (Orbitron) — loaded via CSS @import or <link> tag; no API key required
- **INT-03:** Browser WebGL 2.0 — required runtime; graceful error message if unavailable

## Data Flow
```
Player Input (keyboard/touch)
  → InputManager (captures + normalizes)
  → CarController (applies forces to cannon-es body)
  → PhysicsWorld (steps 60Hz)
  → Visual sync (Three.js mesh ← cannon body)
  → DriftDetector (slip angle + drift state)
  → ScoreSystem (accumulates score)
  → HUDRenderer (DOM overlay updates)
  → PostProcessing (bloom applied)
  → Canvas (presented to screen)
```

## State Ownership
- **Car state:** Owned by cannon-es Body; read by Three.js for rendering
- **Drift state:** Owned by game state object; not persisted
- **Score:** Owned by game state object; not persisted (in-memory only)
- **Camera:** Owned by camera controller; no state persistence

## No Server/Backend
This is a pure client-side app. No data leaves the browser.
