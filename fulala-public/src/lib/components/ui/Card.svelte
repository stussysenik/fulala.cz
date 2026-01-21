<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'elevated' | 'outlined' | 'filled';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
    class?: string;
    children: Snippet;
    header?: Snippet;
    footer?: Snippet;
    onclick?: () => void;
  }

  let {
    variant = 'default',
    padding = 'md',
    interactive = false,
    class: className = '',
    children,
    header,
    footer,
    onclick,
  }: Props = $props();

  const baseClasses = 'rounded-xl overflow-hidden';

  const variantClasses = {
    default: 'bg-white border border-neutral-200',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-transparent border-2 border-neutral-300',
    filled: 'bg-neutral-100',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
    : '';

  const cardClasses = $derived(
    `${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`
  );

  function handleKeyDown(e: KeyboardEvent) {
    if (interactive && onclick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onclick();
    }
  }
</script>

<div
  class={cardClasses}
  role={interactive ? 'button' : undefined}
  tabindex={interactive ? 0 : undefined}
  onclick={interactive ? onclick : undefined}
  onkeydown={handleKeyDown}
>
  {#if header}
    <div class="border-b border-neutral-200 px-4 py-3">
      {@render header()}
    </div>
  {/if}

  <div class={paddingClasses[padding]}>
    {@render children()}
  </div>

  {#if footer}
    <div class="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
      {@render footer()}
    </div>
  {/if}
</div>
