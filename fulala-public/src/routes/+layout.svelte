<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { setupConvex } from 'convex-svelte';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import Navigation from '$lib/components/Navigation.svelte';
  import IdleHelper from '$lib/components/IdleHelper.svelte';
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { getT } from '$lib/i18n/store.svelte';

  // Setup Convex client
  setupConvex(PUBLIC_CONVEX_URL);

  let { children } = $props();
  let mounted = $state(false);

  onMount(() => {
    mounted = true;

    if (dev) {
      import('$lib/debug/overlap-detector').then(({ init }) => init());
    }
  });
</script>

<svelte:head>
  <title>FULALA - Old School New Soul</title>
  <meta name="description" content="Comfort Chinese dishes in Prague. Handmade dumplings with love." />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Navigation />

  <main class="flex-1">
    {#key $page.url.pathname}
      <div
        class="page-transition"
        in:fade={{ duration: 200, delay: 100 }}
        out:fade={{ duration: 100 }}
      >
        {@render children()}
      </div>
    {/key}
  </main>

  <footer class="relative z-10 border-t-2 border-solid border-fulala-red bg-tiger-orange/40 py-5 px-6">
    <nav aria-label="Footer navigation" class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
      <a href="/menu" class="hover:text-fulala-red transition-colors">{getT().navMenu}</a>
      <a href="/reservations" class="hover:text-fulala-red transition-colors">{getT().navReservations}</a>
      <a href="/story" class="hover:text-fulala-red transition-colors">{getT().navStory}</a>
      <a href="/contact" class="hover:text-fulala-red transition-colors">{getT().navContact}</a>
    </nav>
    <p class="text-center text-xs opacity-50 mt-2">&copy; {new Date().getFullYear()} {getT().footerCopyright}</p>
  </footer>

  <!-- Idle helper tooltip -->
  {#if mounted}
    <IdleHelper />
  {/if}
</div>
