<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { Button, Card, Tabs } from '$lib/components/ui';
  import { getT } from '$lib/i18n/store.svelte';

  const client = useConvexClient();

  const inputClass = 'w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red';

  // Tab state
  let activeTab = $state('table');

  // ---- TABLE RESERVATION STATE ----
  let selectedDate = $state(new Date().toISOString().split('T')[0]);
  let selectedTime = $state('');
  let partySize = $state(2);

  const availableSlotsQuery = useQuery(api.reservations.getAvailableSlots, () => ({
    date: selectedDate,
    partySize,
  }));

  let tableForm = $state({
    guestName: '',
    phone: '',
    email: '',
    specialRequests: '',
  });

  // ---- SPACE BOOKING STATE ----
  let spaceDate = $state(new Date().toISOString().split('T')[0]);
  let selectedBlock = $state('');
  let spacePartySize = $state(10);
  let eventType = $state('');

  const spaceAvailabilityQuery = useQuery(api.reservations.getSpaceAvailability, () => ({
    date: spaceDate,
  }));

  let spaceForm = $state({
    guestName: '',
    phone: '',
    email: '',
    specialRequests: '',
  });

  // ---- MANAGE RESERVATION STATE ----
  let lookupPhone = $state('');
  let lookupResults = $state<any[] | null>(null);
  let lookingUp = $state(false);
  let cancellingId = $state<string | null>(null);
  let cancelSuccess = $state('');

  // ---- SHARED STATE ----
  let submitted = $state(false);
  let submitting = $state(false);
  let error = $state('');
  let confirmationDetails = $state<{
    type: 'table' | 'space';
    guestName: string;
    date: string;
    time: string;
    endTime?: string;
    partySize: number;
    eventType?: string;
  } | null>(null);

  const timeOptions = $derived(() => {
    const slots = availableSlotsQuery.data;
    if (!slots) return [];
    return slots
      .filter((slot) => slot.available)
      .map((slot) => ({
        value: slot.time,
        label: `${slot.time} (${slot.tablesAvailable} tables)`,
      }));
  });

  function getTabs() {
    const t = getT();
    return [
      { id: 'table', label: t.reserveTable },
      { id: 'space', label: t.reserveSpace },
      { id: 'manage', label: t.manageReservation },
    ];
  }

  async function handleTableSubmit(e: Event) {
    e.preventDefault();
    error = '';

    if (!selectedTime) {
      error = 'Please select a time slot';
      return;
    }

    submitting = true;

    try {
      await client.mutation(api.reservations.create, {
        reservationType: 'table',
        guestName: tableForm.guestName,
        phone: tableForm.phone,
        email: tableForm.email || undefined,
        partySize,
        date: selectedDate,
        timeSlot: selectedTime,
        specialRequests: tableForm.specialRequests || undefined,
      });

      confirmationDetails = {
        type: 'table',
        guestName: tableForm.guestName,
        date: selectedDate,
        time: selectedTime,
        partySize,
      };
      submitted = true;
    } catch (err) {
      error = 'Failed to create reservation. Please try again.';
    } finally {
      submitting = false;
    }
  }

  async function handleSpaceSubmit(e: Event) {
    e.preventDefault();
    error = '';

    if (!selectedBlock || !eventType) {
      error = 'Please select a time block and event type';
      return;
    }

    const block = spaceAvailabilityQuery.data?.find((b) => b.id === selectedBlock);
    if (!block) return;

    submitting = true;

    try {
      await client.mutation(api.reservations.create, {
        reservationType: 'space',
        guestName: spaceForm.guestName,
        phone: spaceForm.phone,
        email: spaceForm.email || undefined,
        partySize: spacePartySize,
        date: spaceDate,
        timeSlot: block.start,
        endTime: block.end,
        eventType,
        specialRequests: spaceForm.specialRequests || undefined,
      });

      confirmationDetails = {
        type: 'space',
        guestName: spaceForm.guestName,
        date: spaceDate,
        time: block.start,
        endTime: block.end,
        partySize: spacePartySize,
        eventType,
      };
      submitted = true;
    } catch (err: any) {
      error = err?.message || 'Failed to create booking. Please try again.';
    } finally {
      submitting = false;
    }
  }

  async function handleLookup() {
    if (!lookupPhone.trim()) return;
    lookingUp = true;
    cancelSuccess = '';
    try {
      const results = await client.query(api.reservations.getByPhone, { phone: lookupPhone.trim() });
      const today = new Date().toISOString().split('T')[0];
      lookupResults = results
        .filter((r) => r.date >= today && r.status !== 'completed' && r.status !== 'no_show')
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      lookupResults = [];
    } finally {
      lookingUp = false;
    }
  }

  async function handleCancel(id: string) {
    const t = getT();
    if (!confirm(t.manageCancelConfirm)) return;
    cancellingId = id;
    try {
      await client.mutation(api.reservations.cancel, { id: id as any });
      cancelSuccess = t.manageCancelled;
      await handleLookup();
    } catch {
      // ignore
    } finally {
      cancellingId = null;
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function resetAll() {
    submitted = false;
    confirmationDetails = null;
    error = '';
    tableForm = { guestName: '', phone: '', email: '', specialRequests: '' };
    spaceForm = { guestName: '', phone: '', email: '', specialRequests: '' };
    selectedTime = '';
    selectedBlock = '';
    eventType = '';
  }

  function getEventTypeLabel(type: string): string {
    const t = getT();
    const map: Record<string, string> = {
      party: t.reserveEventParty,
      meeting: t.reserveEventMeeting,
      dinner: t.reserveEventDinner,
      workshop: t.reserveEventWorkshop,
      other: t.reserveEventOther,
    };
    return map[type] || type;
  }

  function getStatusLabel(status: string): string {
    const t = getT();
    if (status === 'pending') return t.manageStatusPending;
    if (status === 'confirmed') return t.manageStatusConfirmed;
    if (status === 'cancelled') return t.manageStatusCancelled;
    return status;
  }

  function getStatusColor(status: string): string {
    if (status === 'confirmed') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-neutral-100 text-neutral-800';
  }
</script>

<svelte:head>
  <title>{getT().navReservations} | FULALA</title>
  <meta name="description" content="Reserve your table or book the downstairs space at FULALA." />
</svelte:head>

<main class="min-h-screen bg-tiger-orange/30 pt-24 pb-16">
  <div class="mx-auto max-w-2xl px-4">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="font-heading text-5xl text-fulala-red md:text-6xl">{getT().navReservations}</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-8">
      <Tabs
        tabs={getTabs()}
        activeTab={activeTab}
        variant="pills"
        fullWidth
        onTabChange={(id) => { activeTab = id; error = ''; }}
      />
    </div>

    {#if submitted && confirmationDetails}
      <!-- Confirmation -->
      <Card class="text-center">
        <div class="py-8">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 class="font-heading text-3xl text-fulala-red">{getT().reserveConfirmed}</h2>
          <p class="mt-2 text-soy-brown">{getT().reserveConfirmedDesc}, {confirmationDetails.guestName}!</p>

          <div class="mt-8 rounded-xl bg-tiger-orange/50 p-6">
            <div class="grid gap-4 text-left sm:grid-cols-2">
              <div>
                <p class="text-sm text-soy-brown/70">{getT().reserveDate}</p>
                <p class="font-medium text-soy-brown">{formatDate(confirmationDetails.date)}</p>
              </div>
              <div>
                <p class="text-sm text-soy-brown/70">{getT().reserveTime}</p>
                <p class="font-medium text-soy-brown">
                  {confirmationDetails.time}{#if confirmationDetails.endTime} – {confirmationDetails.endTime}{/if}
                </p>
              </div>
              <div>
                <p class="text-sm text-soy-brown/70">{getT().reservePartySize}</p>
                <p class="font-medium text-soy-brown">{confirmationDetails.partySize} {getT().reserveGuestLabel}</p>
              </div>
              {#if confirmationDetails.eventType}
                <div>
                  <p class="text-sm text-soy-brown/70">{getT().reserveEventType}</p>
                  <p class="font-medium text-soy-brown">{getEventTypeLabel(confirmationDetails.eventType)}</p>
                </div>
              {/if}
            </div>
          </div>

          <p class="mt-6 text-sm text-soy-brown/70">
            {getT().reserveArriveNote}
          </p>

          <div class="mt-8 flex justify-center gap-4">
            <a href="/menu">
              <Button variant="secondary">{getT().viewMenu}</Button>
            </a>
            <Button onclick={resetAll}>
              {getT().reserveAnother}
            </Button>
          </div>
        </div>
      </Card>
    {:else if activeTab === 'table'}
      <!-- TABLE RESERVATION FORM -->
      <Card>
        <form onsubmit={handleTableSubmit} class="space-y-6">
          <p class="text-soy-brown/70 text-sm">{getT().reserveTableDesc}</p>

          {#if error}
            <div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
          {/if}

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveDate}</label>
              <input
                type="date"
                value={selectedDate}
                oninput={(e) => selectedDate = e.currentTarget.value}
                min={new Date().toISOString().split('T')[0]}
                class={inputClass}
                required
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reservePartySize}</label>
              <select
                value={partySize}
                onchange={(e) => partySize = Number(e.currentTarget.value)}
                class={inputClass}
              >
                {#each [1, 2, 3, 4, 5, 6, 7, 8, 10, 12] as size}
                  <option value={size}>{size} {size === 1 ? getT().reserveGuest : getT().reserveGuestLabel}</option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Time Slots -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveTime}</label>
            {#if availableSlotsQuery.data === undefined}
              <div class="animate-pulse h-10 rounded-lg bg-neutral-200"></div>
            {:else if timeOptions().length === 0}
              <p class="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                {getT().reserveNoSlots}
              </p>
            {:else}
              <div class="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {#each availableSlotsQuery.data as slot}
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm transition-colors {selectedTime === slot.time
                      ? 'border-fulala-red bg-fulala-red text-white'
                      : slot.available
                        ? 'border-neutral-300 hover:border-fulala-red hover:bg-fulala-red/5'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'}"
                    onclick={() => slot.available && (selectedTime = slot.time)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Contact Info -->
          <div class="border-t border-neutral-200 pt-6">
            <h3 class="mb-4 font-medium text-soy-brown">{getT().reserveContactInfo}</h3>
            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveName}</label>
                <input type="text" value={tableForm.guestName} oninput={(e) => tableForm.guestName = e.currentTarget.value} class={inputClass} required />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reservePhone}</label>
                  <input type="tel" value={tableForm.phone} oninput={(e) => tableForm.phone = e.currentTarget.value} placeholder="+420 XXX XXX XXX" class={inputClass} required />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveEmail}</label>
                  <input type="email" value={tableForm.email} oninput={(e) => tableForm.email = e.currentTarget.value} placeholder="your@email.com" class={inputClass} />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveSpecialRequests}</label>
                <textarea class={inputClass} rows="3" value={tableForm.specialRequests} oninput={(e) => tableForm.specialRequests = e.currentTarget.value}></textarea>
              </div>
            </div>
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? getT().reserveSubmitting : getT().reserveSubmit}
          </Button>

          <p class="text-center text-xs text-soy-brown/60">
            {getT().reserveCancelPolicy}
          </p>
        </form>
      </Card>

    {:else if activeTab === 'space'}
      <!-- SPACE BOOKING FORM -->
      <Card>
        <form onsubmit={handleSpaceSubmit} class="space-y-6">
          <div class="rounded-lg bg-tiger-orange/50 p-4">
            <p class="text-soy-brown font-medium">{getT().reserveSpaceDesc}</p>
            <p class="text-sm text-soy-brown/70 mt-1">{getT().reserveSpaceCapacity}</p>
          </div>

          {#if error}
            <div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
          {/if}

          <div>
            <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveDate}</label>
            <input
              type="date"
              value={spaceDate}
              oninput={(e) => spaceDate = e.currentTarget.value}
              min={new Date().toISOString().split('T')[0]}
              class={inputClass}
              required
            />
          </div>

          <!-- Time Blocks -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveTimeBlock}</label>
            {#if spaceAvailabilityQuery.data === undefined}
              <div class="animate-pulse h-10 rounded-lg bg-neutral-200"></div>
            {:else}
              <div class="grid grid-cols-2 gap-3">
                {#each spaceAvailabilityQuery.data as block}
                  <button
                    type="button"
                    class="rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors {selectedBlock === block.id
                      ? 'border-fulala-red bg-fulala-red text-white'
                      : block.available
                        ? 'border-neutral-300 hover:border-fulala-red hover:bg-fulala-red/5'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'}"
                    onclick={() => block.available && (selectedBlock = block.id)}
                    disabled={!block.available}
                  >
                    {block.label}
                    {#if !block.available}
                      <span class="block text-xs mt-0.5">{getT().reserveSpaceBooked}</span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveEventType}</label>
              <select value={eventType} onchange={(e) => eventType = e.currentTarget.value} class={inputClass} required>
                <option value="">{getT().reserveSelectEventType}</option>
                <option value="party">{getT().reserveEventParty}</option>
                <option value="meeting">{getT().reserveEventMeeting}</option>
                <option value="dinner">{getT().reserveEventDinner}</option>
                <option value="workshop">{getT().reserveEventWorkshop}</option>
                <option value="other">{getT().reserveEventOther}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reservePartySize}</label>
              <select value={spacePartySize} onchange={(e) => spacePartySize = Number(e.currentTarget.value)} class={inputClass}>
                {#each [5, 10, 15, 20, 25, 30] as size}
                  <option value={size}>{size} {getT().reserveGuestLabel}</option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="border-t border-neutral-200 pt-6">
            <h3 class="mb-4 font-medium text-soy-brown">{getT().reserveContactInfo}</h3>
            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveName}</label>
                <input type="text" value={spaceForm.guestName} oninput={(e) => spaceForm.guestName = e.currentTarget.value} class={inputClass} required />
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reservePhone}</label>
                  <input type="tel" value={spaceForm.phone} oninput={(e) => spaceForm.phone = e.currentTarget.value} placeholder="+420 XXX XXX XXX" class={inputClass} required />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveEmail}</label>
                  <input type="email" value={spaceForm.email} oninput={(e) => spaceForm.email = e.currentTarget.value} placeholder="your@email.com" class={inputClass} />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-soy-brown">{getT().reserveSpecialRequests}</label>
                <textarea class={inputClass} rows="3" value={spaceForm.specialRequests} oninput={(e) => spaceForm.specialRequests = e.currentTarget.value}></textarea>
              </div>
            </div>
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? getT().reserveSubmitting : getT().reserveSubmit}
          </Button>

          <p class="text-center text-xs text-soy-brown/60">
            {getT().reserveCancelPolicy}
          </p>
        </form>
      </Card>

    {:else if activeTab === 'manage'}
      <!-- MANAGE / CANCEL RESERVATION -->
      <Card>
        <div class="space-y-6">
          <div>
            <p class="text-soy-brown/70 text-sm mb-4">{getT().manageDesc}</p>

            <div class="flex gap-3">
              <div class="flex-1">
                <input
                  type="tel"
                  placeholder={getT().managePhonePlaceholder}
                  value={lookupPhone}
                  oninput={(e) => lookupPhone = e.currentTarget.value}
                  class={inputClass}
                />
              </div>
              <Button onclick={handleLookup} loading={lookingUp}>
                {getT().manageLookup}
              </Button>
            </div>
          </div>

          {#if cancelSuccess}
            <div class="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {cancelSuccess}
            </div>
          {/if}

          {#if lookupResults !== null}
            {#if lookupResults.length === 0}
              <p class="text-center text-soy-brown/60 py-8">{getT().manageNoResults}</p>
            {:else}
              <div>
                <h3 class="text-sm font-medium text-soy-brown mb-3">{getT().manageUpcoming}</h3>
                <div class="space-y-3">
                  {#each lookupResults as reservation}
                    <div class="rounded-lg border border-neutral-200 p-4">
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium text-soy-brown">
                              {reservation.reservationType === 'space' ? '🏠' : '🍽️'}
                              {formatDate(reservation.date)}
                            </span>
                            <span class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {getStatusColor(reservation.status)}">
                              {getStatusLabel(reservation.status)}
                            </span>
                          </div>
                          <p class="text-sm text-soy-brown/70">
                            {reservation.timeSlot}{#if reservation.endTime} – {reservation.endTime}{/if}
                            · {reservation.partySize} {getT().reserveGuestLabel}
                            {#if reservation.eventType}
                              · {getEventTypeLabel(reservation.eventType)}
                            {/if}
                          </p>
                        </div>
                        {#if reservation.status !== 'cancelled'}
                          <Button
                            variant="danger"
                            size="sm"
                            loading={cancellingId === reservation._id}
                            onclick={() => handleCancel(reservation._id)}
                          >
                            {getT().manageCancelBtn}
                          </Button>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          {/if}
        </div>
      </Card>
    {/if}
  </div>
</main>
