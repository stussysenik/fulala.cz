<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
    rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
    colStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto';
    rowStart?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
    class?: string;
    children: Snippet;
  }

  let {
    colSpan = 1,
    rowSpan = 1,
    colStart = 'auto',
    rowStart = 'auto',
    class: className = '',
    children,
  }: Props = $props();

  const colSpanClasses: Record<typeof colSpan, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    full: 'col-span-full',
  };

  const rowSpanClasses: Record<typeof rowSpan, string> = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6',
  };

  const colStartClasses: Record<string | number, string> = {
    auto: 'col-start-auto',
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
  };

  const rowStartClasses: Record<string | number, string> = {
    auto: 'row-start-auto',
    1: 'row-start-1',
    2: 'row-start-2',
    3: 'row-start-3',
    4: 'row-start-4',
    5: 'row-start-5',
    6: 'row-start-6',
  };

  const itemClasses = $derived(
    `${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]} ${colStartClasses[colStart]} ${rowStartClasses[rowStart]} ${className}`
  );
</script>

<div class={itemClasses}>
  {@render children()}
</div>
