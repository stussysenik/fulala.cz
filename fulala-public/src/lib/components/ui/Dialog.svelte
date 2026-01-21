<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    class?: string;
    children: Snippet;
    footer?: Snippet;
    onClose?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    description,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    showCloseButton = true,
    class: className = '',
    children,
    footer,
    onClose,
  }: Props = $props();

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  function close() {
    open = false;
    onClose?.();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      close();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === 'Escape') {
      close();
    }
  }

  $effect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'dialog-title' : undefined}
    aria-describedby={description ? 'dialog-description' : undefined}
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      transition:fade={{ duration: 150 }}
      onclick={handleBackdropClick}
      role="presentation"
    ></div>

    <!-- Dialog -->
    <div
      class="relative z-10 w-full rounded-xl bg-white shadow-2xl {sizeClasses[size]} {className}"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <!-- Header -->
      {#if title || showCloseButton}
        <div class="flex items-start justify-between border-b border-neutral-200 p-4">
          <div>
            {#if title}
              <h2 id="dialog-title" class="text-lg font-semibold text-neutral-900">
                {title}
              </h2>
            {/if}
            {#if description}
              <p id="dialog-description" class="mt-1 text-sm text-neutral-500">
                {description}
              </p>
            {/if}
          </div>

          {#if showCloseButton}
            <button
              type="button"
              class="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              onclick={close}
              aria-label="Close dialog"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          {/if}
        </div>
      {/if}

      <!-- Content -->
      <div class="p-4">
        {@render children()}
      </div>

      <!-- Footer -->
      {#if footer}
        <div class="flex justify-end gap-3 border-t border-neutral-200 bg-neutral-50 p-4">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
