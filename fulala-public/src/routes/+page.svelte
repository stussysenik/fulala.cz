<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<!-- Cargo-inspired Hero Section -->
<section class="min-h-[calc(100vh-80px)] flex items-center">
  <div class="max-w-6xl mx-auto px-6 py-12 w-full">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <!-- Left: Content -->
      <div class="space-y-8">
        {#if mounted}
          <div in:fly={{ x: -30, duration: 500, delay: 100 }}>
            <h1
              class="text-5xl md:text-7xl lg:text-8xl text-fulala-red text-shadow leading-none"
            >
              Old School<br />
              <span class="text-ink-black">New Soul</span>
            </h1>
          </div>

          <div in:fly={{ x: -30, duration: 500, delay: 200 }}>
            <p class="text-lg md:text-xl text-soy-brown/80 max-w-md leading-relaxed">
              Comfort Chinese dishes made with love. Handmade dumplings following
              recipes passed down through generations.
            </p>
          </div>

          <div in:fly={{ x: -30, duration: 500, delay: 300 }} class="flex flex-wrap gap-4">
            <a href="/menu" class="btn-primary">
              View Menu
            </a>
            <a href="/story" class="btn-secondary">
              Our Story
            </a>
          </div>
        {/if}
      </div>

      <!-- Right: Visual Element -->
      <div class="relative">
        {#if mounted}
          <div
            in:fade={{ duration: 600, delay: 400 }}
            class="aspect-square bg-tiger-orange rounded-full flex items-center justify-center relative overflow-hidden"
          >
            <!-- Decorative circles -->
            <div class="absolute inset-4 border-4 border-dashed border-fulala-red/30 rounded-full"></div>
            <div class="absolute inset-12 border-4 border-dashed border-soy-brown/20 rounded-full"></div>

            <!-- Tiger emoji placeholder (replace with mascot illustration) -->
            <div class="text-[8rem] md:text-[12rem] select-none">
              🐯
            </div>

            <!-- Floating steam elements -->
            <div class="absolute top-8 right-8 text-4xl animate-bounce" style="animation-delay: 0.5s;">
              🥟
            </div>
            <div class="absolute bottom-12 left-8 text-3xl animate-bounce" style="animation-delay: 1s;">
              🥢
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Quick Features Section -->
<section class="py-16 px-6 bg-tiger-orange/30">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-3 gap-8">
      {#if mounted}
        {#each [
          { icon: '🥟', title: 'Handmade', desc: 'Every dumpling crafted with care' },
          { icon: '🔥', title: 'Fresh Daily', desc: 'Ingredients sourced each morning' },
          { icon: '❤️', title: 'Made with Love', desc: 'Family recipes, authentic taste' },
        ] as feature, i}
          <div
            in:fly={{ y: 30, duration: 400, delay: 500 + i * 100 }}
            class="text-center p-6"
          >
            <div class="text-5xl mb-4">{feature.icon}</div>
            <h3 class="text-xl text-ink-black mb-2">{feature.title}</h3>
            <p class="text-sm text-soy-brown/70">{feature.desc}</p>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 px-6">
  <div class="max-w-2xl mx-auto text-center">
    {#if mounted}
      <div in:fly={{ y: 30, duration: 400, delay: 800 }}>
        <h2 class="text-4xl md:text-5xl text-fulala-red text-shadow-sm mb-6">
          Hungry Yet?
        </h2>
        <p class="text-lg text-soy-brown/80 mb-8">
          Come taste the rituals of joy. Our kitchen is waiting for you.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/menu" class="btn-primary">
            Explore Menu
          </a>
          <a href="/contact" class="btn-secondary">
            Find Us
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>
