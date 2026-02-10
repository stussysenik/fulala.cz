<script lang="ts">
  import { PUBLIC_LIVE_MENU_URL } from '$env/static/public';

  const menuUrl = PUBLIC_LIVE_MENU_URL || 'http://localhost:5173';
</script>

<svelte:head>
  <title>Menu | FULALA</title>
  <meta name="description" content="Explore our live menu of handmade dumplings, buns, noodles, and sides." />
</svelte:head>

<div class="menu-embed">
  <iframe
    src={menuUrl}
    title="FULALA Live Menu"
    class="menu-iframe"
    allow="autoplay"
    sandbox="allow-scripts allow-same-origin allow-popups"
  ></iframe>
</div>

<style>
  .menu-embed {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 80px);
    background: #FFFFFF;
  }

  :global(body:has(.menu-embed)) {
    background-color: #FFFFFF !important;
  }

  :global(body:has(.menu-embed))::before {
    display: none !important;
  }

  .menu-iframe {
    width: 100%;
    min-height: calc(100vh - 80px);
    border: none;
    display: block;
  }
</style>
