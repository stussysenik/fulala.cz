<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: Snippet<[T, number]>;
  }

  interface Props {
    data: T[];
    columns: Column<T>[];
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    loading?: boolean;
    emptyMessage?: string;
    selectable?: boolean;
    selectedIds?: Set<string>;
    idKey?: string;
    striped?: boolean;
    hoverable?: boolean;
    compact?: boolean;
    class?: string;
    onSort?: (key: string) => void;
    onRowClick?: (item: T, index: number) => void;
    onSelectionChange?: (ids: Set<string>) => void;
  }

  let {
    data,
    columns,
    sortKey,
    sortDirection = 'asc',
    loading = false,
    emptyMessage = 'No data available',
    selectable = false,
    selectedIds = $bindable(new Set()),
    idKey = '_id',
    striped = false,
    hoverable = true,
    compact = false,
    class: className = '',
    onSort,
    onRowClick,
    onSelectionChange,
  }: Props = $props();

  const allSelected = $derived(
    data.length > 0 && data.every((item) => selectedIds.has((item as Record<string, unknown>)[idKey] as string))
  );

  const someSelected = $derived(
    data.some((item) => selectedIds.has((item as Record<string, unknown>)[idKey] as string)) && !allSelected
  );

  function toggleAll() {
    if (allSelected) {
      selectedIds = new Set();
    } else {
      selectedIds = new Set(data.map((item) => (item as Record<string, unknown>)[idKey] as string));
    }
    onSelectionChange?.(selectedIds);
  }

  function toggleItem(id: string) {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    selectedIds = newSet;
    onSelectionChange?.(selectedIds);
  }

  function handleSort(key: string) {
    onSort?.(key);
  }

  function getValue(item: T, key: string): unknown {
    const keys = key.split('.');
    let value: unknown = item;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    return value;
  }

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';
</script>

<div class="overflow-x-auto rounded-lg border border-neutral-200 {className}">
  <table class="min-w-full divide-y divide-neutral-200">
    <thead class="bg-neutral-50">
      <tr>
        {#if selectable}
          <th class="{cellPadding} w-12">
            <input
              type="checkbox"
              checked={allSelected}
              indeterminate={someSelected}
              onchange={toggleAll}
              class="h-4 w-4 rounded border-neutral-300 text-fulala-red focus:ring-fulala-red"
            />
          </th>
        {/if}
        {#each columns as column}
          <th
            class="{cellPadding} text-left text-xs font-semibold uppercase tracking-wider text-neutral-500"
            style={column.width ? `width: ${column.width}` : ''}
          >
            {#if column.sortable}
              <button
                class="inline-flex items-center gap-1 hover:text-neutral-700"
                onclick={() => handleSort(column.key)}
              >
                {column.label}
                {#if sortKey === column.key}
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {#if sortDirection === 'asc'}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    {:else}
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    {/if}
                  </svg>
                {:else}
                  <svg class="h-4 w-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                {/if}
              </button>
            {:else}
              {column.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>

    <tbody class="divide-y divide-neutral-200 bg-white">
      {#if loading}
        {#each Array(5) as _, i}
          <tr>
            {#if selectable}
              <td class={cellPadding}>
                <div class="h-4 w-4 animate-pulse rounded bg-neutral-200"></div>
              </td>
            {/if}
            {#each columns as _col}
              <td class={cellPadding}>
                <div class="h-4 w-3/4 animate-pulse rounded bg-neutral-200"></div>
              </td>
            {/each}
          </tr>
        {/each}
      {:else if data.length === 0}
        <tr>
          <td
            colspan={columns.length + (selectable ? 1 : 0)}
            class="px-4 py-8 text-center text-neutral-500"
          >
            {emptyMessage}
          </td>
        </tr>
      {:else}
        {#each data as item, index}
          {@const itemId = (item as Record<string, unknown>)[idKey] as string}
          <tr
            class="{striped && index % 2 === 1 ? 'bg-neutral-50' : ''} {hoverable ? 'hover:bg-neutral-50' : ''} {onRowClick ? 'cursor-pointer' : ''}"
            onclick={() => onRowClick?.(item, index)}
          >
            {#if selectable}
              <td class={cellPadding} onclick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(itemId)}
                  onchange={() => toggleItem(itemId)}
                  class="h-4 w-4 rounded border-neutral-300 text-fulala-red focus:ring-fulala-red"
                />
              </td>
            {/if}
            {#each columns as column}
              <td
                class="{cellPadding} text-sm text-neutral-900"
                style="text-align: {column.align || 'left'}"
              >
                {#if column.render}
                  {@render column.render(item, index)}
                {:else}
                  {getValue(item, column.key) ?? '-'}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
