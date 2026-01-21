<script lang="ts">
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';

  let mobileMenuOpen = $state(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/story', label: 'Story' },
    { href: '/contact', label: 'Contact' },
  ];

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }
</script>

<!-- Cargo-inspired minimal navigation -->
<header class="sticky top-0 z-50 bg-dough-white/95 backdrop-blur-sm border-b-2 border-dashed border-tiger-orange">
  <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="text-3xl md:text-4xl text-fulala-red hover:scale-105 transition-transform" onclick={closeMenu}>
      Fulala
    </a>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center gap-8">
      {#each navLinks as link}
        <a
          href={link.href}
          class="text-sm font-medium tracking-wide uppercase transition-colors duration-200
                 {$page.url.pathname === link.href ? 'text-fulala-red' : 'text-soy-brown hover:text-fulala-red'}"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <!-- Mobile Menu Button -->
    <button
      class="md:hidden text-2xl text-soy-brown hover:text-fulala-red transition-colors p-2"
      onclick={toggleMenu}
      aria-label="Toggle menu"
      aria-expanded={mobileMenuOpen}
    >
      {#if mobileMenuOpen}
        <span class="block w-6 h-6 relative">
          <span class="absolute top-1/2 left-0 w-full h-0.5 bg-current transform -translate-y-1/2 rotate-45"></span>
          <span class="absolute top-1/2 left-0 w-full h-0.5 bg-current transform -translate-y-1/2 -rotate-45"></span>
        </span>
      {:else}
        <span class="block w-6 h-6 relative">
          <span class="absolute top-1 left-0 w-full h-0.5 bg-current"></span>
          <span class="absolute top-1/2 left-0 w-full h-0.5 bg-current transform -translate-y-1/2"></span>
          <span class="absolute bottom-1 left-0 w-full h-0.5 bg-current"></span>
        </span>
      {/if}
    </button>
  </nav>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div
      class="md:hidden border-t-2 border-dashed border-tiger-orange"
      transition:slide={{ duration: 200 }}
    >
      <div class="px-6 py-4 space-y-4">
        {#each navLinks as link}
          <a
            href={link.href}
            onclick={closeMenu}
            class="block text-lg font-medium tracking-wide uppercase transition-colors duration-200
                   {$page.url.pathname === link.href ? 'text-fulala-red' : 'text-soy-brown hover:text-fulala-red'}"
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</header>
