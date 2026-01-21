# Fulala Platform v2 - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Frontend (SvelteKit)](#frontend-sveltekit)
3. [Backend (Convex)](#backend-convex)
4. [Convex-Svelte Integration](#convex-svelte-integration)
5. [Authentication](#authentication)
6. [Components](#components)
7. [Routes](#routes)
8. [Database Schema](#database-schema)
9. [API Reference](#api-reference)
10. [Deployment](#deployment)

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
- **convex-svelte** for Svelte-native Convex integration
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

---

## Convex-Svelte Integration

### IMPORTANT: Correct API Patterns

The `convex-svelte` library has specific API patterns that must be followed:

### Queries - Use Arrow Function for Args

```typescript
import { useQuery } from 'convex-svelte';
import { api } from '$convex/_generated/api';

// CORRECT - args wrapped in arrow function
const menuItemsQuery = useQuery(api.menu.list, () => ({}));
const categoryQuery = useQuery(api.categories.get, () => ({ id: categoryId }));

// WRONG - args as object literal (will cause errors)
// const menuItemsQuery = useQuery(api.menu.list, {});
```

### Accessing Query Data

```typescript
// Query returns an object with isLoading, error, and data properties
const menuItemsQuery = useQuery(api.menu.list, () => ({}));

// Access data via properties (not store syntax)
const loading = $derived(menuItemsQuery.isLoading);
const items = $derived(menuItemsQuery.data ?? []);

// WRONG - do not use store syntax
// const items = $menuItemsQuery;
```

### Mutations - Use useConvexClient

```typescript
import { useConvexClient } from 'convex-svelte';
import { api } from '$convex/_generated/api';

// Get the Convex client
const client = useConvexClient();

// Call mutations via client.mutation()
async function createItem() {
  await client.mutation(api.menu.create, {
    title: 'New Item',
    price: 100,
    category: 'dumplings'
  });
}

async function updateItem(id: string) {
  await client.mutation(api.menu.update, {
    id,
    title: 'Updated Title'
  });
}
```

### Complete Example

```svelte
<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';

  // Client for mutations
  const client = useConvexClient();

  // Queries with arrow function args
  const menuItemsQuery = useQuery(api.menu.list, () => ({}));
  const categoriesQuery = useQuery(api.categories.list, () => ({}));

  // Derived state from queries
  const loading = $derived(menuItemsQuery.isLoading || categoriesQuery.isLoading);
  const menuItems = $derived(menuItemsQuery.data ?? []);
  const categories = $derived(categoriesQuery.data ?? []);

  // Mutation handlers
  async function handleCreate() {
    await client.mutation(api.menu.create, {
      title: newTitle,
      price: newPrice,
      category: selectedCategory
    });
  }

  async function handleDelete(id: string) {
    await client.mutation(api.menu.remove, { id });
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  {#each menuItems as item}
    <div>{item.title} - {item.price} Kč</div>
  {/each}
{/if}
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
bunx convex dev

# Deploy to production
bunx convex deploy --prod
```

### File Storage
```typescript
// Upload a file
const client = useConvexClient();

// Get upload URL
const uploadUrl = await client.mutation(api.media.generateUploadUrl, {});

// Upload to storage
const response = await fetch(uploadUrl, {
  method: 'POST',
  headers: { 'Content-Type': file.type },
  body: file,
});

const { storageId } = await response.json();

// Save file record
await client.mutation(api.media.create, {
  storageId,
  filename: file.name,
  contentType: file.type,
});
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

The project is configured for Vercel deployment with `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "sveltekit",
  "env": {
    "PUBLIC_CONVEX_URL": "https://jovial-perch-285.convex.cloud"
  }
}
```

```bash
cd fulala-public
vercel --prod
```

### Environment Variables

**Local Development** (`.env.local`):
```bash
PUBLIC_CONVEX_URL=https://determined-ram-534.convex.cloud
```

**Vercel Production** (set via CLI or dashboard):
```bash
vercel env add PUBLIC_CONVEX_URL production
# Enter: https://jovial-perch-285.convex.cloud
```

### Convex Production
```bash
bunx convex deploy --prod
```

---

## Development Commands

```bash
# Start development
cd fulala-public
bun run dev          # SvelteKit server (port 5173)
bunx convex dev      # Convex dev server (separate terminal)

# Testing
bun run test:e2e     # Run Playwright tests
bun run test:e2e:ui  # Run with Playwright UI

# Building
bun run build        # Build for production
bun run preview      # Preview production build
```

---

## Troubleshooting

### Common Issues

**"Convex client not connected"**
- Ensure `bunx convex dev` is running
- Check `PUBLIC_CONVEX_URL` environment variable

**"Session expired" on admin pages**
- Clear cookies and log in again
- Check if Convex is running

**"Module not found" errors**
- Run `bun install` to ensure dependencies are installed
- Check that you're in the `fulala-public` directory

**Build fails with "PUBLIC_CONVEX_URL is not exported"**
- Set the environment variable in Vercel dashboard
- Run `vercel env add PUBLIC_CONVEX_URL production`

### Support
- GitHub Issues: [Link to repo]
- Email: hello@fulala.cz
