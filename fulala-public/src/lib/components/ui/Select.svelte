<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';

  interface Option {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props extends Omit<HTMLSelectAttributes, 'children'> {
    label?: string;
    options: Option[];
    error?: string;
    hint?: string;
    placeholder?: string;
  }

  let {
    label,
    options,
    error,
    hint,
    placeholder,
    id,
    class: className = '',
    ...rest
  }: Props = $props();

  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

  const selectClasses = $derived(
    `w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white appearance-none cursor-pointer ${
      error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-neutral-300 focus:ring-fulala-red focus:border-fulala-red'
    } ${className}`
  );
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <label for={selectId} class="text-sm font-medium text-neutral-700">
      {label}
    </label>
  {/if}

  <div class="relative">
    <select id={selectId} class={selectClasses} {...rest}>
      {#if placeholder}
        <option value="" disabled selected>{placeholder}</option>
      {/if}
      {#each options as option}
        <option value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      {/each}
    </select>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>

  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {:else if hint}
    <p class="text-sm text-neutral-500">{hint}</p>
  {/if}
</div>
