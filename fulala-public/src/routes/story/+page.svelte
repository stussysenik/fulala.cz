<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });

  const storyContent = [
    {
      section: 'intro',
      title: 'Old School New Soul',
      content: `At Fulala, we believe in the magic of handmade dumplings. Each one is crafted with love, following recipes passed down through generations. Our name "Fulala" captures the whimsical joy we want to bring to every meal.`,
    },
    {
      section: 'origin',
      title: 'Born in Prague',
      content: `Our journey began in the heart of Prague, where we set out to bring authentic Chinese comfort food to the Czech Republic. We wanted to create a space where traditional flavors meet modern hospitality - a place where every visitor feels like family.`,
    },
    {
      section: 'mascot',
      title: 'Meet the Tiger',
      content: `Our playful tiger mascot embodies the bold, spirited nature of our kitchen. In Chinese culture, the tiger represents courage, power, and good fortune. For us, it's also a reminder to approach cooking with passion and fearlessness.`,
    },
    {
      section: 'values',
      title: 'Rituals of Joy',
      content: `We believe eating should be a joyful ritual. Fresh ingredients sourced daily, traditional techniques honored carefully, and a whole lot of heart goes into every dish we serve. This isn't just food - it's an experience.`,
    },
  ];
</script>

<svelte:head>
  <title>Our Story | Fulala</title>
  <meta name="description" content="The story behind Fulala - where traditional Chinese comfort food meets modern Prague." />
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12">
  <!-- Hero Section -->
  {#if mounted}
    <div in:fly={{ y: -20, duration: 400 }} class="text-center mb-16">
      <h1 class="text-5xl md:text-7xl text-fulala-red text-shadow mb-4">
        OUR STORY
      </h1>
      <p class="text-lg text-soy-brown/70 max-w-2xl mx-auto">
        From family kitchen to Prague's heart
      </p>
    </div>
  {/if}

  <!-- Story Sections -->
  <div class="space-y-20">
    {#each storyContent as section, index}
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
              <div class="absolute inset-4 border-2 border-dashed border-soy-brown/20 rounded-2xl"></div>

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
        Behind the Scenes
      </h2>
      <p class="text-lg text-soy-brown/70 max-w-2xl mx-auto mb-12">
        Every morning, our team gathers to prepare fresh ingredients, fold dumplings by hand,
        and bring the spirit of authentic Chinese cooking to life.
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
        Ready to taste the story?
      </h3>
      <p class="text-soy-brown/70 mb-6">
        Come visit us and become part of the Fulala family.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/menu" class="btn-primary">
          View Menu
        </a>
        <a href="/contact" class="btn-secondary">
          Find Us
        </a>
      </div>
    </section>
  {/if}
</div>
