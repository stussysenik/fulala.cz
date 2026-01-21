<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Input, Select, Card, Badge, Dialog, DataTable } from '$lib/components/ui';
  import type { Id } from '../../../../convex/_generated/dataModel';

  // Convex client for mutations
  const client = useConvexClient();

  // Queries
  const menuItemsQuery = useQuery(api.menu.list, () => ({}));
  const categoriesQuery = useQuery(api.categories.list, () => ({}));

  // State
  let showCreateDialog = $state(false);
  let showEditDialog = $state(false);
  let showDeleteDialog = $state(false);
  let selectedItem = $state<NonNullable<typeof menuItemsQuery.data>[number] | null>(null);
  let searchQuery = $state('');
  let categoryFilter = $state('all');

  // Form state
  let formData = $state({
    title: '',
    description: '',
    price: 0,
    priceDisplay: '',
    category: '',
    isAvailable: true,
  });

  // Filter menu items
  const filteredItems = $derived(() => {
    const menuItems = menuItemsQuery.data;
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  });

  // Category options for select
  const categoryOptions = $derived(() => {
    const categories = categoriesQuery.data;
    const base = [{ value: 'all', label: 'All Categories' }];
    if (!categories) return base;
    return [...base, ...categories.map((c) => ({ value: c.slug, label: c.name }))];
  });

  const categoryOptionsForForm = $derived(() => {
    const categories = categoriesQuery.data;
    if (!categories) return [];
    return categories.map((c) => ({ value: c.slug, label: c.name }));
  });

  function openCreateDialog() {
    const categories = categoriesQuery.data;
    formData = {
      title: '',
      description: '',
      price: 0,
      priceDisplay: '',
      category: categories?.[0]?.slug || '',
      isAvailable: true,
    };
    showCreateDialog = true;
  }

  function openEditDialog(item: NonNullable<typeof selectedItem>) {
    selectedItem = item;
    formData = {
      title: item.title,
      description: item.description,
      price: item.price,
      priceDisplay: item.priceDisplay,
      category: item.category,
      isAvailable: item.isAvailable,
    };
    showEditDialog = true;
  }

  function openDeleteDialog(item: NonNullable<typeof selectedItem>) {
    selectedItem = item;
    showDeleteDialog = true;
  }

  async function handleCreate() {
    await client.mutation(api.menu.create, {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      priceDisplay: formData.priceDisplay || `${formData.price} Kč`,
      category: formData.category,
      isAvailable: formData.isAvailable,
    });
    showCreateDialog = false;
  }

  async function handleUpdate() {
    if (!selectedItem) return;
    await client.mutation(api.menu.update, {
      id: selectedItem._id,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      priceDisplay: formData.priceDisplay,
      category: formData.category,
      isAvailable: formData.isAvailable,
    });
    showEditDialog = false;
    selectedItem = null;
  }

  async function handleDelete() {
    if (!selectedItem) return;
    await client.mutation(api.menu.remove, { id: selectedItem._id });
    showDeleteDialog = false;
    selectedItem = null;
  }

  // Table columns
  const columns = [
    { key: 'title', label: 'Item', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'priceDisplay', label: 'Price', sortable: true, align: 'right' as const },
    { key: 'isAvailable', label: 'Status' },
    { key: 'actions', label: '' },
  ];
</script>

<svelte:head>
  <title>Menu Management - Fulala Admin</title>
</svelte:head>

<AdminHeader
  title="Menu Management"
  subtitle="Manage your menu items and categories"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Menu' }]}
