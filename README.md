<div align="center">

# FULALA — Old School New Soul

### Fresh noodles, dumplings & snacks in Prague

![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?style=flat-square&logo=svelte&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-Realtime-EE5522?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

[Live Site](https://fulala.vercel.app) · [Menu](https://menu.fulala.cz) · [Admin](https://fulala.cz/admin)

</div>

---

A restaurant platform for [Fulala](https://fulala.cz) — fresh noodles, dumplings & snacks in Prague's Old Town. Public website with i18n, embedded live menu, reservations, gallery, and a full admin dashboard.

## Quick Start

```bash
bun install && bun run install:app
bun run dev:all          # SvelteKit + Convex
```

| URL | Service |
|-----|---------|
| `localhost:5175` | Public site |
| `localhost:5175/admin` | Admin dashboard |
| `dashboard.convex.dev` | Convex backend |

**Admin login:** `admin@fulala.cz` / `admin123`

## Stack

- **SvelteKit 2** + Svelte 5 (runes)
- **Tailwind CSS v4**
- **Convex** (real-time database + file storage)
- **Vercel** (auto-deploy from `main`)
- **Bun** (runtime + package manager)

## Architecture

```
fulala.cz/
├── fulala-public/              # SvelteKit app
│   ├── src/routes/
│   │   ├── (home, menu, story, contact, gallery, reservations)
│   │   └── admin/ (dashboard, menu, orders, tables, floor-plan,
│   │               reservations, qr-codes, gallery, media)
│   ├── src/lib/
│   │   ├── components/         # UI, admin, grid, map
│   │   └── i18n/               # CZ / EN / 中文
│   └── convex/                 # 13 tables, auth, CRUD
├── archive/                    # Legacy Next.js + Phoenix code
└── openspec/                   # Change proposals
```

## Key Features

**Public** — i18n (CZ/EN/中文), live menu via iframe embed from `menu.fulala.cz`, table + space reservations, photo gallery with lightbox, contact with map, tiger mascot, idle engagement helper

**Admin** — Dashboard KPIs, menu CRUD with images, order tracking with status workflow, table management, visual floor plan editor, QR code generation, reservation management, media library

## Commands

| Command | What |
|---------|------|
| `bun run dev` | SvelteKit only |
| `bun run dev:convex` | Convex only |
| `bun run dev:all` | Both |
| `bun run build` | Production build |
| `bun run test` | Playwright E2E |

## Environment

| Variable | Dev | Prod |
|----------|-----|------|
| `PUBLIC_CONVEX_URL` | `determined-ram-534.convex.cloud` | `jovial-perch-285.convex.cloud` |
| `PUBLIC_LIVE_MENU_URL` | `http://localhost:5173` | `https://menu.fulala.cz` |

## Deployment

Vercel auto-deploys from `main`. Root Directory is set to `fulala-public`.

```bash
# Manual deploy
cd fulala-public && vercel --prod

# Convex deploy
cd fulala-public && bunx convex deploy --prod
```

## Brand

| Color | Hex | Usage |
|-------|-----|-------|
| Fulala Red | `#EF4136` | Primary, CTAs |
| Tiger Orange | `#FCEBDC` | Backgrounds |
| Soy Brown | `#6B3900` | Text |

**Fonts:** Chewy (headings) · Outfit (body)

---

Kostecna 121/3, Prague 1 · Mon–Sun 11:00–22:00 · ahoj@fulala.cz
