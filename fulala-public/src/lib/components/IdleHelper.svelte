<script lang="ts">
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  import { elasticOut, backIn } from 'svelte/easing';
  import { getT } from '$lib/i18n/store.svelte';

  let showHelper = $state(false);
  let isProtected = $state(false);
  let idleTimer: ReturnType<typeof setTimeout>;
  let protectionTimer: ReturnType<typeof setTimeout>;
  let messageIndex = $state(0);
  let appearanceCount = $state(0);
  let isFirstAppearance = $state(true);

  const emojis = ['🐯', '🥟', '🔥', '✨', '🍜'];

  const messages = $derived([
    getT().idleMsg1,
    getT().idleMsg2,
    getT().idleMsg3,
    getT().idleMsg4,
    getT().idleMsg5,
  ]);

  const currentEmoji = $derived(emojis[appearanceCount % emojis.length]);

  function startIdleTimer() {
    clearTimeout(idleTimer);
    const delay = isFirstAppearance ? 15000 : 35000;
    idleTimer = setTimeout(() => {
      messageIndex = appearanceCount % messages.length;
      appearanceCount++;
      isFirstAppearance = false;
      showHelper = true;
      isProtected = true;

      // Minimum display time of 8s — activity during this period won't hide the bubble
      clearTimeout(protectionTimer);
      protectionTimer = setTimeout(() => {
        isProtected = false;
      }, 8000);
    }, delay);
  }

  function handleActivity() {
    if (showHelper && !isProtected) {
      showHelper = false;
    }
    if (!showHelper) {
      startIdleTimer();
    }
  }

  function dismissHelper() {
    clearTimeout(protectionTimer);
    isProtected = false;
    showHelper = false;
    startIdleTimer();
  }

  onMount(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    startIdleTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(idleTimer);
      clearTimeout(protectionTimer);
    };
  });
</script>

{#if showHelper}
  <div
    class="fixed bottom-28 right-6 z-[9998] max-w-xs"
    in:scale={{ duration: 400, start: 0.2, opacity: 0, easing: elasticOut }}
    out:scale={{ duration: 200, start: 0.2, opacity: 0, easing: backIn }}
  >
    <div class="bg-white shadow-2xl rounded-3xl px-5 py-4 border-2 border-tiger-orange relative {isProtected ? 'bubble-glow' : ''}">
      <!-- Dismiss bubble X -->
      <button
        onclick={dismissHelper}
        class="absolute -top-3 -right-3 w-7 h-7 bg-fulala-red text-white rounded-full text-sm
               hover:scale-110 hover:bg-soy-brown transition-all flex items-center justify-center shadow-md"
        aria-label="Dismiss"
      >
        &times;
      </button>

      <!-- Emoji and message -->
      <div class="flex items-start gap-3">
        <span class="text-2xl shrink-0">{currentEmoji}</span>
        <p class="text-sm text-soy-brown leading-relaxed">{messages[messageIndex]}</p>
      </div>

      <!-- Quick actions -->
      <div class="mt-4 flex gap-3">
        <a
          href="/menu"
          class="text-xs px-4 py-2 bg-fulala-red text-white rounded-full hover:bg-soy-brown transition-colors"
        >
          {getT().viewMenu}
        </a>
        <a
          href="/reservations"
          class="text-xs px-4 py-2 border border-soy-brown text-soy-brown rounded-full hover:bg-soy-brown hover:text-white transition-colors"
        >
          {getT().navReservations}
        </a>
      </div>
    </div>

    <!-- Speech bubble tail -->
    <div class="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-tiger-orange rotate-45"></div>
  </div>
{/if}

<style>
  @keyframes bubble-pulse {
    0% { box-shadow: 0 0 0 0 rgba(239, 65, 54, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(239, 65, 54, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 65, 54, 0); }
  }

  .bubble-glow {
    animation: bubble-pulse 1s ease-out 2;
  }
</style>
