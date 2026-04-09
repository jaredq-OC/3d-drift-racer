# PRD — 3D Drift Racer

> Project ID: 3d-drift-racer  
> Grade: Personal Use  
> Generated: Pre-Dev Stage 3 (Quality Gate)

---

## 1. Overview

**What it is:** A browser-based 3D drifting car racing game. The player drives a low-poly car around a racetrack and scores points by executing controlled drifts. Speed boosts are awarded for long sustained drifts.

**Target users:** Single player; keyboard (desktop) and touch (mobile).

**Core value proposition:** Arcade drift feel with a premium neon-low-poly aesthetic — the satisfaction of a well-executed drift combo, visualized with cinematic camera work and a vibrant visual language.

---

## 2. Core Features

### 2.1 Car Control (RQ-01, RQ-04)

The player controls a car using:
- **Keyboard:** W/↑ = throttle, S/↓ = brake/reverse, A/← = steer left, D/→ = steer right, Space = boost (optional manual trigger)
- **Touch:** Virtual joystick (nipplejs) for steering + throttle/brake zones

**Drift mechanics:**
- Drift is triggered when the slip angle (angle between velocity direction and car heading) exceeds **15°** while the car is moving above **5 m/s**
- Drift is maintained by player applying steering input while on throttle
- Drift ends when slip angle drops below threshold OR speed drops below minimum
- Lateral friction on rear wheels is reduced during drift to simulate tire slip

### 2.2 Scoring System (RQ-02, RQ-06, RQ-07)

**Drift score formula:**
```
score_rate = base_multiplier × (drift_angle_degrees / 90) × speed_factor
```
- **base_multiplier:** starts at 1, increases by 1 every 0.5s of sustained drift
- **drift_angle:** capped at 90° (prevents exploit)
- **speed_factor:** speed / max_speed (normalized)

**Multiplier tiers:**
| Angle | Multiplier |
|-------|-----------|
| 15–30° | 2× |
| 30–60° | 4× |
| 60–90° | 8× |

**Score display:** Running total shown top-left; drift combo text appears center screen during active drift showing live rate.

### 2.3 Boost Reward (RQ-08)

- **Boost meter:** 0–100 bar at bottom-center of screen
- **Fill rate:** +20 points per second of sustained drift
- **Activation threshold:** meter reaches 100
- **Effect on activation:** +50% max speed for 2 seconds; auto-activates OR player presses Space
- **Visual feedback:** Camera FOV widens (65° → 80°), neon particle burst from rear

### 2.4 Racetrack (RQ-05)

- Procedural closed circuit generated from CatmullRomCurve3 control points
- Track width: 12 units
- Track surface: dark charcoal with subtle grid texture
- Neon barriers: cyan and magenta emissive strips along track edges
- Collision: box-based track segments as static cannon-es bodies

---

## 3. Visual Design

### 3.1 Aesthetic (RQ-09, RQ-10, RQ-11)

**Style:** Stylized low-poly arcade racer. Not photorealistic. Clean geometric shapes, flat shading, neon glow.

**Color palette:**
| Element | Color |
|---------|-------|
| Background/ground | Deep purple-black `#0d0015` |
| Track surface | Charcoal `#1a1a2e` |
| Track neon barriers | Cyan `#00f5ff`, Magenta `#ff00aa` |
| Car body | Vibrant orange `#ff6b00` |
| Car trails | Neon pink `#ff0080` |
| HUD text | White with cyan glow |

**Typography:** Orbitron (Google Fonts) — futuristic geometric sans-serif

**Rendering approach:**
- Car + track: MeshLambertMaterial, `flatShading: true`
- Neon elements: MeshBasicMaterial (unlit, always bright)
- Post-processing: UnrealBloomPass (threshold 0.8, strength 1.5, radius 0.5)

### 3.2 Dynamic Camera (RQ-12)

- **Base:** Third-person follow camera, 10 units behind, 4 units above
- **Normal FOV:** 65°
- **Drift FOV:** 72° (slight widen for drama)
- **Boost FOV:** 80° (snaps wider, lerps back)
- **Drift camera bank:** Camera yaw rotates 5° toward drift direction
- **Smoothing:** All camera params lerped at 0.08/frame

---

## 4. Non-Functional Requirements

| NFR-ID | Requirement | Target |
|--------|-------------|--------|
| NFR-01 | Frame rate | 60fps on modern desktop browser |
| NFR-02 | Input latency | <1 frame keyboard, <2 frames touch |
| NFR-03 | Platform | Chrome/Firefox/Safari/Edge, WebGL 2.0 |
| NFR-04 | Build output | Single HTML file or dist/ folder |
| NFR-05 | Start time | <3 seconds to first frame |

---

## 5. Out of Scope (Non-Goals)

- NG-01: Multiplayer or online leaderboards
- NG-02: Audio or music
- NG-03: Multiple tracks (single track MVP)
- NG-04: Persistent score storage
- NG-05: VR or special hardware
