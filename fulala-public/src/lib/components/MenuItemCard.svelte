<script lang="ts">
  import { fly } from 'svelte/transition';

  interface MenuItem {
    _id: string;
    title: string;
    description: string;
    price: number;
    priceDisplay: string;
    category: string;
    isAvailable: boolean;
    sortOrder: number;
    image?: string;
  }

  interface Props {
    item: MenuItem;
    index?: number;
  }

  let { item, index = 0 }: Props = $props();
</script>

<div
  class="group border-b-2 border-dashed border-tiger-orange pb-6 last:border-b-0"
  in:fly={{ y: 20, delay: index * 100, duration: 300 }}
>
  <div class="flex justify-between items-start gap-4">
    <!-- Item details -->
    <div class="flex-1 min-w-0">
      <h3
        class="text-xl md:text-2xl text-ink-black mb-1 group-hover:text-fulala-red transition-colors duration-200"
      >
        {item.title}
      </h3>
      <p class="text-sm md:text-base text-soy-brown/80 leading-relaxed">
        {item.description}
      </p>

      {#if !item.isAvailable}
        <span class="inline-block mt-2 text-xs px-2 py-1 bg-soy-brown/10 text-soy-brown rounded">
          Currently unavailable
        </span>
      {/if}
    </div>

    <!-- Price -->
    <div class="flex-shrink-0">
      <span
        class="text-xl md:text-2xl text-fulala-red font-heading whitespace-nowrap"
      >
        {item.priceDisplay}
      </span>
    </div>
  </div>
</div>
