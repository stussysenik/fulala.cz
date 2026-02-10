<script lang="ts">
  import { useQuery } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { fade, scale } from 'svelte/transition';

  // Queries - convex-svelte returns {isLoading, error, data}
  const galleryItemsQuery = useQuery(api.gallery.list, () => ({}));
  const categoriesQuery = useQuery(api.gallery.getCategories, () => ({}));

  // Derived data
  const galleryItems = $derived(galleryItemsQuery.data);
  const categories = $derived(categoriesQuery.data);

  // State
  let activeCategory = $state('all');
  type GalleryItem = NonNullable<typeof galleryItems>[number];
  let lightboxItem = $state<GalleryItem | null>(null);
  let lightboxIndex = $state(0);

  const filteredItems = $derived(() => {
    if (!galleryItems) return [];
    if (activeCategory === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  });

  function openLightbox(item: NonNullable<typeof lightboxItem>, index: number) {
    lightboxItem = item;
    lightboxIndex = index;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxItem = null;
    document.body.style.overflow = '';
  }

  function nextImage() {
    const items = filteredItems();
    lightboxIndex = (lightboxIndex + 1) % items.length;
    lightboxItem = items[lightboxIndex];
  }

  function prevImage() {
    const items = filteredItems();
    lightboxIndex = (lightboxIndex - 1 + items.length) % items.length;
    lightboxItem = items[lightboxIndex];
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!lightboxItem) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }
</script>

<svelte:head>
  <title>Gallery - FULALA</title>
  <meta name="description" content="Browse our photo gallery showcasing delicious dumplings, our cozy restaurant interior, and the FULALA team." />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<main class="min-h-screen bg-tiger-orange/30 pt-24 pb-16">
  <div class="mx-auto max-w-7xl px-4">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="font-heading text-5xl text-fulala-red md:text-6xl">Gallery</h1>
      <p class="mt-4 text-lg text-soy-brown">
        A glimpse into the FULALA experience
      </p>
    </div>

    <!-- Category Filter -->
    <div class="mb-8 flex flex-wrap justify-center gap-2">
      <button
        class="rounded-full px-4 py-2 text-sm font-medium transition-colors {activeCategory === 'all' ? 'bg-fulala-red text-white' : 'bg-white text-soy-brown hover:bg-fulala-red/10'}"
        onclick={() => (activeCategory = 'all')}
      >
        All
      </button>
      {#if $categories}
        {#each $categories as category}
          <button
            class="rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors {activeCategory === category.name ? 'bg-fulala-red text-white' : 'bg-white text-soy-brown hover:bg-fulala-red/10'}"
            onclick={() => (activeCategory = category.name)}
          >
            {category.name}
          </button>
        {/each}
      {/if}
    </div>

    <!-- Gallery Grid (Masonry-style) -->
    <div class="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {#if $galleryItems === undefined}
        {#each Array(12) as _, i}
          <div
            class="mb-4 break-inside-avoid animate-pulse rounded-xl bg-white/50"
            style="height: {150 + (i % 3) * 50}px"
          ></div>
        {/each}
      {:else}
        {#each filteredItems() as item, index}
          <button
            class="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
            onclick={() => openLightbox(item, index)}
            transition:fade={{ duration: 200, delay: index * 30 }}
          >
            {#if item.url}
              <img
                src={item.url}
                alt={item.title || 'Gallery image'}
                class="w-full object-cover"
                loading="lazy"
              />
            {/if}
            {#if item.title}
              <div class="p-3">
                <p class="text-sm font-medium text-soy-brown">{item.title}</p>
              </div>
            {/if}
          </button>
        {/each}
      {/if}
    </div>

    {#if filteredItems().length === 0 && $galleryItems !== undefined}
      <div class="py-16 text-center">
        <p class="text-lg text-soy-brown/70">No photos in this category yet</p>
      </div>
    {/if}
  </div>
</main>

<!-- Lightbox -->
{#if lightboxItem}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    transition:fade={{ duration: 200 }}
    onclick={closeLightbox}
    role="dialog"
    aria-modal="true"
  >
    <!-- Close button -->
    <button
      class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      onclick={closeLightbox}
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Nav buttons -->
    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
      onclick={(e) => { e.stopPropagation(); prevImage(); }}
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
      onclick={(e) => { e.stopPropagation(); nextImage(); }}
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Image -->
    <div
      class="max-h-[90vh] max-w-[90vw]"
      onclick={(e) => e.stopPropagation()}
      transition:scale={{ duration: 200 }}
    >
      <img
        src={lightboxItem.url}
        alt={lightboxItem.title || 'Gallery image'}
        class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
      />
      {#if lightboxItem.title}
        <p class="mt-4 text-center text-white">{lightboxItem.title}</p>
      {/if}
    </div>

    <!-- Counter -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
      {lightboxIndex + 1} / {filteredItems().length}
    </div>
  </div>
{/if}
