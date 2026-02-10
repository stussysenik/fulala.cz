<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { setupConvex } from 'convex-svelte';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import Navigation from '$lib/components/Navigation.svelte';
  import IdleHelper from '$lib/components/IdleHelper.svelte';
  import { onMount } from 'svelte';
  import { getT } from '$lib/i18n/store.svelte';

  // Setup Convex client
  setupConvex(PUBLIC_CONVEX_URL);

  let { children } = $props();
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
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

  <footer class="relative z-10 border-t-2 border-solid border-fulala-red bg-tiger-orange/40">
    <p class="whitespace-nowrap text-center text-sm py-5 px-6">
      <a href="/menu" class="hover:text-fulala-red transition-colors">{getT().navMenu}</a>
      <span class="mx-2 opacity-30">&middot;</span>
      <a href="/reservations" class="hover:text-fulala-red transition-colors">{getT().navReservations}</a>
      <span class="mx-2 opacity-30">&middot;</span>
      <a href="/story" class="hover:text-fulala-red transition-colors">{getT().navStory}</a>
      <span class="mx-2 opacity-30">&middot;</span>
      <a href="/contact" class="hover:text-fulala-red transition-colors">{getT().navContact}</a>
      <span class="mx-3 opacity-30">|</span>
      <span class="text-xs opacity-50">&copy; {new Date().getFullYear()} {getT().footerCopyright}</span>
    </p>
  </footer>

  <!-- Idle helper tooltip -->
  {#if mounted}
    <IdleHelper />
  {/if}
</div>
