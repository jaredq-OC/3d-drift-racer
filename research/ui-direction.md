# UI Direction — 3D Drift Racer

## Project-Specific Visual Direction

### Target Feel
A stylized arcade racer that feels like a neon-soaked midnight street circuit. The aesthetic should evoke arcade racing games (Initial D drift vibes, geometry wars palette influence) but rendered in low-poly warmth. The player should feel the speed and risk through camera, color, and motion — not photorealism.

### Color Palette
- **Background/Ground:** Deep purple-black `#0d0015` to dark blue `#050215`
- **Track surface:** Dark charcoal `#1a1a2e` with subtle grid
- **Track edges/neon barriers:** Electric cyan `#00f5ff`, hot magenta `#ff00aa`
- **Car body:** Vibrant orange `#ff6b00` or lime `#aaff00`
- **Car accent/trails:** Neon pink `#ff0080`, white `#ffffff`
- **HUD text:** White `#ffffff` with cyan accent `#00f5ff`
- **Boost meter:** Gradient from yellow `#ffee00` to red `#ff3300`

### Typography
- HUD: Orbitron (Google Font) — futuristic, geometric, readable at small sizes
- Score popups: Bold Orbitron, large, with text shadow/glow

### Layout Strategy
- **Game canvas:** Full viewport
- **HUD overlay:** Fixed position, minimal chrome
  - Top-left: Score (large, prominent)
  - Top-right: Speed indicator (km/h)
  - Bottom-center: Boost meter (horizontal bar)
  - Center: Drift combo text (appears during drift, fades on release)
- **Camera:** Third-person follow, offset ~10 units behind, ~4 units above

### Motion / Animation
- Score popups: Scale-in + float upward + fade-out on drift end
- Boost activation: Camera FOV snap + particle burst
- Drift streak: Persistent neon trail behind rear wheels during drift
- UI transitions: None needed (single screen game) — game itself is the experience

### Materials & Rendering
- Car: MeshLambertMaterial, flatShading: true — clean low-poly look
- Track: MeshLambertMaterial, darker tone, flat shading
- Neon elements: MeshBasicMaterial (unlit, always full brightness)
- Post-processing: UnrealBloomPass (threshold 0.8, strength 1.5, radius 0.5)
- Tire trails: Particle system or line geometry with MeshBasicMaterial, neon color

### Anti-Goals
- Do NOT use realistic PBR materials — this is stylized arcade
- Do NOT use grayscale or muted palette
- Do NOT use smooth/procedural animations on car mesh (car is rigid low-poly)
- Do NOT add HUD clutter beyond the 4 elements listed

### Inspiration Mapping
- Drift feel: Initial D / Wangan Midnight (gameplay inspiration)
- Neon aesthetic: Geometry Wars / Tron Legacy (visual inspiration)
- Low-poly style: Crossy Road / Monument Valley aesthetic (simplicity inspiration)
- Camera drama: Mario Kart (boost FOV + speed feel)

### Hierarchy of UI Elements
1. Score (most prominent — this is a scoring game)
2. Boost meter (reward feedback — second most important)
3. Speed (context — third)
4. Drift combo text (contextual — appears/disappears)
