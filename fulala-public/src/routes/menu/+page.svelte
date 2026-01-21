<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { useQuery } from 'convex/svelte';
  import { api } from '../../convex/_generated/api';
  import MenuItemCard from '$lib/components/MenuItemCard.svelte';
  import Skeleton from '$lib/components/Skeleton.svelte';

  // Live Convex queries
  const menuItems = useQuery(api.menu.list, {});
  const categories = useQuery(api.categories.list, {});

  let mounted = $state(false);
  let activeCategory = $state<string | null>(null);

  onMount(() => {
    mounted = true;
  });

  // Loading state based on Convex query status
  const loading = $derived($menuItems === undefined || $categories === undefined);

  // Group menu items by category
  const menuCategories = $derived(() => {
    if (!$menuItems || !$categories) return [];

    return $categories.map(category => ({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      items: $menuItems
        .filter(item => item.category === category.slug && item.isAvailable)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    })).filter(cat => cat.items.length > 0);
  });

  const filteredCategories = $derived(() => {
    const cats = menuCategories();
    return activeCategory
      ? cats.filter((c) => c.slug === activeCategory)
      : cats;
  });
</script>

<svelte:head>
  <title>Menu | Fulala</title>
  <meta name="description" content="Explore our menu of handmade dumplings, buns, noodles, and sides." />
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12">
  <!-- Header -->
  {#if mounted}
    <div in:fly={{ y: -20, duration: 400 }} class="text-center mb-12">
      <h1 class="text-5xl md:text-7xl text-fulala-red text-shadow mb-4">
        MENU
      </h1>
      <p class="text-lg text-soy-brown/70">
        Handmade with love, served with joy
      </p>
    </div>
  {/if}

  <!-- Category Filter -->
  {#if mounted}
    <div
      in:fly={{ y: 20, duration: 400, delay: 100 }}
      class="flex flex-wrap justify-center gap-2 mb-12"
    >
      <button
        onclick={() => (activeCategory = null)}
        class="px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200
               {activeCategory === null
          ? 'bg-fulala-red text-white'
          : 'bg-tiger-orange text-soy-brown hover:bg-fulala-red/10'}"
      >
        All
      </button>
      {#each menuCategories() as category}
        <button
          onclick={() => (activeCategory = category.slug)}
          class="px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200
                 {activeCategory === category.slug
            ? 'bg-fulala-red text-white'
            : 'bg-tiger-orange text-soy-brown hover:bg-fulala-red/10'}"
        >
          {category.name}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Menu Content -->
  {#if loading}
    <!-- Skeleton Loaders -->
    <div class="space-y-12">
      {#each [1, 2] as _}
        <div>
          <Skeleton width="w-32" height="h-8" class="mb-6" />
          <div class="space-y-6">
            {#each [1, 2, 3] as _}
              <div class="border-b-2 border-dashed border-tiger-orange pb-6">
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-1 space-y-2">
                    <Skeleton width="w-48" height="h-6" />
                    <Skeleton width="w-full" height="h-4" />
                    <Skeleton width="w-3/4" height="h-4" />
                  </div>
                  <Skeleton width="w-20" height="h-6" />
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Loaded Menu -->
    <div class="space-y-12">
      {#each filteredCategories() as category, categoryIndex}
        <section
          in:fly={{ y: 30, duration: 400, delay: 200 + categoryIndex * 100 }}
        >
          <div class="flex items-baseline gap-4 mb-6">
            <h2 class="text-3xl md:text-4xl text-ink-black">
              {category.name}
            </h2>
            {#if category.description}
              <span class="text-sm text-soy-brown/50 hidden sm:inline">
                {category.description}
              </span>
            {/if}
          </div>

          <div class="space-y-6">
            {#each category.items as item, itemIndex}
              <MenuItemCard {item} index={itemIndex} />
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/if}

  <!-- Bottom CTA -->
  {#if mounted && !loading}
    <div
      in:fly={{ y: 30, duration: 400, delay: 600 }}
      class="mt-16 text-center p-8 bg-tiger-orange/30 rounded-2xl"
    >
      <p class="text-lg text-soy-brown mb-4">
        Can't decide? Trust our kitchen!
      </p>
      <p class="text-sm text-soy-brown/70 mb-6">
        Ask about our Chef's Selection for a curated dumpling experience.
      </p>
      <a href="/contact" class="btn-primary">
        Contact Us
      </a>
    </div>
  {/if}
</div>
