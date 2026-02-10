<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Card, Badge, Dialog } from '$lib/components/ui';

  // Convex client for mutations
  const client = useConvexClient();

  // Queries
  const qrCodesQuery = useQuery(api.qrCodes.list, () => ({}));
  const statsQuery = useQuery(api.qrCodes.getStats, () => ({}));
  const tablesQuery = useQuery(api.tables.list, () => ({ activeOnly: true }));

  // State
  let showCreateDialog = $state(false);
  let showQRDialog = $state(false);
  let selectedQR = $state<NonNullable<typeof qrCodesQuery.data>[number] | null>(null);
  let newQRType = $state<'table_order' | 'menu_view' | 'reservation'>('table_order');
  let newQRTableId = $state<string>('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fulala.cz';

  async function handleCreate() {
    await client.mutation(api.qrCodes.create, {
      type: newQRType,
      tableId: newQRTableId ? (newQRTableId as any) : undefined,
      baseUrl,
    });
    showCreateDialog = false;
    newQRType = 'table_order';
    newQRTableId = '';
  }

  async function handleGenerateAll() {
    await client.mutation(api.qrCodes.generateForAllTables, { baseUrl });
  }

  async function handleToggle(qr: NonNullable<typeof selectedQR>) {
    await client.mutation(api.qrCodes.toggleActive, { id: qr._id });
  }

  async function handleRegenerate(qr: NonNullable<typeof selectedQR>) {
    await client.mutation(api.qrCodes.regenerate, { id: qr._id });
  }

  async function handleDelete(qr: NonNullable<typeof selectedQR>) {
    if (confirm('Delete this QR code?')) {
      await client.mutation(api.qrCodes.remove, { id: qr._id });
    }
  }

  function viewQR(qr: NonNullable<typeof selectedQR>) {
    selectedQR = qr;
    showQRDialog = true;
  }

  function getQRImageUrl(code: string): string {
    // Using a QR code API service
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`;
  }

  function downloadQR(qr: NonNullable<typeof selectedQR>) {
    const link = document.createElement('a');
    link.href = getQRImageUrl(qr.url);
    link.download = `qr-${qr.code}.png`;
    link.click();
  }
</script>

<svelte:head>
  <title>QR Codes - FULALA Admin</title>
</svelte:head>

<AdminHeader
  title="QR Codes"
  subtitle="Generate and manage QR codes for tables and menus"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'QR Codes' }]}
>
  {#snippet actions()}
    <Button variant="secondary" onclick={handleGenerateAll}>
      Generate for All Tables
    </Button>
    <Button onclick={() => (showCreateDialog = true)}>
      <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Create QR Code
    </Button>
  {/snippet}
</AdminHeader>

<!-- Stats -->
<div class="mb-6 grid gap-4 sm:grid-cols-4">
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{statsQuery.data?.total ?? 0}</p>
    <p class="text-sm text-neutral-500">Total Codes</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-green-600">{statsQuery.data?.active ?? 0}</p>
    <p class="text-sm text-neutral-500">Active</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-blue-600">{statsQuery.data?.totalScans ?? 0}</p>
    <p class="text-sm text-neutral-500">Total Scans</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{statsQuery.data?.tableOrderCodes ?? 0}</p>
    <p class="text-sm text-neutral-500">Table QRs</p>
  </Card>
</div>

<!-- QR Codes Grid -->
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {#if qrCodesQuery.data === undefined}
    {#each Array(8) as _}
      <Card>
        <div class="animate-pulse space-y-3">
          <div class="mx-auto h-32 w-32 rounded bg-neutral-200"></div>
          <div class="h-4 w-1/2 mx-auto rounded bg-neutral-200"></div>
        </div>
      </Card>
    {/each}
  {:else if qrCodesQuery.data.length === 0}
    <div class="col-span-full">
      <Card class="py-12 text-center">
        <p class="text-neutral-500">No QR codes yet</p>
        <Button class="mt-4" onclick={() => (showCreateDialog = true)}>Create QR Code</Button>
      </Card>
    </div>
  {:else}
    {#each qrCodesQuery.data as qr}
      <Card class="text-center">
        <div
          class="mx-auto mb-3 cursor-pointer rounded-lg bg-white p-2 shadow-sm hover:shadow-md transition-shadow"
          onclick={() => viewQR(qr)}
          role="button"
          tabindex="0"
        >
          <img
            src={getQRImageUrl(qr.url)}
            alt="QR Code for {qr.code}"
            class="h-32 w-32 mx-auto"
          />
        </div>

        <p class="font-mono text-sm font-bold">{qr.code}</p>
        <p class="text-sm text-neutral-500">
          {qr.type === 'table_order' ? 'Table Order' : qr.type === 'menu_view' ? 'Menu View' : 'Reservation'}
        </p>

        {#if qr.table}
          <Badge variant="primary" class="mt-2">{qr.table.name}</Badge>
        {/if}

        <div class="mt-3 flex items-center justify-center gap-2">
          <Badge variant={qr.isActive ? 'success' : 'danger'} dot>
            {qr.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <span class="text-xs text-neutral-400">{qr.scansCount} scans</span>
        </div>

        <div class="mt-3 flex justify-center gap-2">
          <button
            class="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            onclick={() => viewQR(qr)}
            title="View"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            class="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            onclick={() => handleToggle(qr)}
            title={qr.isActive ? 'Deactivate' : 'Activate'}
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </button>
          <button
            class="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            onclick={() => handleRegenerate(qr)}
            title="Regenerate"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            class="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
            onclick={() => handleDelete(qr)}
            title="Delete"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </Card>
    {/each}
  {/if}
</div>

<!-- Create Dialog -->
<Dialog bind:open={showCreateDialog} title="Create QR Code">
  <form onsubmit={(e) => { e.preventDefault(); handleCreate(); }} class="space-y-4">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-neutral-700">Type</label>
      <select
        class="w-full rounded-lg border border-neutral-300 px-3 py-2"
        bind:value={newQRType}
      >
        <option value="table_order">Table Order</option>
        <option value="menu_view">Menu View</option>
        <option value="reservation">Reservation</option>
      </select>
    </div>

    {#if newQRType === 'table_order' && tablesQuery.data}
      <div>
        <label class="mb-1.5 block text-sm font-medium text-neutral-700">Table (optional)</label>
        <select
          class="w-full rounded-lg border border-neutral-300 px-3 py-2"
          bind:value={newQRTableId}
        >
          <option value="">No specific table</option>
          {#each tablesQuery.data as table}
            <option value={table._id}>{table.name}</option>
          {/each}
        </select>
      </div>
    {/if}
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showCreateDialog = false)}>Cancel</Button>
    <Button onclick={handleCreate}>Create</Button>
  {/snippet}
</Dialog>

<!-- View QR Dialog -->
<Dialog bind:open={showQRDialog} title={selectedQR?.code || 'QR Code'} size="sm">
  {#if selectedQR}
    <div class="text-center">
      <img
        src={getQRImageUrl(selectedQR.url)}
        alt="QR Code"
        class="mx-auto h-64 w-64"
      />

      <p class="mt-4 font-mono text-xs text-neutral-500 break-all">
        {selectedQR.url}
      </p>

      <div class="mt-4 flex justify-center gap-2">
        <Button variant="secondary" onclick={() => selectedQR && downloadQR(selectedQR)}>
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </Button>
        <Button onclick={() => window.open(selectedQR?.url, '_blank')}>
          Open Link
        </Button>
      </div>
    </div>
  {/if}
</Dialog>
