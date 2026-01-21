<script lang="ts">
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { AdminHeader, DashboardMetric } from '$lib/components/admin';
  import { Card, Badge, Button } from '$lib/components/ui';

  // Queries - convex-svelte returns {isLoading, error, data}
  const orderStatsQuery = useQuery(api.orders.getStats, () => ({}));
  const tableStatsQuery = useQuery(api.tables.getStats, () => ({}));
  const reservationStatsQuery = useQuery(api.reservations.getStats, () => ({}));

  // Derived data
  const orderStats = $derived(orderStatsQuery.data);
  const tableStats = $derived(tableStatsQuery.data);
  const reservationStats = $derived(reservationStatsQuery.data);

  // Recent orders (mock for now)
  const recentOrders = [
    { id: '1', orderNumber: 'ORD-001', table: 'Table 3', total: 485, status: 'preparing' },
    { id: '2', orderNumber: 'ORD-002', table: 'Table 7', total: 320, status: 'ready' },
    { id: '3', orderNumber: 'ORD-003', table: 'Table 1', total: 750, status: 'pending' },
  ];

  const statusColors: Record<string, 'warning' | 'success' | 'info' | 'danger'> = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'info',
    ready: 'success',
    served: 'success',
    completed: 'success',
    cancelled: 'danger',
  };
</script>

<svelte:head>
  <title>Dashboard - Fulala Admin</title>
</svelte:head>

<AdminHeader
  title="Dashboard"
  subtitle="Welcome back! Here's what's happening today."
/>

<!-- Stats Grid -->
<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <DashboardMetric
    label="Today's Orders"
    value={orderStats?.totalToday ?? 0}
    change={12}
    trend="up"
    variant="primary"
  >
    {#snippet icon()}
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    {/snippet}
  </DashboardMetric>

  <DashboardMetric
    label="Revenue Today"
    value="{(orderStats?.revenueToday ?? 0).toLocaleString()} Kč"
    change={8}
    trend="up"
    variant="success"
  >
    {#snippet icon()}
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    {/snippet}
  </DashboardMetric>

  <DashboardMetric
    label="Tables Available"
    value="{tableStats?.available ?? 0}/{tableStats?.total ?? 0}"
    variant="default"
  >
    {#snippet icon()}
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    {/snippet}
  </DashboardMetric>

  <DashboardMetric
    label="Reservations Today"
    value={reservationStats?.total ?? 0}
    change={5}
    trend="up"
    variant="warning"
  >
    {#snippet icon()}
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    {/snippet}
  </DashboardMetric>
</div>

<!-- Content Grid -->
<div class="grid gap-6 lg:grid-cols-2">
  <!-- Active Orders -->
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-neutral-900">Active Orders</h2>
        <a href="/admin/orders" class="text-sm text-fulala-red hover:underline">View all</a>
      </div>
    {/snippet}

    <div class="divide-y divide-neutral-100">
      {#each recentOrders as order}
        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium text-neutral-900">{order.orderNumber}</p>
            <p class="text-sm text-neutral-500">{order.table}</p>
          </div>
          <div class="text-right">
            <p class="font-medium text-neutral-900">{order.total} Kč</p>
            <Badge variant={statusColors[order.status]} size="sm">
              {order.status}
            </Badge>
          </div>
        </div>
      {:else}
        <p class="py-8 text-center text-neutral-500">No active orders</p>
      {/each}
    </div>
  </Card>

  <!-- Quick Actions -->
  <Card>
    {#snippet header()}
      <h2 class="font-semibold text-neutral-900">Quick Actions</h2>
    {/snippet}

    <div class="grid gap-3 sm:grid-cols-2">
      <a
        href="/admin/menu"
        class="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
      >
        <div class="rounded-lg bg-fulala-red/10 p-2 text-fulala-red">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-neutral-900">Add Menu Item</p>
          <p class="text-sm text-neutral-500">Create new dish</p>
        </div>
      </a>

      <a
        href="/admin/reservations"
        class="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
      >
        <div class="rounded-lg bg-green-100 p-2 text-green-600">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-neutral-900">New Reservation</p>
          <p class="text-sm text-neutral-500">Book a table</p>
        </div>
      </a>

      <a
        href="/admin/tables/floor-plan"
        class="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
      >
        <div class="rounded-lg bg-blue-100 p-2 text-blue-600">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-neutral-900">Floor Plan</p>
          <p class="text-sm text-neutral-500">Manage tables</p>
        </div>
      </a>

      <a
        href="/admin/qr-codes"
        class="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
      >
        <div class="rounded-lg bg-purple-100 p-2 text-purple-600">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-neutral-900">QR Codes</p>
          <p class="text-sm text-neutral-500">Generate & print</p>
        </div>
      </a>
    </div>
  </Card>

  <!-- Order Status Overview -->
  <Card>
    {#snippet header()}
      <h2 class="font-semibold text-neutral-900">Order Status</h2>
    {/snippet}

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-neutral-600">Pending</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
            <div class="h-full w-1/4 bg-yellow-500"></div>
          </div>
          <span class="text-sm font-medium">{orderStats?.pendingCount ?? 0}</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-neutral-600">Preparing</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
            <div class="h-full w-1/2 bg-blue-500"></div>
          </div>
          <span class="text-sm font-medium">{orderStats?.preparingCount ?? 0}</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-neutral-600">Ready</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
            <div class="h-full w-1/3 bg-green-500"></div>
          </div>
          <span class="text-sm font-medium">{orderStats?.readyCount ?? 0}</span>
        </div>
      </div>
    </div>
  </Card>

  <!-- Today's Reservations -->
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-neutral-900">Today's Reservations</h2>
        <a href="/admin/reservations" class="text-sm text-fulala-red hover:underline">View all</a>
      </div>
    {/snippet}

    <div class="space-y-3">
      <div class="flex items-center gap-3 text-sm text-neutral-500">
        <span class="font-medium">{reservationStats?.confirmed ?? 0} confirmed</span>
        <span>•</span>
        <span>{reservationStats?.totalGuests ?? 0} guests expected</span>
      </div>

      <p class="py-4 text-center text-neutral-400">
        Reservation list will appear here
      </p>
    </div>
  </Card>
</div>
