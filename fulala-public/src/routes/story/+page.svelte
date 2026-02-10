<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { getT } from '$lib/i18n/store.svelte';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });

  function getStoryContent() {
    const t = getT();
    return [
      {
        section: 'intro',
        title: t.storyIntroTitle,
        content: t.storyIntroContent,
      },
      {
        section: 'origin',
        title: t.storyOriginTitle,
        content: t.storyOriginContent,
      },
      {
        section: 'mascot',
        title: t.storyMascotTitle,
        content: t.storyMascotContent,
      },
      {
        section: 'values',
        title: t.storyValuesTitle,
        content: t.storyValuesContent,
      },
    ];
  }
</script>

<svelte:head>
  <title>{getT().navStory} | FULALA</title>
  <meta name="description" content="The story behind FULALA - where traditional Chinese comfort food meets modern Prague." />
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12">
  <!-- Hero Section -->
  {#if mounted}
    <div in:fly={{ y: -20, duration: 400 }} class="text-center mb-16">
      <h1 class="text-5xl md:text-7xl text-fulala-red text-shadow mb-4">
        {getT().storyPageTitle}
      </h1>
      <p class="text-lg text-soy-brown/70 max-w-2xl mx-auto">
        {getT().storySubtitle}
      </p>
    </div>
  {/if}

  <!-- Story Sections -->
  <div class="space-y-20">
    {#each getStoryContent() as section, index}
      {#if mounted}
        <section
          in:fly={{ y: 40, duration: 500, delay: 200 + index * 150 }}
          class="grid md:grid-cols-2 gap-8 items-center {index % 2 === 1 ? 'md:flex-row-reverse' : ''}"
        >
          <!-- Text Content -->
          <div class="{index % 2 === 1 ? 'md:order-2' : ''}">
            <h2 class="text-3xl md:text-4xl text-ink-black mb-4">
              {section.title}
            </h2>
            <p class="text-soy-brown/80 leading-relaxed">
              {section.content}
            </p>
          </div>

          <!-- Visual Element -->
          <div class="{index % 2 === 1 ? 'md:order-1' : ''}">
            <div class="aspect-square bg-tiger-orange/50 rounded-3xl flex items-center justify-center relative overflow-hidden">
              <!-- Decorative elements -->
              <div class="absolute inset-4 border-2 border-solid border-fulala-red/30 rounded-2xl"></div>

              <!-- Section-specific visuals -->
              {#if section.section === 'intro'}
                <div class="text-8xl">🥟</div>
              {:else if section.section === 'origin'}
                <div class="text-8xl">🏠</div>
              {:else if section.section === 'mascot'}
                <div class="text-8xl">🐯</div>
              {:else if section.section === 'values'}
                <div class="text-8xl">❤️</div>
              {/if}

              <!-- Floating accent -->
              <div class="absolute top-4 right-4 text-2xl animate-bounce">
                ✨
              </div>
            </div>
          </div>
        </section>
      {/if}
    {/each}
  </div>

  <!-- Behind the Scenes Section -->
  {#if mounted}
    <section
      in:fly={{ y: 40, duration: 500, delay: 800 }}
      class="mt-24 text-center"
    >
      <h2 class="text-4xl md:text-5xl text-fulala-red text-shadow-sm mb-8">
        {getT().storyBtsTitle}
      </h2>
      <p class="text-lg text-soy-brown/70 max-w-2xl mx-auto mb-12">
        {getT().storyBtsContent}
      </p>

      <!-- BTS Gallery Placeholder -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each ['🥢', '🔥', '🧑‍🍳', '🥟'] as emoji, i}
          <div
            class="aspect-square bg-tiger-orange/30 rounded-xl flex items-center justify-center text-5xl
                   hover:scale-105 transition-transform duration-300"
            in:fade={{ delay: 1000 + i * 100 }}
          >
            {emoji}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- CTA Section -->
  {#if mounted}
    <section
      in:fly={{ y: 40, duration: 500, delay: 1200 }}
      class="mt-24 text-center p-8 bg-tiger-orange/30 rounded-2xl"
    >
      <h3 class="text-2xl text-ink-black mb-4">
        {getT().storyCtaTitle}
      </h3>
      <p class="text-soy-brown/70 mb-6">
        {getT().storyCtaContent}
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/menu" class="btn-primary">
          {getT().viewMenu}
        </a>
        <a href="/contact" class="btn-secondary">
          {getT().findUs}
        </a>
      </div>
    </section>
  {/if}
</div>
