<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
    hint?: string;
  }

  let {
    label,
    error,
    hint,
    id,
    class: className = '',
    ...rest
  }: Props = $props();

  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  const inputClasses = $derived(
    `w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
      error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-neutral-300 focus:ring-fulala-red focus:border-fulala-red'
    } ${className}`
  );
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <label for={inputId} class="text-sm font-medium text-neutral-700">
      {label}
    </label>
  {/if}

  <input id={inputId} class={inputClasses} {...rest} />

  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {:else if hint}
    <p class="text-sm text-neutral-500">{hint}</p>
  {/if}
</div>
