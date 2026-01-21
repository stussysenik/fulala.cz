<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?:
      | 'default'
      | 'primary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'info';
    size?: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    dot?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    variant = 'default',
    size = 'md',
    rounded = false,
    dot = false,
    class: className = '',
    children,
  }: Props = $props();

  const baseClasses = 'inline-flex items-center font-medium';

  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-fulala-red/10 text-fulala-red',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const dotColors = {
    default: 'bg-neutral-500',
    primary: 'bg-fulala-red',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const badgeClasses = $derived(
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${rounded ? 'rounded-full' : 'rounded-md'} ${className}`
  );
</script>

<span class={badgeClasses}>
  {#if dot}
    <span
      class="h-1.5 w-1.5 rounded-full {dotColors[variant]}"
      aria-hidden="true"
    ></span>
  {/if}
  {@render children()}
</span>
