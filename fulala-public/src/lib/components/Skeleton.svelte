<script lang="ts">
  interface Props {
    class?: string;
    width?: string;
    height?: string;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  }

  let {
    class: className = '',
    width = 'w-full',
    height = 'h-4',
    rounded = 'md'
  }: Props = $props();

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
</script>

<div
  class="skeleton {width} {height} {roundedClasses[rounded]} {className}"
  role="status"
  aria-label="Loading..."
>
  <span class="sr-only">Loading...</span>
</div>
