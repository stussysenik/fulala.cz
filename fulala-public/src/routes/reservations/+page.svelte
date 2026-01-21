<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { Button, Input, Select, Card } from '$lib/components/ui';

  // Convex client for mutations
  const client = useConvexClient();

  // Get available slots
  let selectedDate = $state(new Date().toISOString().split('T')[0]);
  let selectedTime = $state('');
  let partySize = $state(2);

  const availableSlotsQuery = useQuery(api.reservations.getAvailableSlots, () => ({
    date: selectedDate,
    partySize,
  }));

  // Form state
  let formData = $state({
    guestName: '',
    phone: '',
    email: '',
    specialRequests: '',
  });

  let submitted = $state(false);
  let submitting = $state(false);
  let error = $state('');
  let confirmationDetails = $state<{ guestName: string; date: string; time: string; partySize: number } | null>(null);

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

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';

    if (!selectedTime) {
      error = 'Please select a time slot';
      return;
    }

    submitting = true;

    try {
      await client.mutation(api.reservations.create, {
        guestName: formData.guestName,
        phone: formData.phone,
        email: formData.email || undefined,
        partySize,
        date: selectedDate,
        timeSlot: selectedTime,
        specialRequests: formData.specialRequests || undefined,
      });

      confirmationDetails = {
        guestName: formData.guestName,
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

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>Make a Reservation - Fulala</title>
  <meta name="description" content="Reserve your table at Fulala. Book online for the best dumpling experience in town." />
</svelte:head>

<main class="min-h-screen bg-tiger-orange/30 pt-24 pb-16">
  <div class="mx-auto max-w-2xl px-4">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="font-chewy text-5xl text-fulala-red md:text-6xl">Reserve a Table</h1>
      <p class="mt-4 text-lg text-soy-brown">
        Book your spot for an unforgettable dumpling experience
      </p>
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

          <h2 class="font-chewy text-3xl text-fulala-red">Reservation Confirmed!</h2>
          <p class="mt-2 text-soy-brown">We can't wait to see you, {confirmationDetails.guestName}!</p>

          <div class="mt-8 rounded-xl bg-tiger-orange/50 p-6">
            <div class="grid gap-4 text-left sm:grid-cols-2">
              <div>
                <p class="text-sm text-soy-brown/70">Date</p>
                <p class="font-medium text-soy-brown">{formatDate(confirmationDetails.date)}</p>
              </div>
              <div>
                <p class="text-sm text-soy-brown/70">Time</p>
                <p class="font-medium text-soy-brown">{confirmationDetails.time}</p>
              </div>
              <div>
                <p class="text-sm text-soy-brown/70">Party Size</p>
                <p class="font-medium text-soy-brown">{confirmationDetails.partySize} guests</p>
              </div>
            </div>
          </div>

          <p class="mt-6 text-sm text-soy-brown/70">
            A confirmation has been sent to your phone. Please arrive 10 minutes before your reservation.
          </p>

          <div class="mt-8 flex justify-center gap-4">
            <a href="/menu">
              <Button variant="secondary">View Menu</Button>
            </a>
            <Button onclick={() => { submitted = false; confirmationDetails = null; }}>
              Make Another Reservation
            </Button>
          </div>
        </div>
      </Card>
    {:else}
      <!-- Reservation Form -->
      <Card>
        <form onsubmit={handleSubmit} class="space-y-6">
          {#if error}
            <div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          {/if}

          <!-- Date & Party Size -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-soy-brown">Date</label>
              <input
                type="date"
                bind:value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red"
                required
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-soy-brown">Party Size</label>
              <select
                bind:value={partySize}
                class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red"
              >
                {#each [1, 2, 3, 4, 5, 6, 7, 8, 10, 12] as size}
                  <option value={size}>{size} {size === 1 ? 'guest' : 'guests'}</option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Time Slots -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-soy-brown">Time</label>
            {#if availableSlotsQuery.data === undefined}
              <div class="animate-pulse h-10 rounded-lg bg-neutral-200"></div>
            {:else if timeOptions().length === 0}
              <p class="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                No available time slots for this date and party size. Please try a different date.
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
            <h3 class="mb-4 font-medium text-soy-brown">Contact Information</h3>

            <div class="space-y-4">
              <Input
                label="Name"
                placeholder="Your name"
                bind:value={formData.guestName}
                required
              />

              <div class="grid gap-4 sm:grid-cols-2">
                <Input
                  type="tel"
                  label="Phone"
                  placeholder="+420 XXX XXX XXX"
                  bind:value={formData.phone}
                  required
                />
                <Input
                  type="email"
                  label="Email (optional)"
                  placeholder="your@email.com"
                  bind:value={formData.email}
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-soy-brown">
                  Special Requests (optional)
                </label>
                <textarea
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red"
                  rows="3"
                  placeholder="Allergies, dietary restrictions, special occasions..."
                  bind:value={formData.specialRequests}
                ></textarea>
              </div>
            </div>
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? 'Booking...' : 'Complete Reservation'}
          </Button>

          <p class="text-center text-xs text-soy-brown/60">
            By making a reservation, you agree to our cancellation policy.
            Please cancel at least 2 hours in advance if you can't make it.
          </p>
        </form>
      </Card>
    {/if}
  </div>
</main>
