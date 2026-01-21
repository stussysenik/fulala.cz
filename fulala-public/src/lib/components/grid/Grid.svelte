<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    responsive?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    columns = 12,
    gap = 'md',
    responsive = true,
    class: className = '',
    children,
  }: Props = $props();

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const responsiveColumnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
  };

  const gridClasses = $derived(
    `grid ${responsive ? responsiveColumnClasses[columns] : columnClasses[columns]} ${gapClasses[gap]} ${className}`
  );
</script>

<div class={gridClasses}>
  {@render children()}
</div>
