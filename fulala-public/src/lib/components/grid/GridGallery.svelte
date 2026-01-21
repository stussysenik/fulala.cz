<script lang="ts">
  import type { Snippet } from 'svelte';

  interface GalleryItem {
    id: string;
    url: string;
    alt?: string;
    title?: string;
    aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  }

  interface Props {
    items: GalleryItem[];
    columns?: 2 | 3 | 4 | 5;
    gap?: 'sm' | 'md' | 'lg';
    onItemClick?: (item: GalleryItem) => void;
    itemSnippet?: Snippet<[GalleryItem, number]>;
    class?: string;
  }

  let {
    items,
    columns = 3,
    gap = 'md',
    onItemClick,
    itemSnippet,
    class: className = '',
  }: Props = $props();

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const aspectRatioClasses: Record<string, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
  };

  function handleKeyDown(e: KeyboardEvent, item: GalleryItem) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onItemClick?.(item);
    }
  }
</script>

<div
  class="columns-1 sm:columns-2 {columns >= 3
    ? 'md:columns-3'
    : ''} {columns >= 4 ? 'lg:columns-4' : ''} {columns >= 5
    ? 'xl:columns-5'
    : ''} {gapClasses[gap]} {className}"
>
  {#each items as item, index (item.id)}
    {#if itemSnippet}
      {@render itemSnippet(item, index)}
    {:else}
      <div
        class="mb-4 break-inside-avoid overflow-hidden rounded-lg bg-neutral-100 transition-transform hover:scale-[1.02]"
        role={onItemClick ? 'button' : undefined}
        tabindex={onItemClick ? 0 : undefined}
        onclick={() => onItemClick?.(item)}
        onkeydown={(e) => handleKeyDown(e, item)}
      >
        <img
          src={item.url}
          alt={item.alt || item.title || 'Gallery image'}
          class="w-full object-cover {item.aspectRatio
            ? aspectRatioClasses[item.aspectRatio]
            : ''}"
          loading="lazy"
        />
        {#if item.title}
          <div class="bg-white p-3">
            <p class="text-sm font-medium text-neutral-800">{item.title}</p>
          </div>
        {/if}
      </div>
    {/if}
  {/each}
</div>
