<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { getT } from '$lib/i18n/store.svelte';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<!-- Hero Section -->
<section class="min-h-[calc(100vh-80px)] flex items-center">
  <div class="max-w-4xl mx-auto px-6 py-16 w-full">
    <div class="flex flex-col items-center text-center">
      <!-- Tier 0: Brand Logo — identity anchor, not the focal point -->
      {#if mounted}
        <div in:fade={{ duration: 600, delay: 100 }} class="mb-8 md:mb-10">
          <img
            src="/logo-horizontal.jpg"
            alt="FULALA - Fresh Noodles & Dumplings & Snacks"
            class="w-full max-w-sm md:max-w-lg lg:max-w-2xl mx-auto"
          />
        </div>
      {/if}

      <!-- Tier 1: Primary headline — the emotional hook, largest text -->
      {#if mounted}
        <div in:fly={{ y: 20, duration: 500, delay: 300 }} class="mb-5 md:mb-6">
          <h1
            class="text-4xl md:text-6xl lg:text-7xl text-fulala-red text-shadow leading-[0.95]"
          >
            {getT().heroTagline1}<br />
            <span class="text-ink-black">{getT().heroTagline2}</span>
          </h1>
        </div>

        <!-- Tier 2: Supporting copy — context, clearly secondary -->
        <div in:fly={{ y: 20, duration: 500, delay: 400 }} class="mb-10 md:mb-12">
          <p class="text-base md:text-lg text-soy-brown/70 max-w-md mx-auto leading-relaxed">
            {getT().heroDescription}
          </p>
        </div>

        <!-- Tier 3: CTAs — clear primary action + secondary -->
        <div in:fly={{ y: 20, duration: 500, delay: 500 }} class="flex flex-wrap gap-4 justify-center">
          <a href="/menu" class="btn-primary text-lg px-8 py-3">
            {getT().viewMenu}
          </a>
          <a href="/story" class="btn-secondary px-8 py-3">
            {getT().ourStory}
          </a>
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- Tiger Mascot Section -->
{#if mounted}
  <section class="py-12 px-6">
    <div in:fly={{ y: 30, duration: 500, delay: 600 }} class="max-w-md mx-auto text-center">
      <div class="tiger-mascot">
        <span class="tiger-emoji">🐯</span>
      </div>
      <p class="text-lg text-soy-brown/70 mt-4 italic">
        {getT().tigerTagline}
      </p>
    </div>
  </section>
{/if}

<!-- Quick Features Section -->
<section class="py-16 px-6 bg-tiger-orange/30">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-3 gap-8">
      {#if mounted}
        {@const features = [
          { icon: '🥟', title: getT().featureHandmadeTitle, desc: getT().featureHandmadeDesc },
          { icon: '🔥', title: getT().featureFreshTitle, desc: getT().featureFreshDesc },
          { icon: '❤️', title: getT().featureLoveTitle, desc: getT().featureLoveDesc },
        ]}
        {#each features as feature, i}
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
          {getT().ctaTitle}
        </h2>
        <p class="text-lg text-soy-brown/80 mb-8">
          {getT().ctaDescription}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/menu" class="btn-primary">
            {getT().exploreMenu}
          </a>
          <a href="/contact" class="btn-secondary">
            {getT().findUs}
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .tiger-mascot {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    background: var(--color-tiger-orange, #FCEBDC);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: tiger-breathe 3s ease-in-out infinite;
  }

  .tiger-emoji {
    font-size: 4rem;
    line-height: 1;
  }

  @keyframes tiger-breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
</style>
