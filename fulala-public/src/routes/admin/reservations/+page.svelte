<script lang="ts">
  import { useQuery, useMutation } from 'convex/svelte';
  import { api } from '../../../../convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Card, Badge, Dialog, Input, Select, Tabs } from '$lib/components/ui';

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Queries & Mutations
  const reservations = useQuery(api.reservations.list, { date: today });
  const stats = useQuery(api.reservations.getStats, { date: today });
  const tables = useQuery(api.tables.list, { activeOnly: true });
  const createReservation = useMutation(api.reservations.create);
  const updateReservation = useMutation(api.reservations.update);
  const updateStatus = useMutation(api.reservations.updateStatus);
  const assignTable = useMutation(api.reservations.assignTable);
  const cancelReservation = useMutation(api.reservations.cancel);

  // State
  let selectedDate = $state(today);
  let showCreateDialog = $state(false);
  let showDetailsDialog = $state(false);
  let selectedReservation = $state<typeof $reservations extends (infer T)[] | undefined ? T : never | null>(null);

  let formData = $state({
    guestName: '',
    phone: '',
    email: '',
    partySize: 2,
    date: today,
    timeSlot: '18:00',
    notes: '',
    specialRequests: '',
  });

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
  ];

  const statusColors: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    seated: 'success',
    completed: 'default',
    cancelled: 'danger',
    no_show: 'danger',
  };

  const tableOptions = $derived(() => {
    if (!$tables) return [];
    return $tables.map((t) => ({ value: t._id, label: `${t.name} (${t.capacity} seats)` }));
  });

  function openCreateDialog() {
    formData = {
      guestName: '',
      phone: '',
      email: '',
      partySize: 2,
      date: selectedDate,
      timeSlot: '18:00',
      notes: '',
      specialRequests: '',
    };
    showCreateDialog = true;
  }

  function openDetails(reservation: NonNullable<typeof selectedReservation>) {
    selectedReservation = reservation;
    showDetailsDialog = true;
  }

  async function handleCreate() {
    await createReservation({
      guestName: formData.guestName,
      phone: formData.phone,
      email: formData.email || undefined,
      partySize: formData.partySize,
      date: formData.date,
      timeSlot: formData.timeSlot,
      notes: formData.notes || undefined,
      specialRequests: formData.specialRequests || undefined,
    });
    showCreateDialog = false;
  }

  async function handleStatusChange(status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show') {
    if (!selectedReservation) return;
    await updateStatus({ id: selectedReservation._id, status });
    showDetailsDialog = false;
    selectedReservation = null;
  }

  async function handleAssignTable(tableId: string) {
    if (!selectedReservation) return;
    await assignTable({ id: selectedReservation._id, tableId: tableId as any });
  }

  function formatTime(time: string): string {
    return time;
  }
</script>

<svelte:head>
  <title>Reservations - Fulala Admin</title>
</svelte:head>

<AdminHeader
  title="Reservations"
  subtitle="Manage table bookings"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Reservations' }]}
