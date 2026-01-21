<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    actions?: Snippet;
    breadcrumbs?: { label: string; href?: string }[];
  }

  let { title, subtitle, actions, breadcrumbs }: Props = $props();
</script>

<header class="mb-6">
  {#if breadcrumbs && breadcrumbs.length > 0}
    <nav class="mb-2">
      <ol class="flex items-center gap-2 text-sm text-neutral-500">
        {#each breadcrumbs as crumb, i}
          {#if i > 0}
            <li>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
          {/if}
          <li>
            {#if crumb.href}
              <a href={crumb.href} class="hover:text-neutral-700">{crumb.label}</a>
            {:else}
              <span class="font-medium text-neutral-900">{crumb.label}</span>
            {/if}
          </li>
        {/each}
      </ol>
    </nav>
  {/if}

  <div class="flex items-start justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">{title}</h1>
      {#if subtitle}
        <p class="mt-1 text-neutral-500">{subtitle}</p>
      {/if}
    </div>

    {#if actions}
      <div class="flex items-center gap-3">
        {@render actions()}
      </div>
    {/if}
  </div>
</header>
