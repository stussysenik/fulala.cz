<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  let showHelper = $state(false);
  let idleTimer: ReturnType<typeof setTimeout>;
  let helperMessage = $state('');

  const helperMessages = [
    // Reassuring progress messages
    "Take your time, we're here when you're ready...",
    "Looking for something specific? Try our menu!",
    "Need help? Our dumplings are calling...",
    // Friendly prompts
    "Hungry? Check out our signature dishes!",
    "Curious about our story? We'd love to share!",
  ];

  function resetIdleTimer() {
    showHelper = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      helperMessage = helperMessages[Math.floor(Math.random() * helperMessages.length)];
      showHelper = true;
    }, 8000); // Show after 8 seconds of inactivity
  }

  function dismissHelper() {
    showHelper = false;
    resetIdleTimer();
  }

  onMount(() => {
    // Track user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Start the timer
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
    class="fixed bottom-6 right-6 z-40"
    in:fly={{ y: 20, duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <div class="bg-white shadow-xl rounded-2xl p-4 max-w-xs border-2 border-tiger-orange relative">
      <!-- Dismiss button -->
      <button
        onclick={dismissHelper}
        class="absolute -top-2 -right-2 w-6 h-6 bg-fulala-red text-white rounded-full text-xs
               hover:bg-soy-brown transition-colors flex items-center justify-center"
        aria-label="Dismiss"
      >
        &times;
      </button>

      <!-- Tiger emoji and message -->
      <div class="flex items-start gap-3">
        <span class="text-3xl">🐯</span>
        <p class="text-sm text-soy-brown leading-relaxed">{helperMessage}</p>
      </div>

      <!-- Quick actions -->
      <div class="mt-3 flex gap-2">
        <a
          href="/menu"
          class="text-xs px-3 py-1.5 bg-fulala-red text-white rounded-full hover:bg-soy-brown transition-colors"
        >
          View Menu
        </a>
        <a
          href="/contact"
          class="text-xs px-3 py-1.5 border border-soy-brown text-soy-brown rounded-full hover:bg-soy-brown hover:text-white transition-colors"
        >
          Contact
        </a>
      </div>
    </div>
  </div>
{/if}
