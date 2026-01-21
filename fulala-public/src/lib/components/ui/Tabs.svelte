<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Tab {
    id: string;
    label: string;
    icon?: Snippet;
    disabled?: boolean;
    badge?: string | number;
  }

  interface Props {
    tabs: Tab[];
    activeTab?: string;
    variant?: 'default' | 'pills' | 'underline';
    fullWidth?: boolean;
    class?: string;
    onTabChange?: (tabId: string) => void;
  }

  let {
    tabs,
    activeTab = $bindable(tabs[0]?.id),
    variant = 'default',
    fullWidth = false,
    class: className = '',
    onTabChange,
  }: Props = $props();

  function selectTab(tabId: string) {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      activeTab = tabId;
      onTabChange?.(tabId);
    }
  }

  const baseTabClasses = 'inline-flex items-center gap-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fulala-red focus:ring-offset-2';

  const variantStyles = {
    default: {
      container: 'border-b border-neutral-200',
      tab: 'px-4 py-2.5 -mb-px border-b-2',
      active: 'border-fulala-red text-fulala-red',
      inactive: 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
    },
    pills: {
      container: 'bg-neutral-100 p-1 rounded-lg',
      tab: 'px-4 py-2 rounded-md',
      active: 'bg-white text-neutral-900 shadow-sm',
      inactive: 'text-neutral-500 hover:text-neutral-700',
    },
    underline: {
      container: '',
      tab: 'px-1 py-2.5 border-b-2 mr-4',
      active: 'border-fulala-red text-fulala-red',
      inactive: 'border-transparent text-neutral-500 hover:text-neutral-700',
    },
  };

  function handleKeyDown(e: KeyboardEvent, index: number) {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex((t) => t.id === tabs[index].id);

    let newIndex = -1;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = enabledTabs.length - 1;
    }

    if (newIndex >= 0) {
      selectTab(enabledTabs[newIndex].id);
    }
  }
</script>

<div
  class="flex {fullWidth ? 'w-full' : ''} {variantStyles[variant].container} {className}"
  role="tablist"
>
  {#each tabs as tab, index}
    {@const isActive = activeTab === tab.id}
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${tab.id}`}
      tabindex={isActive ? 0 : -1}
      disabled={tab.disabled}
      class="{baseTabClasses} {variantStyles[variant].tab} {isActive
        ? variantStyles[variant].active
        : variantStyles[variant].inactive} {fullWidth ? 'flex-1 justify-center' : ''} {tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}"
      onclick={() => selectTab(tab.id)}
      onkeydown={(e) => handleKeyDown(e, index)}
    >
      {#if tab.icon}
        {@render tab.icon()}
      {/if}
      {tab.label}
      {#if tab.badge !== undefined}
        <span
          class="ml-1 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600"
        >
          {tab.badge}
        </span>
      {/if}
    </button>
  {/each}
</div>
