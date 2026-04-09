# Risk Register — 3D Drift Racer

| RSK-ID | Risk | Likelihood | Impact | Mitigation | Status |
|--------|------|-------------|--------|------------|--------|
| RSK-01 | Cannon-es physics tuning for drift feel is harder than anticipated | Medium | High | Use RaycastVehicle + documented slip angle tuning; defer complex custom friction to iteration 2 | Open |
| RSK-02 | Bloom post-processing causes performance drop on mid-range mobile | Medium | Medium | BloomPass with pixel ratio capped at 1.5; fallback to no bloom on low FPS | Open |
| RSK-03 | Track collision mesh not matching visual track causes car clipping | Medium | High | Use simple box-based collision (track segments as box shapes) for reliability | Open |
| RSK-04 | Vite + Three.js + cannon-es bundle size > 2MB | Low | Low | Vite treeshakes; cannon-es is ~300KB; Three.js is ~600KB minified — total acceptable | Open |
| RSK-05 | Touch controls for drift feel unresponsive on mobile | Medium | High | Implement virtual joystick (nipplejs or custom); test on real touch device | Open |
| RSK-06 | Scoring formula produces unintuitive numbers (too high/low) | Medium | Low | Tune base multiplier; start with conservative values and scale up during playtest | Open |
| RSK-07 | Procedural track creates awkward geometry (sharp corners, impossible drifts) | Low | Medium | Use CatmullRomCurve3 with smoothed control points; avoid acute angles | Open |

## Top 3 Failure Modes (Critical Path)
1. **Drift detection fails** → player can't score → core loop broken → must use reliable slip angle threshold
2. **Physics instability** → car explodes/spins wildly → reduce max substeps, cap force application
3. **Bloom kills performance** → <30fps on target device → FPS-monitored quality settings
