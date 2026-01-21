<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    children: Snippet;
    iconLeft?: Snippet;
    iconRight?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    class: className = '',
    children,
    iconLeft,
    iconRight,
    ...rest
  }: Props = $props();

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-fulala-red text-white hover:bg-red-700 focus:ring-fulala-red active:scale-95',
    secondary:
      'bg-white text-soy-brown border-2 border-soy-brown hover:bg-tiger-orange focus:ring-soy-brown active:scale-95',
    ghost:
      'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-95',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:scale-95',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const buttonClasses = $derived(
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`
  );
</script>

<button class={buttonClasses} disabled={disabled || loading} {...rest}>
  {#if loading}
    <svg
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  {:else if iconLeft}
    {@render iconLeft()}
  {/if}

  {@render children()}

  {#if iconRight && !loading}
    {@render iconRight()}
  {/if}
</button>
