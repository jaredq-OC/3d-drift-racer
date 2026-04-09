# OpenClaw Context — 3D Drift Racer

## Environment Snapshot

- **Runtime:** Node.js v22.22.2
- **Shell:** zsh
- **Platform:** macOS Darwin 24.6.0 (x64)
- **Build target:** Web browser (Vite bundler)
- **Channel:** Telegram (for delivery notifications)
- **Model:** minimax-portal/MiniMax-M2.7

## Service Catalog
- This is a standalone web game; no OpenClaw backend services required
- No database, auth, or queue integration required (Personal Use grade)
- Delivery via local filesystem → repo handoff

## Existing Projects
- None relevant to this project

## API / Event Catalog
- None — pure client-side single-page game

## Schema Catalog
- None — no persistent data; state is in-memory only during session

## Relevant ADRs
- None recorded

## Key Constraints
- Must use Three.js + Cannon.js or Rapier for 3D + physics
- Must bundle with Vite
- No server-side component; pure client-side HTML/JS
- Grade: Personal Use — no enterprise operational burden
