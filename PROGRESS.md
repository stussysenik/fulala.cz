# FULALA — Progress

**Live:** [fulala.cz](https://fulala.cz) · **Menu:** [menu.fulala.cz](https://menu.fulala.cz)

---

## Current State (February 2026)

Both sites are deployed and live. All features below are in production.

### Completed

**Foundation**
- [x] SvelteKit 2 + Svelte 5 monorepo with Convex backend
- [x] 13-table database schema (menu, orders, tables, reservations, QR, gallery, auth, settings)
- [x] Tailwind CSS v4 with custom brand tokens
- [x] Nix flake for reproducible dev environment

**Public Website**
- [x] Homepage with tiger mascot, hero, feature cards
- [x] i18n — Czech (default), English, Chinese
- [x] Menu page — iframe embed of `menu.fulala.cz`
- [x] Story page — 4 sections with BTS gallery
- [x] Contact page — form, map, localized emails, FAQ
- [x] Gallery — masonry grid, category filter, lightbox
- [x] Reservations — table booking, space booking (with time-block conflict detection), lookup by phone
- [x] QR table ordering — scan, browse, add to cart, submit

**Admin Dashboard**
- [x] Session-based auth with HttpOnly cookies
- [x] Dashboard with order/revenue/table/reservation metrics
- [x] Menu CRUD with images and category management
- [x] Real-time order tracking with full status workflow
- [x] Table management + visual floor plan editor (drag-drop)
- [x] Reservation management with date/status filters
- [x] QR code generation with scan tracking
- [x] Gallery + media library with drag-drop upload

**Infrastructure**
- [x] Vercel auto-deploy from `main` (Root Directory: `fulala-public`)
- [x] Convex production deployment
- [x] `PUBLIC_CONVEX_URL` + `PUBLIC_LIVE_MENU_URL` env vars configured
- [x] Playwright E2E test setup

---

## Deployment History

| Date | What |
|------|------|
| Feb 11, 2026 | Fixed Vercel deployment (Root Directory + env var), production now matches local |
| Jan 22, 2026 | Tailwind v4 migration, font updates, homepage/footer redesign |
| Jan 21, 2026 | Last successful Vercel build before 20-day outage |
| Jan 21, 2026 | Initial deployment — full platform with admin dashboard |

---

## What's Next

### Polish
- [ ] E2E tests for admin flows
- [ ] Form validation (Zod)
- [ ] Toast notifications for mutations
- [ ] Loading states on all buttons
- [ ] Mobile admin improvements
- [ ] Fix Svelte 5 `state_referenced_locally` warnings (Input, Select, Card, DataTable)
- [ ] Add favicon.ico

### Features
- [ ] Kitchen display system (KDS)
- [ ] Email/SMS notifications for reservations
- [ ] Print order tickets
- [ ] Export reports (CSV/PDF)
- [ ] Analytics dashboard (popular items, revenue, peak hours)

### Integration
- [ ] Payment processing (Stripe)
- [ ] Shopify merch store integration

---

## Technical Debt

- [ ] Proper TypeScript types for Convex API responses
- [ ] Extract common form logic into reusable hooks
- [ ] Error boundaries for graceful failures
- [ ] Rate limiting on public endpoints
- [ ] Audit a11y (add ARIA labels to interactive elements)

---

## Key Files

| File | Purpose |
|------|---------|
| `fulala-public/convex/schema.ts` | Database schema (13 tables) |
| `fulala-public/src/routes/admin/+layout.server.ts` | Auth middleware |
| `fulala-public/src/lib/i18n/translations.ts` | i18n strings (CZ/EN/中文) |
| `fulala-public/src/routes/menu/+page.svelte` | Menu iframe embed |
| `fulala-public/vercel.json` | Deployment config |

---

*Last updated: February 11, 2026*
