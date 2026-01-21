<script lang="ts">
  import { useQuery, useMutation } from 'convex/svelte';
  import { api } from '../../../../../convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Card, Badge } from '$lib/components/ui';

  // Queries & Mutations
  const floorPlan = useQuery(api.floorPlans.getActive, {});
  const updatePosition = useMutation(api.tables.updatePosition);
  const updateTableStatus = useMutation(api.tables.updateStatus);

  // Canvas state
  let canvasWidth = $state(800);
  let canvasHeight = $state(600);
  let draggingTable = $state<string | null>(null);
  let dragOffset = $state({ x: 0, y: 0 });

  const statusColors: Record<string, string> = {
    available: 'bg-green-100 border-green-500 text-green-700',
    occupied: 'bg-red-100 border-red-500 text-red-700',
    reserved: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    cleaning: 'bg-blue-100 border-blue-500 text-blue-700',
  };

  function handleMouseDown(e: MouseEvent, tableId: string, table: any) {
    draggingTable = tableId;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handleMouseMove(e: MouseEvent) {
    if (!draggingTable || !$floorPlan) return;

    const canvas = document.getElementById('floor-plan-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvasWidth - 80, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(canvasHeight - 80, e.clientY - rect.top - dragOffset.y));

    // Update local position (optimistic)
    const table = $floorPlan.tables.find((t: any) => t._id === draggingTable);
    if (table) {
      table.position.x = x;
      table.position.y = y;
    }
  }

  async function handleMouseUp() {
    if (!draggingTable || !$floorPlan) return;

    const table = $floorPlan.tables.find((t: any) => t._id === draggingTable);
    if (table) {
      await updatePosition({
        id: table._id,
        position: table.position,
      });
    }

    draggingTable = null;
  }

  async function cycleStatus(table: any) {
    const statusOrder = ['available', 'occupied', 'reserved', 'cleaning'];
    const currentIndex = statusOrder.indexOf(table.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    await updateTableStatus({ id: table._id, status: nextStatus as any });
  }
</script>

<svelte:head>
  <title>Floor Plan - Fulala Admin</title>
</svelte:head>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<AdminHeader
  title="Floor Plan"
  subtitle="Drag tables to arrange your restaurant layout"
  breadcrumbs={[
    { label: 'Admin', href: '/admin' },
    { label: 'Tables', href: '/admin/tables' },
    { label: 'Floor Plan' },
  ]}
>
  {#snippet actions()}
    <a href="/admin/tables">
      <Button variant="secondary">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        List View
      </Button>
    </a>
  {/snippet}
</AdminHeader>

<!-- Legend -->
<Card class="mb-6">
  <div class="flex flex-wrap items-center gap-4">
    <span class="text-sm font-medium text-neutral-500">Status:</span>
    <div class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-green-500"></span>
      <span class="text-sm">Available</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-red-500"></span>
      <span class="text-sm">Occupied</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-yellow-500"></span>
      <span class="text-sm">Reserved</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-blue-500"></span>
      <span class="text-sm">Cleaning</span>
    </div>
    <span class="ml-auto text-sm text-neutral-500">Click table to change status • Drag to move</span>
  </div>
</Card>

<!-- Floor Plan Canvas -->
<Card padding="none" class="overflow-hidden">
  <div
    id="floor-plan-canvas"
    class="relative bg-neutral-50"
    style="width: {canvasWidth}px; height: {canvasHeight}px; background-image: radial-gradient(circle, #ddd 1px, transparent 1px); background-size: 20px 20px;"
  >
    {#if $floorPlan === undefined}
      <div class="flex h-full items-center justify-center">
        <div class="text-neutral-400">Loading floor plan...</div>
      </div>
    {:else if !$floorPlan || $floorPlan.tables.length === 0}
      <div class="flex h-full items-center justify-center">
        <div class="text-center">
          <p class="text-neutral-500">No tables on this floor plan</p>
          <a href="/admin/tables">
            <Button class="mt-4" variant="secondary">Add Tables</Button>
          </a>
        </div>
      </div>
    {:else}
      {#each $floorPlan.tables as table}
        <div
          class="absolute flex cursor-move select-none flex-col items-center justify-center border-2 transition-shadow hover:shadow-lg {statusColors[table.status]} {table.shape === 'round' ? 'rounded-full' : 'rounded-lg'}"
          style="left: {table.position.x}px; top: {table.position.y}px; width: {table.position.width}px; height: {table.position.height}px; {table.position.rotation ? `transform: rotate(${table.position.rotation}deg)` : ''}"
          onmousedown={(e) => handleMouseDown(e, table._id, table)}
          onclick={() => cycleStatus(table)}
          role="button"
          tabindex="0"
        >
          <span class="text-xs font-bold">{table.name}</span>
          <span class="text-[10px]">{table.capacity} seats</span>
          {#if table.currentOrder}
            <Badge variant="danger" size="sm" class="mt-1">
              #{table.currentOrder.orderNumber.split('-')[1]}
            </Badge>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</Card>
