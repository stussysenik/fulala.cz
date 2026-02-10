# FULALA Platform — Documentation

## What Is This?

The Fulala platform is a complete digital system for running the Fulala restaurant. It serves three audiences:

1. **Customers** — Browse the menu, make reservations, explore the story, find contact info
2. **Staff** — Manage orders, tables, reservations, menu items, QR codes, and media
3. **Owner** — Dashboard overview, analytics, full admin control

The platform is split into two deployments:
- **fulala.cz** — The main website (public pages + admin dashboard)
- **menu.fulala.cz** — The live menu system (embedded in fulala.cz/menu via iframe, also standalone)

---

## How Customers Use It

### Homepage (`fulala.cz`)
The landing page shows the Fulala brand with the tiger mascot, highlights the restaurant's values (handmade, fresh daily, made with love), and links to the menu and story. A language toggle in the nav lets customers switch between Czech, English, and Chinese.

### Menu (`fulala.cz/menu`)
The menu page embeds the live menu from `menu.fulala.cz` in a full-page iframe. This means menu updates happen in real-time — when staff changes a price or marks an item as sold out, it appears instantly on the customer's screen with no page refresh needed.

The embedded menu shows:
- **Categories** (Steamed Dumplings, Noodle Soups, etc.) with Czech + English + Chinese names
- **Prices** in CZK with an optional EUR toggle
- **Allergen badges** following EU regulation (14 allergens with sub-types)
- **Customer info** — student/senior discounts, family portions
- **Weekly schedule** — which week's menu is active

### Reservations (`fulala.cz/reservations`)
A three-tab interface:
1. **Table booking** — Pick a date, time slot, party size, and provide contact info
2. **Space booking** — Reserve the restaurant for private events with time-block conflict detection
3. **Manage reservation** — Look up existing bookings by phone number

### Story (`fulala.cz/story`)
Four sections telling the Fulala origin story: introduction, origins, the tiger mascot, and core values. Includes a behind-the-scenes gallery.

### Contact (`fulala.cz/contact`)
Contact form, location map with direction links (Google Maps + Apple Maps), opening hours, and localized email addresses:
- Czech: ahoj@fulala.cz, nazdar@fulala.cz
- English: hello@fulala.cz
- Chinese: nihao@fulala.cz

### Gallery (`fulala.cz/gallery`)
Masonry photo grid with category filtering (food, interior, team, events). Lightbox viewer with keyboard navigation (arrow keys, escape).

### QR Table Ordering (`fulala.cz/order/[tableCode]`)
Customers scan a QR code at their table. This opens the menu with an add-to-cart flow, modifier selection (noodle type, spice level, etc.), and order submission.

---

## How Staff Uses the Admin Dashboard

Access: `fulala.cz/admin` (login required)

### Dashboard (`/admin`)
Overview with key metrics:
- Total orders today, revenue, active tables, pending reservations
- Recent orders list
- Quick action buttons

### Menu Management (`/admin/menu`)
DataTable of all menu items. Staff can:
- Add/edit/delete items with images
- Set prices, descriptions, categories
- Toggle availability (sold out)
- Filter by category

### Category Management (`/admin/categories`)
CRUD for menu categories with automatic slug generation and sort ordering.

### Order Tracking (`/admin/orders`)
Real-time order list with status workflow:
```
pending → confirmed → preparing → ready → served → completed
                                                  → cancelled
```
Filter by status. Click to see order details with items, quantities, and notes.

### Table Management (`/admin/tables`)
List of all tables with capacity, shape (round/square/rectangle), and status (available/occupied/reserved/cleaning).

### Floor Plan Editor (`/admin/tables/floor-plan`)
Visual drag-and-drop canvas for arranging tables. Set positions, rotations, and sizes. Add new tables directly from the editor.

### Reservation Management (`/admin/reservations`)
View all bookings filtered by date or status. Update reservation status (confirm, seat, complete, cancel, no-show). See guest details and special requests.

### QR Code Management (`/admin/qr-codes`)
Generate QR codes for tables or general menu access. Track scan counts. Toggle active/inactive. Download for printing.

### Gallery Management (`/admin/gallery`)
Upload and organize photos. Set featured items. Manage categories.

### Media Library (`/admin/media`)
Central file storage. Drag-and-drop upload. Grid view with file type indicators. Delete unused files.

---

## The Live Menu System (menu.fulala.cz)

The live menu is a separate SvelteKit app that powers the real-time menu display. It runs standalone at `menu.fulala.cz` and is also embedded inside `fulala.cz/menu`.

