<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Input, Card, Dialog } from '$lib/components/ui';

  // Convex client for mutations
  const client = useConvexClient();

  // Queries
  const categoriesQuery = useQuery(api.categories.list, () => ({}));

  // State
  let showCreateDialog = $state(false);
  let showEditDialog = $state(false);
  let showDeleteDialog = $state(false);
  let selectedCategory = $state<NonNullable<typeof categoriesQuery.data>[number] | null>(null);

  // Form state
  let formData = $state({
    name: '',
    slug: '',
    description: '',
  });

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function openCreateDialog() {
    formData = { name: '', slug: '', description: '' };
    showCreateDialog = true;
  }

  function openEditDialog(category: NonNullable<typeof selectedCategory>) {
    selectedCategory = category;
    formData = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    };
    showEditDialog = true;
  }

  function openDeleteDialog(category: NonNullable<typeof selectedCategory>) {
    selectedCategory = category;
    showDeleteDialog = true;
  }

  async function handleCreate() {
    await client.mutation(api.categories.create, {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || undefined,
    });
    showCreateDialog = false;
  }

  async function handleUpdate() {
    if (!selectedCategory) return;
    await client.mutation(api.categories.update, {
      id: selectedCategory._id,
      name: formData.name,
      slug: formData.slug,
      description: formData.description || undefined,
    });
    showEditDialog = false;
    selectedCategory = null;
  }

  async function handleDelete() {
    if (!selectedCategory) return;
    await client.mutation(api.categories.remove, { id: selectedCategory._id });
    showDeleteDialog = false;
    selectedCategory = null;
  }

  // Auto-generate slug when name changes
  $effect(() => {
    if (showCreateDialog && formData.name && !formData.slug) {
      formData.slug = generateSlug(formData.name);
    }
  });
</script>

<svelte:head>
  <title>Categories - FULALA Admin</title>
</svelte:head>

<AdminHeader
  title="Categories"
  subtitle="Organize your menu items"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Categories' }]}
>
  {#snippet actions()}
    <Button onclick={openCreateDialog}>
      <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Category
    </Button>
  {/snippet}
</AdminHeader>

<!-- Categories Grid -->
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#if categoriesQuery.data === undefined}
    {#each Array(6) as _}
      <Card>
        <div class="animate-pulse">
          <div class="h-6 w-1/2 rounded bg-neutral-200"></div>
          <div class="mt-2 h-4 w-3/4 rounded bg-neutral-200"></div>
        </div>
      </Card>
    {/each}
  {:else if categoriesQuery.data.length === 0}
    <div class="col-span-full">
      <Card class="py-12 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
          <svg class="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-neutral-900">No categories yet</h3>
        <p class="mt-1 text-neutral-500">Create your first category to organize menu items</p>
        <Button class="mt-4" onclick={openCreateDialog}>Add Category</Button>
      </Card>
    </div>
  {:else}
    {#each categoriesQuery.data as category, index}
      <Card
        interactive
        onclick={() => openEditDialog(category)}
        class="group"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-fulala-red/10 text-fulala-red font-bold">
              {index + 1}
            </div>
            <div>
              <h3 class="font-medium text-neutral-900">{category.name}</h3>
              <p class="text-sm text-neutral-500">/{category.slug}</p>
            </div>
          </div>
          <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              onclick={(e) => { e.stopPropagation(); openEditDialog(category); }}
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
              onclick={(e) => { e.stopPropagation(); openDeleteDialog(category); }}
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        {#if category.description}
          <p class="mt-3 text-sm text-neutral-600">{category.description}</p>
        {/if}
      </Card>
    {/each}
  {/if}
</div>

<!-- Create Dialog -->
<Dialog
  bind:open={showCreateDialog}
  title="Add Category"
  description="Create a new category to organize menu items"
>
  <form onsubmit={(e) => { e.preventDefault(); handleCreate(); }} class="space-y-4">
    <Input
      label="Name"
      placeholder="e.g., Dumplings"
      bind:value={formData.name}
      required
    />

    <Input
      label="Slug"
      placeholder="e.g., dumplings"
      bind:value={formData.slug}
      hint="URL-friendly identifier (auto-generated)"
    />

    <div>
      <label class="mb-1.5 block text-sm font-medium text-neutral-700">Description (optional)</label>
      <textarea
        class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red focus:ring-offset-1"
        rows="2"
        placeholder="Brief description of this category..."
        bind:value={formData.description}
      ></textarea>
    </div>
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showCreateDialog = false)}>Cancel</Button>
    <Button onclick={handleCreate}>Create Category</Button>
  {/snippet}
</Dialog>

<!-- Edit Dialog -->
<Dialog
  bind:open={showEditDialog}
  title="Edit Category"
>
  <form onsubmit={(e) => { e.preventDefault(); handleUpdate(); }} class="space-y-4">
    <Input
      label="Name"
      bind:value={formData.name}
      required
    />

    <Input
      label="Slug"
      bind:value={formData.slug}
    />

    <div>
      <label class="mb-1.5 block text-sm font-medium text-neutral-700">Description (optional)</label>
      <textarea
        class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-fulala-red focus:outline-none focus:ring-2 focus:ring-fulala-red focus:ring-offset-1"
        rows="2"
        bind:value={formData.description}
      ></textarea>
    </div>
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showEditDialog = false)}>Cancel</Button>
    <Button onclick={handleUpdate}>Save Changes</Button>
  {/snippet}
</Dialog>

<!-- Delete Dialog -->
<Dialog
  bind:open={showDeleteDialog}
  title="Delete Category"
  description="Are you sure? Menu items in this category will need to be reassigned."
  size="sm"
>
  {#if selectedCategory}
    <p class="text-neutral-600">
      You are about to delete <strong>{selectedCategory.name}</strong>.
    </p>
  {/if}

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showDeleteDialog = false)}>Cancel</Button>
    <Button variant="danger" onclick={handleDelete}>Delete</Button>
  {/snippet}
</Dialog>
