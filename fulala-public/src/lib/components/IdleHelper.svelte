<script lang="ts">
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  import { elasticOut, backIn } from 'svelte/easing';

  let showHelper = $state(false);
  let idleTimer: ReturnType<typeof setTimeout>;
  let helperMessage = $state('');

  const helperMessages = [
    "Take your time, we're here when you're ready...",
    "Looking for something specific? Try our menu!",
    "Need help? Our dumplings are calling...",
    "Hungry? Check out our signature dishes!",
    "Curious about our story? We'd love to share!",
  ];

  function resetIdleTimer() {
    showHelper = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      helperMessage = helperMessages[Math.floor(Math.random() * helperMessages.length)];
      showHelper = true;
    }, 8000);
  }

  function dismissHelper() {
    showHelper = false;
    resetIdleTimer();
  }

  onMount(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      clearTimeout(idleTimer);
    };
  });
</script>

{#if showHelper}
  <div
    class="fixed bottom-28 right-6 z-[9998] max-w-xs"
    in:scale={{ duration: 400, start: 0.2, opacity: 0, easing: elasticOut }}
    out:scale={{ duration: 200, start: 0.2, opacity: 0, easing: backIn }}
  >
    <div class="bg-white shadow-2xl rounded-3xl px-5 py-4 border-2 border-tiger-orange relative">
      <!-- Dismiss bubble X -->
      <button
        onclick={dismissHelper}
        class="absolute -top-3 -right-3 w-7 h-7 bg-fulala-red text-white rounded-full text-sm
               hover:scale-110 hover:bg-soy-brown transition-all flex items-center justify-center shadow-md"
        aria-label="Dismiss"
      >
        &times;
      </button>

      <!-- Tiger emoji and message -->
      <div class="flex items-start gap-3">
        <span class="text-2xl shrink-0">🐯</span>
        <p class="text-sm text-soy-brown leading-relaxed">{helperMessage}</p>
      </div>

      <!-- Quick actions -->
      <div class="mt-4 flex gap-3">
        <a
          href="/menu"
          class="text-xs px-4 py-2 bg-fulala-red text-white rounded-full hover:bg-soy-brown transition-colors"
        >
          View Menu
        </a>
        <a
          href="/reservations"
          class="text-xs px-4 py-2 border border-soy-brown text-soy-brown rounded-full hover:bg-soy-brown hover:text-white transition-colors"
        >
          Reservations
        </a>
      </div>
    </div>

    <!-- Speech bubble tail -->
    <div class="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-tiger-orange rotate-45"></div>
  </div>
{/if}