### What It Shows
- Restaurant header with weekly schedule (e.g., "Week #2 · February 2026 · 9–15 February")
- Customer info section (kids/family portions, ISIC student discount, senior discount)
- Full allergen legend (EU 14 allergens with Czech + English names)
- Menu categories with items showing:
  - Czech name, Chinese characters, English subtitle
  - Price in CZK (with optional EUR conversion)
  - Allergen codes
  - Badges: RECOMMENDED, SWEET, GLUTEN-FREE
  - Food photos

### Display Modes
- **Web/Mobile** (`/`) — Standard responsive layout
- **TV Display** (`/tv`) — Optimized for restaurant screens with larger fonts
- **Customer Ordering** (`/order`) — Add-to-cart system with modifiers

### Admin Features (`/admin`)
- Menu item CRUD with images, allergens, modifiers, dietary tags
- Theme editor (colors, fonts, spacing) with live preview
- Layout switcher (4 layouts: standard list, dim sum grid, card grid, traditional Chinese)
- Currency configuration (CZK/EUR/USD/CNY, exchange rates)
- Event management (packages, catering, school meals)
- Analytics dashboard (session tracking, viewport data)

### Real-Time Architecture
All data flows through Convex with WebSocket subscriptions. When a staff member updates a menu item or marks something as sold out, the change appears on every connected screen within ~200ms. No manual refresh needed.

---

## Technical Architecture

### Frontend
Both apps use **SvelteKit 2** with **Svelte 5** (runes: `$state`, `$derived`, `$effect`). The main site uses **Tailwind CSS v4**; the live menu uses **vanilla CSS with CSS variables** for theme customization.

### Backend
**Convex** provides the real-time database, file storage, and serverless functions for both apps. Each app has its own Convex project:
- fulala.cz → `jovial-perch-285.convex.cloud` (13 tables)
- menu.fulala.cz → `cheery-setter-27.convex.cloud` (14 tables)

### Deployment
Both apps deploy to **Vercel** via auto-deploy from `main`:
- `fulala.cz` — Vercel project `fulala-public` (Root Directory: `fulala-public`)
- `menu.fulala.cz` — Vercel project `fulala-live-menu` (Region: fra1 Frankfurt)

### i18n
The main site supports three languages via a custom i18n store:
- **Czech** (default) — Full translation of all UI, nav, content
- **English** — Full translation
- **Chinese** (中文) — Navigation and key content

The live menu supports Czech + English with a simple toggle.

### Database Schema (fulala.cz)
13 tables: `menuItems`, `categories`, `orders`, `tables`, `reservations`, `qrCodes`, `galleryItems`, `floorPlans`, `media`, `adminUsers`, `adminSessions`, `siteSettings`, `storyContent`

### Database Schema (menu.fulala.cz)
14 tables: `menuItems`, `categories`, `displayLayouts`, `customerOrders`, `eventPackages`, `cateringMenus`, `schoolMeals`, `menuArchive`, `syncState`, `dailySnapshots`, `siteSettings`, `themePresets`, `displayAnalytics`, `analyticsAggregates`

---

## Development

### Prerequisites
- [Bun](https://bun.sh) (runtime + package manager)
- [Convex](https://convex.dev) account

### Running fulala.cz
```bash
cd ~/Desktop/fulala.cz
bun install && bun run install:app
bun run dev:all
```

### Running menu.fulala.cz
```bash
cd ~/Desktop/fulala-live-menu
bun install
bun run dev:all
```

### Running Both Together
For the full experience (menu embedded in the main site):
1. Start `fulala-live-menu` first (gets port 5173)
2. Start `fulala.cz` second (gets port 5175)
3. The iframe on `/menu` will load from localhost:5173

### Authentication
Admin dashboard uses session-based auth with HttpOnly cookies (`fulala_admin_session`). Sessions are stored in Convex and validated server-side in `+layout.server.ts`.

### Convex Patterns (convex-svelte)
```svelte
<script>
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';

  const client = useConvexClient();
  const itemsQuery = useQuery(api.menu.list, () => ({}));
  const items = $derived(itemsQuery.data ?? []);

  async function update(id) {
    await client.mutation(api.menu.update, { id, title: 'New' });
  }
</script>
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `vite: command not found` on Vercel | Set Root Directory to `fulala-public` in Vercel project settings |
| `PUBLIC_LIVE_MENU_URL not exported` | Add env var in Vercel dashboard |
| Empty menu on `/menu` | Check that `PUBLIC_LIVE_MENU_URL` points to `https://menu.fulala.cz` |
| Admin redirect loop | Clear `fulala_admin_session` cookie, re-login |
| Convex not connecting | Check `PUBLIC_CONVEX_URL` in `.env.local` |

---

*Last updated: February 11, 2026*