>
  {#snippet actions()}
    <Button onclick={openCreateDialog}>
      <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Item
    </Button>
  {/snippet}
</AdminHeader>

<!-- Filters -->
<Card class="mb-6">
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-1 gap-4">
      <div class="max-w-xs flex-1">
        <Input
          type="search"
          placeholder="Search menu items..."
          bind:value={searchQuery}
        />
      </div>
      <div class="w-48">
        <Select
          options={categoryOptions()}
          bind:value={categoryFilter}
        />
      </div>
    </div>
    <p class="text-sm text-neutral-500">
      {filteredItems().length} items
    </p>
  </div>
</Card>

<!-- Menu Items Table -->
<DataTable
  data={filteredItems()}
  {columns}
  loading={menuItemsQuery.data === undefined}
  emptyMessage="No menu items found"
  hoverable
  onRowClick={(item) => openEditDialog(item)}
>
  {#snippet render(item, _index, column)}
    {#if column === 'title'}
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
          <span class="text-lg">🥟</span>
        </div>
        <div>
          <p class="font-medium text-neutral-900">{item.title}</p>
          <p class="text-sm text-neutral-500 line-clamp-1">{item.description}</p>
        </div>
      </div>
    {:else if column === 'category'}
      <Badge variant="default">{item.category}</Badge>
    {:else if column === 'isAvailable'}
      <Badge variant={item.isAvailable ? 'success' : 'danger'} dot>
        {item.isAvailable ? 'Available' : 'Unavailable'}
      </Badge>
    {:else if column === 'actions'}
      <div class="flex items-center gap-2" onclick={(e) => e.stopPropagation()}>
        <button
          class="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          onclick={() => openEditDialog(item)}
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          class="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600"
          onclick={() => openDeleteDialog(item)}
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    {/if}
  {/snippet}
</DataTable>

<!-- Create Dialog -->
<Dialog
  bind:open={showCreateDialog}
  title="Add Menu Item"
  description="Create a new item for your menu"
>
  <form onsubmit={(e) => { e.preventDefault(); handleCreate(); }} class="space-y-4">
    <Input
      label="Title"
      placeholder="e.g., Pork Dumplings"
      bind:value={formData.title}
      required
    />

    <div>
      <label class="mb-1.5 block text-sm font-medium text-neutral-700">Description</label>
      <textarea
        class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red focus:ring-offset-1"
        rows="3"
        placeholder="Describe the dish..."
        bind:value={formData.description}
      ></textarea>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <Input
        type="number"
        label="Price"
        placeholder="185"
        bind:value={formData.price}
        required
      />
      <Input
        label="Price Display"
        placeholder="185 Kč"
        bind:value={formData.priceDisplay}
        hint="Leave empty for automatic"
      />
    </div>

    <Select
      label="Category"
      options={categoryOptionsForForm()}
      bind:value={formData.category}
    />

    <label class="flex items-center gap-2">
      <input
        type="checkbox"
        bind:checked={formData.isAvailable}
        class="h-4 w-4 rounded border-neutral-300 text-fulala-red focus:ring-fulala-red"
      />
      <span class="text-sm text-neutral-700">Available for ordering</span>
    </label>
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showCreateDialog = false)}>Cancel</Button>
    <Button onclick={handleCreate}>Create Item</Button>
  {/snippet}
</Dialog>

<!-- Edit Dialog -->
<Dialog
  bind:open={showEditDialog}
  title="Edit Menu Item"
  description="Update item details"
>
  <form onsubmit={(e) => { e.preventDefault(); handleUpdate(); }} class="space-y-4">
    <Input
      label="Title"
      bind:value={formData.title}
      required
    />

    <div>
      <label class="mb-1.5 block text-sm font-medium text-neutral-700">Description</label>
      <textarea
        class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red focus:ring-offset-1"
        rows="3"
        bind:value={formData.description}
      ></textarea>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <Input
        type="number"
        label="Price"
        bind:value={formData.price}
        required
      />
      <Input
        label="Price Display"
        bind:value={formData.priceDisplay}
      />
    </div>

    <Select
      label="Category"
      options={categoryOptionsForForm()}
      bind:value={formData.category}
    />

    <label class="flex items-center gap-2">
      <input
        type="checkbox"
        bind:checked={formData.isAvailable}
        class="h-4 w-4 rounded border-neutral-300 text-fulala-red focus:ring-fulala-red"
      />
      <span class="text-sm text-neutral-700">Available for ordering</span>
    </label>
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showEditDialog = false)}>Cancel</Button>
    <Button onclick={handleUpdate}>Save Changes</Button>
  {/snippet}
</Dialog>

<!-- Delete Dialog -->
<Dialog
  bind:open={showDeleteDialog}
  title="Delete Menu Item"
  description="Are you sure you want to delete this item? This action cannot be undone."
  size="sm"
>
  {#if selectedItem}
    <p class="text-neutral-600">
      You are about to delete <strong>{selectedItem.title}</strong>.
    </p>
  {/if}

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showDeleteDialog = false)}>Cancel</Button>
    <Button variant="danger" onclick={handleDelete}>Delete</Button>
  {/snippet}
</Dialog>
