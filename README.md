# wip-pages

Minimalist collection of animated **Pre-Launch**, **Maintenance**, and **Coming-Soon** placeholder pages. Each page consists solely of a self-explanatory SVG animation and simple, clear text—no buttons, forms, gradients, neon colors, or interactive clutter.

## Included Pages

| Category | Concept | Path | Visual Animation |
| :--- | :--- | :--- | :--- |
| **Pre-Launch** | **Split-Flap Countdown** | `src/pages/pre-launch/split-flap/` | A 4-module mechanical split-flap display (`DAYS`, `HRS`, `MIN`, `SEC`) counting down in real time to a configurable launch date. |
| **Maintenance** | **Wrench & Bolt** | `src/pages/maintenance/wrench/` | An open-end wrench engaging a hexagonal nut, turning it 60° per stroke, repositioning, and tightening again. |
| **Coming Soon** | **Wireframe Builder** | `src/pages/coming-soon/wireframe/` | Inside a browser window, a pointer places the navigation bar, hero section, and feature cards of a new website step by step. |

---

## Configuring the Pre-Launch Countdown (`split-flap`)

To prevent visitors from altering the countdown state via the URL, the target date is strictly controlled at build/source time:

1. **Environment Variable (`VITE_LAUNCH_DATE`)** in `.env` or passed directly when building the standalone page:
   ```bash
   pnpm build:page split-flap 2026-12-01T12:00:00
   ```
2. **HTML Attribute** in `src/pages/pre-launch/split-flap/index.html`:
   ```html
   <main class="placeholder-page" data-target="2026-12-01T12:00:00">
   ```

---

## Running Locally with `pnpm`

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:5173)
pnpm dev

# Build multi-page production bundle (Gallery + all pages) into ./dist
pnpm build

# Build a single standalone page into ./dist/standalone/<category>/<concept>/
pnpm build:page split-flap
pnpm build:page wrench
pnpm build:page wireframe

# Preview production build locally (http://localhost:8080)
pnpm preview
```

---

## Running via Docker / Docker Compose

### Development Container (Port `5173`)
```bash
docker compose -f docker-compose.dev.yaml up --build
```

### Production Container (Nginx on Port `8080`)
```bash
docker compose -f docker-compose.yaml up --build -d
```

> **Cloudflare Tunnel (`cloudflared`):** Copy `.env.example` to `.env` and set `CLOUDFLARE_TUNNEL_TOKEN` if running with the `cloudflared` tunnel service enabled.
