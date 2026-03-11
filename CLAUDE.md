# CLAUDE.md — Sarah-Beth's Math Adventure

## Project Overview
A single-page, unicorn-themed math game for Sarah-Beth. 20 progressive levels covering addition (1–12) and subtraction (13–20). Runs as a Docker container on a UGreen NAS, served via nginx on port 8080. No build step — pure HTML/CSS/JS.

## Architecture

### File Structure
```
index.html          — Single HTML page, all screens defined here
css/style.css       — All styles
js/
  app.js            — Entry point, screen routing, App object, init
  game.js           — Game loop, answer checking, level progression
  levels.js         — LEVELS array (20 level configs) + getLevelConfig()
  problems.js       — Problem generation for each level
  ui.js             — UI helpers, screen switching (UI.showScreen), progress map
  teaching.js       — Teaching/tutorial screens shown before new concepts
  storage.js        — localStorage save/load (Storage object)
  sounds.js         — Sound effects (Sounds object)
  speech.js         — Text-to-speech read-aloud (Speech object)
docker/
  nginx.conf        — nginx config
docker-compose.yml          — Local dev compose
docker-compose.nas.yml      — NAS reference compose
Dockerfile
```

### Key Global Objects
- `App` — routing, init, parent mode, settings
- `Game` — game loop (`Game.init(state)`, `Game.startLevel(id)`)
- `UI` — screen control (`UI.showScreen(id)`), rendering helpers
- `LEVELS` — array of 20 level config objects (always in scope)
- `Storage` — `Storage.load()`, `Storage.save(state)`, `Storage.reset()`
- `Sounds` / `Speech` — audio systems

### Screen IDs
`welcome-screen`, `teaching-screen`, `game-screen`, `level-complete-screen`, `victory-screen`, `map-screen`, `settings-screen`, `parent-screen`

## Key Conventions
- **No build step** — edit files directly, refresh browser to test
- **Script load order matters** — `index.html` loads scripts in dependency order; `app.js` is last
- **`goToLevel(id)`** has a `highestLevel` guard — bypass it by calling `Game.init()` + `Game.startLevel()` directly (used in parent mode)
- Progress stored in `localStorage` under a fixed key via `Storage`
- Version number lives in `js/app.js` inside `_showFirstTime()` as `.app-version` div

## CI/CD
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- On push to `main`: builds Docker image → pushes to GHCR → SSHes into NAS and runs `docker compose pull && up -d`
- NAS SSH port: **9020**
- NAS deploy dir: `~/sb-math`
- Image registry: `ghcr.io/hombre355/sb_math_project`

## Parent Mode (hidden)
- Entry: triple-click the "Math Adventure" header title within 600ms
- Shows all 20 lessons as clickable cards — bypasses level unlock guard
- `App.showParentMode()` in `app.js`

## Current Version
v1.0
