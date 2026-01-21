<script lang="ts">
  import { page } from '$app/stores';

  interface NavItem {
    label: string;
    href: string;
    icon: string;
    badge?: number;
  }

  interface NavGroup {
    title: string;
    items: NavItem[];
  }

  interface Props {
    collapsed?: boolean;
    onToggle?: () => void;
  }

  let { collapsed = false, onToggle }: Props = $props();

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
      ],
    },
    {
      title: 'Content',
      items: [
        { label: 'Menu Items', href: '/admin/menu', icon: 'menu' },
        { label: 'Categories', href: '/admin/categories', icon: 'category' },
        { label: 'Gallery', href: '/admin/gallery', icon: 'gallery' },
        { label: 'Media', href: '/admin/media', icon: 'media' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: 'orders' },
        { label: 'Tables', href: '/admin/tables', icon: 'tables' },
        { label: 'Reservations', href: '/admin/reservations', icon: 'reservations' },
        { label: 'QR Codes', href: '/admin/qr-codes', icon: 'qr' },
      ],
    },
  ];

  const icons: Record<string, string> = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    menu: 'M4 6h16M4 12h16M4 18h7',
    category: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z',
    gallery: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    media: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    orders: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    tables: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    reservations: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    qr: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
  };

  function isActive(href: string): boolean {
    const currentPath = $page.url.pathname;
    if (href === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(href);
  }
</script>

<aside
  class="fixed left-0 top-0 z-40 h-screen bg-white border-r border-neutral-200 transition-all duration-300 {collapsed
    ? 'w-16'
    : 'w-64'}"
>
  <!-- Logo -->
  <div class="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
    {#if !collapsed}
      <a href="/admin" class="flex items-center gap-2">
        <span class="text-2xl">🥟</span>
        <span class="font-chewy text-xl text-fulala-red">Fulala Admin</span>
      </a>
    {:else}
      <a href="/admin" class="mx-auto">
        <span class="text-2xl">🥟</span>
      </a>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="h-[calc(100vh-4rem)] overflow-y-auto p-4">
    {#each navGroups as group}
      {#if !collapsed}
        <p class="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {group.title}
        </p>
      {/if}
      <ul class="mb-4 space-y-1">
        {#each group.items as item}
          {@const active = isActive(item.href)}
          <li>
            <a
              href={item.href}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {active
                ? 'bg-fulala-red/10 text-fulala-red'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}"
              title={collapsed ? item.label : undefined}
            >
              <svg
                class="h-5 w-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d={icons[item.icon]}
                />
              </svg>
              {#if !collapsed}
                <span>{item.label}</span>
                {#if item.badge}
                  <span
                    class="ml-auto rounded-full bg-fulala-red px-2 py-0.5 text-xs font-medium text-white"
                  >
                    {item.badge}
                  </span>
                {/if}
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    {/each}
  </nav>

  <!-- Collapse Toggle -->
  <button
    class="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-700 shadow-sm"
    onclick={onToggle}
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  >
    <svg class="h-4 w-4 transition-transform {collapsed ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</aside>
