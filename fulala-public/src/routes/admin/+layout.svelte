<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { AdminSidebar } from '$lib/components/admin';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  let sidebarCollapsed = $state(false);

  // Check if we're on the login page
  const isLoginPage = $derived($page.url.pathname === '/admin/login');
  const user = $derived(data.user);
</script>

{#if isLoginPage}
  {@render children()}
{:else}
  <div class="min-h-screen bg-neutral-50">
    <AdminSidebar
      collapsed={sidebarCollapsed}
      onToggle={() => (sidebarCollapsed = !sidebarCollapsed)}
    />

    <!-- Main content -->
    <main
      class="transition-all duration-300 {sidebarCollapsed ? 'ml-16' : 'ml-64'}"
    >
      <!-- Top bar -->
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
        <div class="flex items-center gap-4">
          <a href="/" class="text-sm text-neutral-500 hover:text-neutral-700" target="_blank">
            View Site
            <svg class="ml-1 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div class="flex items-center gap-4">
          <!-- Notifications placeholder -->
          <button class="relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-fulala-red"></span>
          </button>

          <!-- User menu -->
          <div class="flex items-center gap-3 border-l border-neutral-200 pl-4">
            <div class="h-8 w-8 rounded-full bg-fulala-red/10 flex items-center justify-center">
              <span class="text-sm font-medium text-fulala-red">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-medium text-neutral-900">{user?.name || 'Admin'}</p>
              <p class="text-xs text-neutral-500 capitalize">{user?.role || 'User'}</p>
            </div>
          </div>

          <!-- Logout -->
          <form action="/admin/login?/logout" method="POST" use:enhance>
            <button type="submit" class="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700" title="Logout">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </form>
        </div>
      </header>

      <!-- Page content -->
      <div class="p-6">
        {@render children()}
      </div>
    </main>
  </div>
{/if}
