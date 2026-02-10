<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Card, Badge, Dialog, Input, Select } from '$lib/components/ui';

  // Convex client for mutations
  const client = useConvexClient();

  // Queries
  const tablesQuery = useQuery(api.tables.list, () => ({ activeOnly: true }));
  const tableStatsQuery = useQuery(api.tables.getStats, () => ({}));

  // State
  let showCreateDialog = $state(false);
  let showEditDialog = $state(false);
  let selectedTable = $state<NonNullable<typeof tablesQuery.data>[number] | null>(null);

  let formData = $state({
    name: '',
    capacity: 4,
    shape: 'square' as 'round' | 'square' | 'rectangle',
  });

  const statusColors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
    available: 'success',
    occupied: 'danger',
    reserved: 'warning',
    cleaning: 'info',
  };

  const shapeOptions = [
    { value: 'round', label: 'Round' },
    { value: 'square', label: 'Square' },
    { value: 'rectangle', label: 'Rectangle' },
  ];

  function openCreateDialog() {
    formData = { name: '', capacity: 4, shape: 'square' };
    showCreateDialog = true;
  }

  function openEditDialog(table: NonNullable<typeof selectedTable>) {
    selectedTable = table;
    formData = {
      name: table.name,
      capacity: table.capacity,
      shape: table.shape,
    };
    showEditDialog = true;
  }

  async function handleCreate() {
    await client.mutation(api.tables.create, {
      name: formData.name,
      capacity: formData.capacity,
      shape: formData.shape,
      position: { x: 50, y: 50, width: 80, height: 80 },
    });
    showCreateDialog = false;
  }

  async function handleUpdate() {
    if (!selectedTable) return;
    await client.mutation(api.tables.update, {
      id: selectedTable._id,
      name: formData.name,
      capacity: formData.capacity,
      shape: formData.shape,
    });
    showEditDialog = false;
    selectedTable = null;
  }

  async function handleStatusChange(table: NonNullable<typeof selectedTable>, status: 'available' | 'occupied' | 'reserved' | 'cleaning') {
    await client.mutation(api.tables.updateStatus, { id: table._id, status });
  }

  async function handleDelete() {
    if (!selectedTable) return;
    await client.mutation(api.tables.remove, { id: selectedTable._id });
    showEditDialog = false;
    selectedTable = null;
  }
</script>

<svelte:head>
  <title>Tables - FULALA Admin</title>
</svelte:head>

<AdminHeader
  title="Tables"
  subtitle="Manage restaurant seating"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Tables' }]}
>
  {#snippet actions()}
    <a href="/admin/tables/floor-plan">
      <Button variant="secondary">
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Floor Plan
      </Button>
    </a>
    <Button onclick={openCreateDialog}>
      <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Table
    </Button>
  {/snippet}
</AdminHeader>

<!-- Stats -->
<div class="mb-6 grid gap-4 sm:grid-cols-5">
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{tableStatsQuery.data?.total ?? 0}</p>
    <p class="text-sm text-neutral-500">Total Tables</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-green-600">{tableStatsQuery.data?.available ?? 0}</p>
    <p class="text-sm text-neutral-500">Available</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-red-600">{tableStatsQuery.data?.occupied ?? 0}</p>
    <p class="text-sm text-neutral-500">Occupied</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-yellow-600">{tableStatsQuery.data?.reserved ?? 0}</p>
    <p class="text-sm text-neutral-500">Reserved</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{tableStatsQuery.data?.totalCapacity ?? 0}</p>
    <p class="text-sm text-neutral-500">Total Seats</p>
  </Card>
</div>

<!-- Tables Grid -->
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {#if tablesQuery.data === undefined}
    {#each Array(8) as _}
      <Card>
        <div class="animate-pulse space-y-3">
          <div class="h-6 w-1/2 rounded bg-neutral-200"></div>
          <div class="h-4 w-1/4 rounded bg-neutral-200"></div>
        </div>
      </Card>
    {/each}
  {:else if tablesQuery.data.length === 0}
    <div class="col-span-full">
      <Card class="py-12 text-center">
        <p class="text-neutral-500">No tables yet. Add your first table to get started.</p>
        <Button class="mt-4" onclick={openCreateDialog}>Add Table</Button>
      </Card>
    </div>
  {:else}
    {#each tablesQuery.data as table}
      <Card class="group">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-neutral-900">{table.name}</h3>
            <p class="text-sm text-neutral-500">{table.capacity} seats • {table.shape}</p>
          </div>
          <Badge variant={statusColors[table.status]} dot>
            {table.status}
          </Badge>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <select
            class="rounded border border-neutral-200 px-2 py-1 text-sm"
            value={table.status}
            onchange={(e) => handleStatusChange(table, (e.target as HTMLSelectElement).value as any)}
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="cleaning">Cleaning</option>
          </select>

          <button
            class="rounded px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
            onclick={() => openEditDialog(table)}
          >
            Edit
          </button>
        </div>
      </Card>
    {/each}
  {/if}
</div>

<!-- Create Dialog -->
<Dialog bind:open={showCreateDialog} title="Add Table">
  <form onsubmit={(e) => { e.preventDefault(); handleCreate(); }} class="space-y-4">
    <Input
      label="Table Name"
      placeholder="e.g., Table 1, Booth A"
      bind:value={formData.name}
      required
    />

    <Input
      type="number"
      label="Capacity"
      bind:value={formData.capacity}
      min="1"
      max="20"
      required
    />

    <Select
      label="Shape"
      options={shapeOptions}
      bind:value={formData.shape}
    />
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showCreateDialog = false)}>Cancel</Button>
    <Button onclick={handleCreate}>Create Table</Button>
  {/snippet}
</Dialog>

<!-- Edit Dialog -->
<Dialog bind:open={showEditDialog} title="Edit Table">
  <form onsubmit={(e) => { e.preventDefault(); handleUpdate(); }} class="space-y-4">
    <Input
      label="Table Name"
      bind:value={formData.name}
      required
    />

    <Input
      type="number"
      label="Capacity"
      bind:value={formData.capacity}
      min="1"
      max="20"
      required
    />

    <Select
      label="Shape"
      options={shapeOptions}
      bind:value={formData.shape}
    />
  </form>

  {#snippet footer()}
    <Button variant="danger" onclick={handleDelete}>Delete</Button>
    <div class="flex-1"></div>
    <Button variant="ghost" onclick={() => (showEditDialog = false)}>Cancel</Button>
    <Button onclick={handleUpdate}>Save Changes</Button>
  {/snippet}
</Dialog>
