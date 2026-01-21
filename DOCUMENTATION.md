# Fulala Platform v2 - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Frontend (SvelteKit)](#frontend-sveltekit)
3. [Backend (Convex)](#backend-convex)
4. [Authentication](#authentication)
5. [Components](#components)
6. [Routes](#routes)
7. [Database Schema](#database-schema)
8. [API Reference](#api-reference)
9. [Deployment](#deployment)

---

## Architecture Overview

Fulala v2 is a unified SvelteKit application with both public-facing pages and an admin dashboard, powered by Convex for real-time data.

```
┌─────────────────────────────────────────────────────────┐
│                    SvelteKit App                        │
│  ┌──────────────────┐    ┌──────────────────────────┐  │
│  │  Public Routes   │    │    Admin Routes          │  │
│  │  /, /menu, etc.  │    │    /admin/*              │  │
│  └────────┬─────────┘    └───────────┬──────────────┘  │
│           │                          │                  │
│           └──────────┬───────────────┘                  │
│                      │                                  │
│           ┌──────────┴──────────┐                      │
│           │  Convex Subscriptions │                     │
│           │  (Real-time Queries)  │                     │
│           └──────────┬──────────┘                      │
└──────────────────────┼──────────────────────────────────┘
                       │
             ┌─────────┴─────────┐
             │      CONVEX       │
             │  - Database       │
             │  - File Storage   │
             │  - Functions      │
             └───────────────────┘
```

### Key Technologies
- **SvelteKit 2.49** with Svelte 5 runes ($state, $derived, $effect)
- **Tailwind CSS v4** with custom brand colors
- **Convex** for real-time database and file storage
- **bits-ui** for headless UI components

---

## Frontend (SvelteKit)

### Directory Structure
```
fulala-public/src/
├── routes/
│   ├── +layout.svelte        # Root layout with Navigation
│   ├── +page.svelte          # Home page
│   ├── menu/                 # Menu page (live data)
│   ├── story/                # Behind the scenes
│   ├── contact/              # Contact with map
│   ├── gallery/              # Photo gallery
│   ├── reservations/         # Public booking
│   ├── order/[tableCode]/    # QR ordering
│   └── admin/                # Admin dashboard
│       ├── +layout.svelte    # Admin shell
│       ├── +layout.server.ts # Auth middleware
│       ├── login/            # Login page
│       ├── menu/             # Menu management
│       ├── categories/       # Category management
│       ├── orders/           # Order tracking
│       ├── tables/           # Table management
│       │   └── floor-plan/   # Visual editor
│       ├── reservations/     # Reservation management
│       ├── qr-codes/         # QR code generation
│       ├── gallery/          # Gallery management
│       └── media/            # Media library
├── lib/
│   └── components/
│       ├── ui/               # Reusable UI components
│       ├── admin/            # Admin-specific components
│       ├── grid/             # Layout grid system
│       └── map/              # Location map
└── app.css                   # Tailwind v4 styles
```

### Svelte 5 Runes Usage
```typescript
// State management
let count = $state(0);
let items = $state<Item[]>([]);

// Derived values
const total = $derived(items.reduce((sum, i) => sum + i.price, 0));

// Effects
$effect(() => {
  console.log('Count changed:', count);
});
```

### Convex Integration
```typescript
import { useQuery, useMutation } from 'convex/svelte';
import { api } from '../convex/_generated/api';

// Real-time query
const menuItems = useQuery(api.menu.list, {});

// Mutation
const createItem = useMutation(api.menu.create);
await createItem({ title: 'New Item', price: 100 });
```

---

## Backend (Convex)

### Configuration
```json
// convex.json
{
  "project": "your-project-id",
  "team": "your-team",
  "prodUrl": "https://your-project.convex.cloud"
}
```

### Running Convex
```bash
# Development (watches for changes)
npx convex dev

# Deploy to production
npx convex deploy
```

### File Storage
```typescript
// Upload a file
const generateUploadUrl = useMutation(api.media.generateUploadUrl);
const saveFile = useMutation(api.media.saveFile);

const url = await generateUploadUrl({});
await fetch(url, { method: 'POST', body: file });
await saveFile({ storageId, filename, contentType, size });
```

---

## Authentication

### Server-Side (SvelteKit)
Authentication is handled via session cookies validated on the server.

```typescript
// src/routes/admin/+layout.server.ts
export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Skip for login page
  if (url.pathname === '/admin/login') return {};

  // Get session token from cookie
  const sessionToken = cookies.get('fulala_admin_session');
  if (!sessionToken) {
    throw redirect(303, '/admin/login');
  }

  // Validate session with Convex
  const convex = createConvexClient();
  const session = await convex.query(api.auth.validateSession, {
    sessionToken
  });

  if (!session) {
    cookies.delete('fulala_admin_session', { path: '/' });
    throw redirect(303, '/admin/login');
  }

  return { user: session.user };
};
```

### Login Flow
```typescript
// src/routes/admin/login/+page.server.ts
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    // Authenticate with Convex
    const session = await convex.mutation(api.auth.login, {
      email,
      password
    });

    // Set session cookie
    cookies.set('fulala_admin_session', session.token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(303, '/admin');
  }
};
```

### Demo Credentials
- Email: `admin@fulala.cz`
- Password: `admin123`

---

## Components

### UI Components (`src/lib/components/ui/`)

| Component | Description | Props |
|-----------|-------------|-------|
| Button | Primary/secondary/ghost buttons | variant, size, loading, disabled |
| Input | Form input with label | label, type, placeholder, error |
| Select | Dropdown select | options, value, placeholder |
| Card | Content container | class (for styling) |
| Badge | Status indicators | variant (success, warning, error, etc.) |
| Dialog | Modal dialogs | open, onClose, title |
| DataTable | Sortable tables | columns, data, onSort |
| Tabs | Tab navigation | tabs, activeTab |

### Usage Example
```svelte
<script>
  import { Button, Card, Badge, Input } from '$lib/components/ui';
</script>

<Card>
  <Input label="Name" bind:value={name} />
  <Badge variant="success">Active</Badge>
  <Button loading={submitting} onclick={submit}>Save</Button>
</Card>
```

### Admin Components (`src/lib/components/admin/`)

| Component | Description |
|-----------|-------------|
| AdminSidebar | Collapsible navigation sidebar |
| AdminHeader | Page header with breadcrumbs |
| DashboardMetric | Stat cards with trend indicators |

### Grid Components (`src/lib/components/grid/`)

| Component | Description |
|-----------|-------------|
| Grid | CSS Grid container with responsive columns |
| GridItem | Grid cell with colspan/rowspan |
| GridGallery | Masonry-style image gallery |

---

## Routes

### Public Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero section |
| `/menu` | Menu with category filtering (live data) |
| `/story` | Behind the scenes content |
| `/contact` | Contact form with map |
| `/gallery` | Photo gallery with lightbox |
| `/reservations` | Online table booking |
| `/order/[tableCode]` | QR code ordering for tables |

### Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with metrics |
| `/admin/login` | Login page |
| `/admin/menu` | Menu CRUD management |
| `/admin/categories` | Category management |
| `/admin/orders` | Real-time order tracking |
| `/admin/tables` | Table management |
| `/admin/tables/floor-plan` | Visual floor plan editor |
| `/admin/reservations` | Reservation management |
| `/admin/qr-codes` | QR code generation |
| `/admin/gallery` | Gallery management |
| `/admin/media` | Media library |

---

## Database Schema

### Tables

```typescript
// orders
{
  orderNumber: string,
  status: "pending" | "confirmed" | "preparing" | "ready" | "served" | "cancelled",
  tableId?: Id<"tables">,
  items: Array<{
    menuItemId: Id<"menuItems">,
    title: string,
    price: number,
    quantity: number,
    notes?: string
  }>,
  total: number,
  customerName?: string,
  customerPhone?: string,
  notes?: string,
  createdAt: number,
  updatedAt: number
}

// tables
{
  name: string,
  capacity: number,
  shape: "round" | "square" | "rectangle",
  status: "available" | "occupied" | "reserved" | "unavailable",
  position: { x: number, y: number, width: number, height: number },
  floorPlanId?: Id<"floorPlans">,
  sortOrder: number
}

// reservations
{
  tableId?: Id<"tables">,
  guestName: string,
  phone: string,
  email?: string,
  partySize: number,
  date: string,
  timeSlot: string,
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show",
  specialRequests?: string,
  notes?: string,
  createdAt: number
}

// qrCodes
{
  type: "table" | "menu" | "promo",
  tableId?: Id<"tables">,
  code: string,
  url: string,
  isActive: boolean,
  scansCount: number,
  lastScannedAt?: number,
  createdAt: number
}

// galleryItems
{
  mediaId: Id<"media">,
  category: string,
  title?: string,
  description?: string,
  isFeatured: boolean,
  sortOrder: number
}

// floorPlans
{
  name: string,
  width: number,
  height: number,
  backgroundImageId?: Id<"media">,
  isActive: boolean,
  createdAt: number,
  updatedAt: number
}

// adminUsers
{
  email: string,
  passwordHash: string,
  name: string,
  role: "admin" | "manager" | "staff",
  isActive: boolean,
  createdAt: number,
  lastLoginAt?: number
}

// adminSessions
{
  userId: Id<"adminUsers">,
  token: string,
  expiresAt: number,
  createdAt: number
}
```

---

## API Reference

### Menu API
```typescript
// List all menu items
api.menu.list({})

// Get by category
api.menu.listByCategory({ category: "dumplings" })

// Create item
api.menu.create({
  title: string,
  description?: string,
  price: number,
  category: string,
  imageId?: Id<"media">,
  isAvailable?: boolean
})

// Update item
api.menu.update({
  id: Id<"menuItems">,
  title?: string,
  price?: number,
  // ... other fields
})

// Delete item
api.menu.remove({ id: Id<"menuItems"> })
```

### Orders API
```typescript
// List orders
api.orders.list({ status?: string, limit?: number })

// Create order
api.orders.create({
  tableId?: Id<"tables">,
  items: Array<{...}>,
  customerName?: string,
  notes?: string
})

// Update status
api.orders.updateStatus({
  id: Id<"orders">,
  status: "preparing" | "ready" | "served" | "cancelled"
})

// Get stats
api.orders.getStats({})
```

### Reservations API
```typescript
// Get available slots
api.reservations.getAvailableSlots({
  date: string,
  partySize: number
})

// Create reservation
api.reservations.create({
  guestName: string,
  phone: string,
  partySize: number,
  date: string,
  timeSlot: string,
  specialRequests?: string
})

// Update status
api.reservations.updateStatus({
  id: Id<"reservations">,
  status: "confirmed" | "cancelled" | "completed"
})
```

---

## Deployment

### Vercel (SvelteKit)
```bash
cd fulala-public
vercel
```

### Environment Variables
```bash
# .env.local
PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

### Convex Production
```bash
npx convex deploy --prod
```

---

## Development Commands

```bash
# Start development
cd fulala-public
npm run dev          # SvelteKit server (port 5173)
npx convex dev       # Convex dev server (separate terminal)

# Testing
npm run test:e2e     # Run Playwright tests
npm run test:e2e:ui  # Run with Playwright UI

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Check linting
npm run format       # Format code
```

---

## Troubleshooting

### Common Issues

**"Convex client not connected"**
- Ensure `npx convex dev` is running
- Check `PUBLIC_CONVEX_URL` environment variable

**"Session expired" on admin pages**
- Clear cookies and log in again
- Check if Convex is running

**"Module not found" errors**
- Run `npm install` to ensure dependencies are installed
- Check that you're in the `fulala-public` directory

### Support
- GitHub Issues: [Link to repo]
- Email: hello@fulala.cz
