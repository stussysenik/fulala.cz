<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { setupConvex } from 'convex-svelte';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import Navigation from '$lib/components/Navigation.svelte';
  import IdleHelper from '$lib/components/IdleHelper.svelte';
  import { onMount } from 'svelte';

  // Setup Convex client
  setupConvex(PUBLIC_CONVEX_URL);

  let { children } = $props();
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Fulala - Old School New Soul</title>
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

  <footer class="py-8 px-6 border-t-2 border-dashed border-tiger-orange">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="text-center md:text-left">
        <h3 class="text-2xl text-fulala-red">Fulala</h3>
        <p class="text-sm opacity-75">Old School New Soul</p>
      </div>
      <div class="flex gap-6 text-sm">
        <a href="/menu" class="hover:text-fulala-red transition-colors">Menu</a>
        <a href="/story" class="hover:text-fulala-red transition-colors">Our Story</a>
        <a href="/contact" class="hover:text-fulala-red transition-colors">Contact</a>
      </div>
      <p class="text-xs opacity-50">
        &copy; {new Date().getFullYear()} Fulala. Made with dumplings.
      </p>
    </div>
  </footer>

  <!-- Idle helper tooltip -->
  {#if mounted}
    <IdleHelper />
  {/if}
</div>
