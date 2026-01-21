# Fulala Site Builder v2 🐯

A comprehensive restaurant platform for Fulala featuring real-time ordering, table management, reservations, and an admin dashboard - all built with SvelteKit and Convex.

## Quick Start

```bash
# Install dependencies
bun install && bun run install:app

# Option 1: Run both servers together
bun run dev:all

# Option 2: Run separately (two terminals)
bun run dev          # Terminal 1: SvelteKit
bun run dev:convex   # Terminal 2: Convex
```

### Available Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start SvelteKit dev server |
| `bun run dev:convex` | Start Convex dev server |
| `bun run dev:all` | Start both concurrently |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run test` | Run E2E tests |

**URLs:**
| Service | URL |
|---------|-----|
| Public Site | http://localhost:5173 |
| Admin Dashboard | http://localhost:5173/admin |
| Convex Dashboard | https://dashboard.convex.dev |

**Admin Login:** `admin@fulala.cz` / `admin123`

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      FULALA PLATFORM v2                              │
├──────────────────────────────────────────────────────────────────────┤
│  PUBLIC (/)                          ADMIN (/admin)                  │
│  ┌────────────────────────┐         ┌────────────────────────┐      │
│  │  Home, Menu, Story     │         │  Dashboard, Orders     │      │
│  │  Contact, Gallery      │         │  Tables, Reservations  │      │
│  │  Reservations, QR Order│         │  Floor Plan, QR Codes  │      │
│  └───────────┬────────────┘         └───────────┬────────────┘      │
│              └──────────────┬───────────────────┘                    │
│                             │                                        │
│              ┌──────────────┴──────────────┐                        │
│              │         CONVEX              │                        │
│              │   Real-time Database        │                        │
│              │   + File Storage            │                        │
│              └─────────────────────────────┘                        │
└──────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
fulala/
├── fulala-public/           # Main SvelteKit app (public + admin)
│   ├── src/
│   │   ├── routes/          # All pages
│   │   │   ├── admin/       # Admin dashboard
│   │   │   ├── gallery/     # Photo gallery
│   │   │   ├── reservations/# Public booking
│   │   │   ├── order/[tableCode]/ # QR ordering
│   │   │   └── ...
│   │   ├── lib/components/  # Shared components
│   │   │   ├── ui/          # Button, Input, Card, etc.
│   │   │   ├── admin/       # Admin-specific components
│   │   │   ├── grid/        # Layout grid system
│   │   │   └── map/         # Location map
│   │   └── app.css          # Tailwind v4 styles
│   ├── convex/              # Real-time backend
│   │   ├── schema.ts        # Database schema
│   │   ├── menu.ts          # Menu CRUD
│   │   ├── orders.ts        # Order management
│   │   ├── tables.ts        # Table management
│   │   ├── reservations.ts  # Booking system
│   │   ├── qrCodes.ts       # QR code handling
│   │   ├── gallery.ts       # Gallery items
│   │   ├── floorPlans.ts    # Floor plan data
│   │   └── auth.ts          # Admin authentication
│   └── tests/e2e/           # Playwright tests
├── archive/                 # Legacy code (preserved)
│   ├── nextjs/              # Original Next.js app
│   └── phoenix/             # Phoenix LiveView admin
├── scripts/setup.sh         # Setup script
└── docker-compose.yml       # Docker dev setup
```

## Features

### Public Site
- **Menu** - Real-time menu with category filtering
- **Gallery** - Masonry photo gallery with lightbox
- **Reservations** - Online table booking
- **QR Ordering** - Scan QR code at table to order
- **Contact** - Map with directions

### Admin Dashboard
- **Dashboard** - Overview metrics
- **Menu Management** - CRUD with image upload
- **Category Management** - Organize menu items
- **Orders** - Real-time order tracking with status workflow
- **Tables** - Table capacity and status management
- **Floor Plan** - Visual drag-drop table editor
- **Reservations** - Manage bookings
- **QR Codes** - Generate and manage table QR codes
- **Gallery** - Manage photo gallery
- **Media Library** - File upload and management

### Real-time Features
- Live order updates
- Instant menu changes
- Real-time table status
- Collaborative floor plan editing

## Tech Stack

- **Frontend**: SvelteKit 2.49 + Svelte 5 (runes)
- **Styling**: Tailwind CSS v4
- **Database**: Convex (real-time)
- **Authentication**: Session-based with HttpOnly cookies
- **Components**: bits-ui headless components

## Brand Guidelines

| Color | Hex | Usage |
|-------|-----|-------|
| Fulala Red | #FB3000 | Primary, CTAs |
| Tiger Orange | #FCEBDC | Backgrounds, borders |
| Dough White | #FF8A14 | Page background |
| Soy Brown | #6B3900 | Text, secondary |
| Ink Black | #000000 | Headlines |

**Typography**: Chewy (headings), Outfit (body)

## Testing

```bash
cd fulala-public

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## Deployment

```bash
# Deploy to Vercel
cd fulala-public && vercel
```

## Archive: Legacy Code

The `archive/` directory contains the original implementations:

- **archive/nextjs/** - Original Next.js app
- **archive/phoenix/** - Phoenix LiveView admin dashboard

To run the legacy Next.js app:
```bash
cd archive/nextjs
npm install
npm run dev
```

---

🐯 Built with love and dumplings.
