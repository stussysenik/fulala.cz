<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    icon?: Snippet;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    loading?: boolean;
  }

  let {
    label,
    value,
    change,
    trend = 'neutral',
    icon,
    variant = 'default',
    loading = false,
  }: Props = $props();

  const variantClasses = {
    default: 'bg-white border-neutral-200',
    primary: 'bg-fulala-red/5 border-fulala-red/20',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
  };

  const iconBgClasses = {
    default: 'bg-neutral-100 text-neutral-600',
    primary: 'bg-fulala-red/10 text-fulala-red',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-neutral-500',
  };
</script>

<div class="rounded-xl border p-4 {variantClasses[variant]}">
  <div class="flex items-start justify-between">
    <div class="flex-1">
      <p class="text-sm font-medium text-neutral-500">{label}</p>
      {#if loading}
        <div class="mt-2 h-8 w-24 animate-pulse rounded bg-neutral-200"></div>
      {:else}
        <p class="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
      {/if}
      {#if change !== undefined && !loading}
        <div class="mt-2 flex items-center gap-1 text-sm {trendColors[trend]}">
          {#if trend === 'up'}
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          {:else if trend === 'down'}
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          {:else}
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
            </svg>
          {/if}
          <span>{Math.abs(change)}%</span>
          <span class="text-neutral-400">vs last week</span>
        </div>
      {/if}
    </div>
    {#if icon}
      <div class="rounded-lg p-2 {iconBgClasses[variant]}">
        {@render icon()}
      </div>
    {/if}
  </div>
</div>
