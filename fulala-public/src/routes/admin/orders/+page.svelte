<script lang="ts">
  import { useQuery, useMutation } from 'convex/svelte';
  import { api } from '../../../../convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Card, Badge, Tabs, Dialog } from '$lib/components/ui';

  // Queries & Mutations
  const orders = useQuery(api.orders.list, {});
  const orderStats = useQuery(api.orders.getStats, {});
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  // State
  let activeTab = $state('all');
  let selectedOrder = $state<typeof $orders extends (infer T)[] | undefined ? T : never | null>(null);
  let showOrderDetails = $state(false);

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending', badge: $orderStats?.pendingCount },
    { id: 'preparing', label: 'Preparing', badge: $orderStats?.preparingCount },
    { id: 'ready', label: 'Ready', badge: $orderStats?.readyCount },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredOrders = $derived(() => {
    if (!$orders) return [];
    if (activeTab === 'all') return $orders;
    return $orders.filter((o) => o.status === activeTab);
  });

  const statusColors: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'info',
    ready: 'success',
    served: 'success',
    completed: 'default',
    cancelled: 'danger',
  };

  const nextStatus: Record<string, string> = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready',
    ready: 'served',
    served: 'completed',
  };

  function viewOrder(order: NonNullable<typeof selectedOrder>) {
    selectedOrder = order;
    showOrderDetails = true;
  }

  async function advanceStatus(order: NonNullable<typeof selectedOrder>) {
    const next = nextStatus[order.status];
    if (next) {
      await updateOrderStatus({
        id: order._id,
        status: next as any,
      });
    }
  }

  async function cancelOrder(order: NonNullable<typeof selectedOrder>) {
    await updateOrderStatus({
      id: order._id,
      status: 'cancelled',
    });
    showOrderDetails = false;
    selectedOrder = null;
  }

  function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<svelte:head>
  <title>Orders - Fulala Admin</title>
</svelte:head>

<AdminHeader
  title="Orders"
  subtitle="Manage incoming orders in real-time"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
/>

<!-- Stats -->
<div class="mb-6 grid gap-4 sm:grid-cols-4">
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{$orderStats?.totalToday ?? 0}</p>
    <p class="text-sm text-neutral-500">Today's Orders</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-fulala-red">{$orderStats?.activeCount ?? 0}</p>
    <p class="text-sm text-neutral-500">Active</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-green-600">{$orderStats?.completedToday ?? 0}</p>
    <p class="text-sm text-neutral-500">Completed</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{($orderStats?.revenueToday ?? 0).toLocaleString()} Kč</p>
    <p class="text-sm text-neutral-500">Revenue</p>
  </Card>
</div>

<!-- Tabs -->
<Tabs
  {tabs}
  bind:activeTab
  class="mb-6"
/>