>
  {#snippet actions()}
    <input
      type="date"
      bind:value={selectedDate}
      class="rounded-lg border border-neutral-300 px-3 py-2"
    />
    <Button onclick={openCreateDialog}>
      <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      New Reservation
    </Button>
  {/snippet}
</AdminHeader>

<!-- Stats -->
<div class="mb-6 grid gap-4 sm:grid-cols-4">
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{$stats?.total ?? 0}</p>
    <p class="text-sm text-neutral-500">Total</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-blue-600">{$stats?.confirmed ?? 0}</p>
    <p class="text-sm text-neutral-500">Confirmed</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-green-600">{$stats?.seated ?? 0}</p>
    <p class="text-sm text-neutral-500">Seated</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{$stats?.totalGuests ?? 0}</p>
    <p class="text-sm text-neutral-500">Expected Guests</p>
  </Card>
</div>

<!-- Reservations List -->
<Card>
  {#if $reservations === undefined}
    <div class="space-y-3">
      {#each Array(5) as _}
        <div class="animate-pulse flex items-center gap-4 rounded-lg bg-neutral-50 p-4">
          <div class="h-10 w-10 rounded-full bg-neutral-200"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-1/4 rounded bg-neutral-200"></div>
            <div class="h-3 w-1/2 rounded bg-neutral-200"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if $reservations.length === 0}
    <div class="py-12 text-center">
      <p class="text-neutral-500">No reservations for {selectedDate}</p>
      <Button class="mt-4" onclick={openCreateDialog}>Create Reservation</Button>
    </div>
  {:else}
    <div class="divide-y divide-neutral-100">
      {#each $reservations as reservation}
        <div
          class="flex cursor-pointer items-center gap-4 p-4 hover:bg-neutral-50"
          onclick={() => openDetails(reservation)}
          role="button"
          tabindex="0"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-fulala-red/10 text-fulala-red font-bold">
            {reservation.partySize}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="font-semibold text-neutral-900">{reservation.guestName}</p>
              <Badge variant={statusColors[reservation.status]} size="sm">
                {reservation.status}
              </Badge>
            </div>
            <p class="text-sm text-neutral-500">
              {formatTime(reservation.timeSlot)} • {reservation.phone}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-neutral-500">
              {#if reservation.tableId}
                Table assigned
              {:else}
                <span class="text-yellow-600">No table</span>
              {/if}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</Card>

<!-- Create Dialog -->
<Dialog bind:open={showCreateDialog} title="New Reservation" size="lg">
  <form onsubmit={(e) => { e.preventDefault(); handleCreate(); }} class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <Input
        label="Guest Name"
        bind:value={formData.guestName}
        required
      />
      <Input
        label="Phone"
        type="tel"
        bind:value={formData.phone}
        required
      />
    </div>

    <Input
      label="Email (optional)"
      type="email"
      bind:value={formData.email}
    />

    <div class="grid gap-4 sm:grid-cols-3">
      <Input
        type="number"
        label="Party Size"
        bind:value={formData.partySize}
        min="1"
        max="20"
        required
      />
      <Input
        type="date"
        label="Date"
        bind:value={formData.date}
        required
      />
      <Select
        label="Time"
        options={timeSlots.map((t) => ({ value: t, label: t }))}
        bind:value={formData.timeSlot}
      />
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-neutral-700">Notes</label>
      <textarea
        class="w-full rounded-lg border border-neutral-300 px-3 py-2"
        rows="2"
        bind:value={formData.notes}
      ></textarea>
    </div>
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showCreateDialog = false)}>Cancel</Button>
    <Button onclick={handleCreate}>Create Reservation</Button>
  {/snippet}
</Dialog>

<!-- Details Dialog -->
<Dialog
  bind:open={showDetailsDialog}
  title={selectedReservation?.guestName || 'Reservation Details'}
  size="lg"
>
  {#if selectedReservation}
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <Badge variant={statusColors[selectedReservation.status]} size="lg">
          {selectedReservation.status}
        </Badge>
        <span class="text-neutral-500">
          {selectedReservation.date} at {selectedReservation.timeSlot}
        </span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-lg bg-neutral-50 p-3">
          <p class="text-sm text-neutral-500">Contact</p>
          <p class="font-medium">{selectedReservation.phone}</p>
          {#if selectedReservation.email}
            <p class="text-sm">{selectedReservation.email}</p>
          {/if}
        </div>
        <div class="rounded-lg bg-neutral-50 p-3">
          <p class="text-sm text-neutral-500">Party Size</p>
          <p class="text-2xl font-bold">{selectedReservation.partySize}</p>
        </div>
      </div>

      {#if selectedReservation.notes}
        <div class="rounded-lg bg-yellow-50 p-3">
          <p class="text-sm font-medium text-yellow-800">Notes</p>
          <p class="text-yellow-700">{selectedReservation.notes}</p>
        </div>
      {/if}

      {#if !selectedReservation.tableId && tableOptions().length > 0}
        <div>
          <label class="mb-1.5 block text-sm font-medium text-neutral-700">Assign Table</label>
          <select
            class="w-full rounded-lg border border-neutral-300 px-3 py-2"
            onchange={(e) => handleAssignTable((e.target as HTMLSelectElement).value)}
          >
            <option value="">Select a table...</option>
            {#each tableOptions() as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      {/if}
    </div>
  {/if}

  {#snippet footer()}
    {#if selectedReservation && !['completed', 'cancelled', 'no_show'].includes(selectedReservation.status)}
      <Button variant="danger" onclick={() => handleStatusChange('cancelled')}>
        Cancel
      </Button>
      <Button variant="ghost" onclick={() => handleStatusChange('no_show')}>
        No Show
      </Button>
    {/if}
    <div class="flex-1"></div>
    {#if selectedReservation?.status === 'pending'}
      <Button onclick={() => handleStatusChange('confirmed')}>Confirm</Button>
    {:else if selectedReservation?.status === 'confirmed'}
      <Button onclick={() => handleStatusChange('seated')}>Mark Seated</Button>
    {:else if selectedReservation?.status === 'seated'}
      <Button onclick={() => handleStatusChange('completed')}>Complete</Button>
    {/if}
  {/snippet}
</Dialog>
