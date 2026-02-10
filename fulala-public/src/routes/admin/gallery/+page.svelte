<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Card, Badge, Dialog, Input, Select, Tabs } from '$lib/components/ui';

  // Convex client for mutations
  const client = useConvexClient();

  // Queries
  const galleryItemsQuery = useQuery(api.gallery.list, () => ({}));
  const galleryCategoriesQuery = useQuery(api.gallery.getCategories, () => ({}));
  const statsQuery = useQuery(api.gallery.getStats, () => ({}));
  const mediaQuery = useQuery(api.media.list, () => ({}));

  // State
  let activeCategory = $state('all');
  let showAddDialog = $state(false);
  let showEditDialog = $state(false);
  let selectedItem = $state<NonNullable<typeof galleryItemsQuery.data>[number] | null>(null);
  let selectedMediaId = $state<string>('');
  let newCategory = $state('food');
  let newTitle = $state('');

  const categoryOptions = [
    { value: 'food', label: 'Food' },
    { value: 'interior', label: 'Interior' },
    { value: 'team', label: 'Team' },
    { value: 'events', label: 'Events' },
  ];

  const filteredItems = $derived(() => {
    const items = galleryItemsQuery.data;
    if (!items) return [];
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  });

  const tabs = $derived(() => {
    const base = [{ id: 'all', label: 'All', badge: galleryItemsQuery.data?.length }];
    const categories = galleryCategoriesQuery.data;
    if (categories) {
      return [...base, ...categories.map((c) => ({ id: c.name, label: c.name, badge: c.count }))];
    }
    return base;
  });

  async function handleToggleFeatured(item: NonNullable<typeof selectedItem>) {
    await client.mutation(api.gallery.toggleFeatured, { id: item._id });
  }

  async function handleDelete(item: NonNullable<typeof selectedItem>) {
    if (confirm('Remove this item from the gallery?')) {
      await client.mutation(api.gallery.remove, { id: item._id });
    }
  }

  async function handleAdd() {
    if (!selectedMediaId) return;
    await client.mutation(api.gallery.create, {
      mediaId: selectedMediaId as any,
      category: newCategory,
      title: newTitle || undefined,
    });
    showAddDialog = false;
    selectedMediaId = '';
    newTitle = '';
  }

  function openEditDialog(item: NonNullable<typeof selectedItem>) {
    selectedItem = item;
    newCategory = item.category;
    newTitle = item.title || '';
    showEditDialog = true;
  }

  async function handleUpdate() {
    if (!selectedItem) return;
    await client.mutation(api.gallery.update, {
      id: selectedItem._id,
      category: newCategory,
      title: newTitle || undefined,
    });
    showEditDialog = false;
    selectedItem = null;
  }
</script>

<svelte:head>
  <title>Gallery - FULALA Admin</title>
</svelte:head>

<AdminHeader
  title="Gallery"
  subtitle="Manage photo gallery for the public site"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Gallery' }]}
