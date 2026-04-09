# Defer Register — 3D Drift Racer

| DEFER-ID | Item | Why Deferred | Why Safe Now | Trigger to Revisit |
|----------|------|-------------|--------------|--------------------|
| DEFER-01 | Custom lateral friction curve (per-wheel grip vs slip angle) | Complex tuning, requires playtesting | Basic RaycastVehicle friction reduction gives functional drift; signature feel deferred to iteration 2 | Player feedback or self-review if drift feels generic |
| DEFER-02 | Audio/music | Not in brief, Personal Use grade | Game is complete without audio; adding audio is enhancement only | Kirt explicitly requests it |
| DEFER-03 | Multiple tracks / track selection | Single track is sufficient for MVP | One well-designed procedural track validates core loop | After core drift mechanic confirmed working |
| DEFER-04 | Leaderboard / persistent score storage | No server specified; Personal Use grade | In-memory score is fine for this grade | If grade upgrades to Deployment |
| DEFER-05 | Shadow quality settings / shadows off option | Bloom is heavier; shadows are low-cost for this scene | Shadows enabled at low resolution is fine for low-poly style | If FPS drops below 50 on primary device |
| DEFER-06 | Touch boost button | Touch joystick + auto-boost is MVP | Player can use keyboard boost on mobile or rely on auto-boost | If mobile players can't activate boost |
| DEFER-07 | Procedural vs hand-crafted track geometry details | CatmullRomCurve3 with smoothed points is sufficient | Simple spline-based track provides valid racing loop | If track feels artificial or has geometry issues |