<!-- Orders Grid -->
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#if $orders === undefined}
    {#each Array(6) as _}
      <Card>
        <div class="animate-pulse space-y-3">
          <div class="flex justify-between">
            <div class="h-5 w-20 rounded bg-neutral-200"></div>
            <div class="h-5 w-16 rounded bg-neutral-200"></div>
          </div>
          <div class="h-4 w-1/2 rounded bg-neutral-200"></div>
          <div class="h-8 w-full rounded bg-neutral-200"></div>
        </div>
      </Card>
    {/each}
  {:else if filteredOrders().length === 0}
    <div class="col-span-full">
      <Card class="py-12 text-center">
        <p class="text-neutral-500">No orders found</p>
      </Card>
    </div>
  {:else}
    {#each filteredOrders() as order}
      <Card
        interactive
        onclick={() => viewOrder(order)}
        class="relative"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="font-bold text-neutral-900">{order.orderNumber}</p>
            <p class="text-sm text-neutral-500">{formatTime(order.createdAt)}</p>
          </div>
          <Badge variant={statusColors[order.status]}>
            {order.status}
          </Badge>
        </div>

        <div class="mt-3 space-y-1">
          {#each order.items.slice(0, 3) as item}
            <div class="flex justify-between text-sm">
              <span class="text-neutral-600">{item.quantity}x {item.title}</span>
              <span class="text-neutral-500">{item.price * item.quantity} Kč</span>
            </div>
          {/each}
          {#if order.items.length > 3}
            <p class="text-sm text-neutral-400">+{order.items.length - 3} more items</p>
          {/if}
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
          <span class="font-bold text-neutral-900">{order.total} Kč</span>
          {#if nextStatus[order.status]}
            <Button
              size="sm"
              onclick={(e) => { e.stopPropagation(); advanceStatus(order); }}
            >
              {nextStatus[order.status] === 'confirmed' ? 'Confirm' : ''}
              {nextStatus[order.status] === 'preparing' ? 'Start Preparing' : ''}
              {nextStatus[order.status] === 'ready' ? 'Mark Ready' : ''}
              {nextStatus[order.status] === 'served' ? 'Mark Served' : ''}
              {nextStatus[order.status] === 'completed' ? 'Complete' : ''}
            </Button>
          {/if}
        </div>
      </Card>
    {/each}
  {/if}
</div>

<!-- Order Details Dialog -->
<Dialog
  bind:open={showOrderDetails}
  title={selectedOrder?.orderNumber || 'Order Details'}
  size="lg"
>
  {#if selectedOrder}
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <Badge variant={statusColors[selectedOrder.status]} size="lg">
          {selectedOrder.status}
        </Badge>
        <span class="text-sm text-neutral-500">
          {new Date(selectedOrder.createdAt).toLocaleString('cs-CZ')}
        </span>
      </div>

      {#if selectedOrder.customerName}
        <div class="rounded-lg bg-neutral-50 p-3">
          <p class="text-sm font-medium text-neutral-500">Customer</p>
          <p class="text-neutral-900">{selectedOrder.customerName}</p>
          {#if selectedOrder.customerPhone}
            <p class="text-sm text-neutral-500">{selectedOrder.customerPhone}</p>
          {/if}
        </div>
      {/if}

      <div>
        <p class="mb-2 font-medium text-neutral-900">Items</p>
        <div class="space-y-2">
          {#each selectedOrder.items as item}
            <div class="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <div>
                <p class="font-medium text-neutral-900">{item.quantity}x {item.title}</p>
                {#if item.notes}
                  <p class="text-sm text-neutral-500">{item.notes}</p>
                {/if}
              </div>
              <p class="font-medium text-neutral-900">{item.price * item.quantity} Kč</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="border-t border-neutral-200 pt-4">
        <div class="flex justify-between text-sm">
          <span class="text-neutral-500">Subtotal</span>
          <span>{selectedOrder.subtotal} Kč</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-neutral-500">Tax (21%)</span>
          <span>{selectedOrder.tax} Kč</span>
        </div>
        <div class="mt-2 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{selectedOrder.total} Kč</span>
        </div>
      </div>

      {#if selectedOrder.notes}
        <div class="rounded-lg bg-yellow-50 p-3">
          <p class="text-sm font-medium text-yellow-800">Notes</p>
          <p class="text-yellow-700">{selectedOrder.notes}</p>
        </div>
      {/if}
    </div>
  {/if}

  {#snippet footer()}
    {#if selectedOrder && !['completed', 'cancelled'].includes(selectedOrder.status)}
      <Button variant="danger" onclick={() => selectedOrder && cancelOrder(selectedOrder)}>
        Cancel Order
      </Button>
    {/if}
    <Button variant="ghost" onclick={() => (showOrderDetails = false)}>Close</Button>
    {#if selectedOrder && nextStatus[selectedOrder.status]}
      <Button onclick={() => selectedOrder && advanceStatus(selectedOrder)}>
        {nextStatus[selectedOrder.status] === 'confirmed' ? 'Confirm Order' : ''}
        {nextStatus[selectedOrder.status] === 'preparing' ? 'Start Preparing' : ''}
        {nextStatus[selectedOrder.status] === 'ready' ? 'Mark as Ready' : ''}
        {nextStatus[selectedOrder.status] === 'served' ? 'Mark as Served' : ''}
        {nextStatus[selectedOrder.status] === 'completed' ? 'Complete Order' : ''}
      </Button>
    {/if}
  {/snippet}
</Dialog>