>
  {#snippet actions()}
    <a href="/admin/media">
      <Button variant="secondary">Media Library</Button>
    </a>
    <Button onclick={() => (showAddDialog = true)}>
      <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add to Gallery
    </Button>
  {/snippet}
</AdminHeader>

<!-- Stats -->
<div class="mb-6 grid gap-4 sm:grid-cols-3">
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{statsQuery.data?.total ?? 0}</p>
    <p class="text-sm text-neutral-500">Total Items</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-yellow-600">{statsQuery.data?.featured ?? 0}</p>
    <p class="text-sm text-neutral-500">Featured</p>
  </Card>
  <Card class="text-center">
    <p class="text-2xl font-bold text-neutral-900">{Object.keys(statsQuery.data?.byCategory ?? {}).length}</p>
    <p class="text-sm text-neutral-500">Categories</p>
  </Card>
</div>

<!-- Tabs -->
<Tabs
  tabs={tabs()}
  bind:activeTab={activeCategory}
  class="mb-6"
/>

<!-- Gallery Grid -->
<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {#if galleryItemsQuery.data === undefined}
    {#each Array(8) as _}
      <div class="aspect-square animate-pulse rounded-lg bg-neutral-200"></div>
    {/each}
  {:else if filteredItems().length === 0}
    <div class="col-span-full">
      <Card class="py-12 text-center">
        <p class="text-neutral-500">No gallery items</p>
        <Button class="mt-4" onclick={() => (showAddDialog = true)}>Add Item</Button>
      </Card>
    </div>
  {:else}
    {#each filteredItems() as item}
      <div class="group relative overflow-hidden rounded-lg bg-neutral-100">
        {#if item.url}
          <img
            src={item.url}
            alt={item.title || 'Gallery image'}
            class="aspect-square w-full object-cover transition-transform group-hover:scale-105"
          />
        {:else}
          <div class="flex aspect-square items-center justify-center bg-neutral-200">
            <span class="text-4xl">🖼️</span>
          </div>
        {/if}

        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div class="absolute bottom-0 left-0 right-0 p-3">
            {#if item.title}
              <p class="text-sm font-medium text-white">{item.title}</p>
            {/if}
            <p class="text-xs text-white/70 capitalize">{item.category}</p>
          </div>
        </div>

        <!-- Featured Badge -->
        {#if item.isFeatured}
          <Badge variant="warning" class="absolute left-2 top-2">
            Featured
          </Badge>
        {/if}

        <!-- Actions -->
        <div class="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            class="rounded bg-white/90 p-1.5 text-neutral-700 hover:bg-white"
            onclick={() => handleToggleFeatured(item)}
            title={item.isFeatured ? 'Remove from featured' : 'Add to featured'}
          >
            <svg class="h-4 w-4 {item.isFeatured ? 'text-yellow-500' : ''}" fill={item.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            class="rounded bg-white/90 p-1.5 text-neutral-700 hover:bg-white"
            onclick={() => openEditDialog(item)}
            title="Edit"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            class="rounded bg-white/90 p-1.5 text-red-600 hover:bg-white"
            onclick={() => handleDelete(item)}
            title="Delete"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    {/each}
  {/if}
</div>

<!-- Add Dialog -->
<Dialog bind:open={showAddDialog} title="Add to Gallery" size="lg">
  <div class="space-y-4">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-neutral-700">Select Media</label>
      <div class="grid max-h-60 gap-2 overflow-y-auto sm:grid-cols-4">
        {#if mediaQuery.data}
          {#each mediaQuery.data as mediaItem}
            <button
              class="relative aspect-square overflow-hidden rounded-lg border-2 {selectedMediaId === mediaItem._id ? 'border-fulala-red' : 'border-transparent'}"
              onclick={() => (selectedMediaId = mediaItem._id)}
            >
              <img
                src={mediaItem.url}
                alt={mediaItem.alt || mediaItem.filename}
                class="h-full w-full object-cover"
              />
            </button>
          {/each}
        {/if}
      </div>
    </div>

    <Select
      label="Category"
      options={categoryOptions}
      bind:value={newCategory}
    />

    <Input
      label="Title (optional)"
      bind:value={newTitle}
    />
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showAddDialog = false)}>Cancel</Button>
    <Button onclick={handleAdd} disabled={!selectedMediaId}>Add to Gallery</Button>
  {/snippet}
</Dialog>

<!-- Edit Dialog -->
<Dialog bind:open={showEditDialog} title="Edit Gallery Item">
  <div class="space-y-4">
    <Select
      label="Category"
      options={categoryOptions}
      bind:value={newCategory}
    />

    <Input
      label="Title (optional)"
      bind:value={newTitle}
    />
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showEditDialog = false)}>Cancel</Button>
    <Button onclick={handleUpdate}>Save Changes</Button>
  {/snippet}
</Dialog>
