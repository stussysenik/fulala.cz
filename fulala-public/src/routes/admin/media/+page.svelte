<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import { AdminHeader } from '$lib/components/admin';
  import { Button, Card, Dialog, Input } from '$lib/components/ui';

  // Convex client for mutations
  const client = useConvexClient();

  // Queries
  const mediaItemsQuery = useQuery(api.media.list, () => ({}));

  // State
  let uploading = $state(false);
  let uploadProgress = $state(0);
  let showEditDialog = $state(false);
  let selectedMedia = $state<NonNullable<typeof mediaItemsQuery.data>[number] | null>(null);
  let editAlt = $state('');
  let dragOver = $state(false);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    uploading = true;
    uploadProgress = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Get upload URL
        const uploadUrl = await client.mutation(api.media.generateUploadUrl, {});

        // Upload file
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        const { storageId } = await response.json();

        // Create media record
        await client.mutation(api.media.create, {
          storageId,
          filename: file.name,
          contentType: file.type,
        });

        uploadProgress = ((i + 1) / files.length) * 100;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      uploading = false;
      uploadProgress = 0;
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    handleFileUpload(e.dataTransfer?.files ?? null);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function openEditDialog(media: NonNullable<typeof selectedMedia>) {
    selectedMedia = media;
    editAlt = media.alt || '';
    showEditDialog = true;
  }

  async function handleUpdate() {
    if (!selectedMedia) return;
    await client.mutation(api.media.update, {
      id: selectedMedia._id,
      alt: editAlt || undefined,
    });
    showEditDialog = false;
    selectedMedia = null;
  }

  async function handleDelete(media: NonNullable<typeof selectedMedia>) {
    if (confirm('Delete this media file? This cannot be undone.')) {
      await client.mutation(api.media.remove, { id: media._id });
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('cs-CZ');
  }
</script>

<svelte:head>
  <title>Media Library - Fulala Admin</title>
</svelte:head>

<AdminHeader
  title="Media Library"
  subtitle="Upload and manage images"
  breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]}
>
  {#snippet actions()}
    <label class="cursor-pointer">
      <Button>
        <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload
      </Button>
      <input
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        onchange={(e) => handleFileUpload((e.target as HTMLInputElement).files)}
      />
    </label>
  {/snippet}
</AdminHeader>

<!-- Upload Zone -->
<div
  class="mb-6 rounded-xl border-2 border-dashed p-8 text-center transition-colors {dragOver
    ? 'border-fulala-red bg-fulala-red/5'
    : 'border-neutral-300 bg-neutral-50'}"
  ondrop={handleDrop}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  role="button"
  tabindex="0"
>
  {#if uploading}
    <div class="space-y-2">
      <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          class="h-full bg-fulala-red transition-all"
          style="width: {uploadProgress}%"
        ></div>
      </div>
      <p class="text-sm text-neutral-500">Uploading... {Math.round(uploadProgress)}%</p>
    </div>
  {:else}
    <svg class="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p class="mt-2 text-neutral-600">
      Drag and drop images here, or{' '}
      <label class="cursor-pointer text-fulala-red hover:underline">
        browse
        <input
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          onchange={(e) => handleFileUpload((e.target as HTMLInputElement).files)}
        />
      </label>
    </p>
    <p class="mt-1 text-sm text-neutral-400">PNG, JPG, GIF up to 10MB</p>
  {/if}
</div>

<!-- Media Grid -->
<div class="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
  {#if mediaItemsQuery.data === undefined}
    {#each Array(12) as _}
      <div class="aspect-square animate-pulse rounded-lg bg-neutral-200"></div>
    {/each}
  {:else if mediaItemsQuery.data.length === 0}
    <div class="col-span-full">
      <Card class="py-12 text-center">
        <p class="text-neutral-500">No media files yet. Upload some images to get started.</p>
      </Card>
    </div>
  {:else}
    {#each mediaItemsQuery.data as media}
      <div class="group relative overflow-hidden rounded-lg bg-neutral-100">
        {#if media.url}
          <img
            src={media.url}
            alt={media.alt || media.filename}
            class="aspect-square w-full object-cover"
          />
        {:else}
          <div class="flex aspect-square items-center justify-center">
            <span class="text-4xl">🖼️</span>
          </div>
        {/if}

        <!-- Overlay -->
        <div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div class="w-full p-2">
            <p class="truncate text-xs text-white">{media.filename}</p>
            <p class="text-xs text-white/70">{formatDate(media.uploadedAt)}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            class="rounded bg-white/90 p-1 text-neutral-700 hover:bg-white"
            onclick={() => openEditDialog(media)}
            title="Edit"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            class="rounded bg-white/90 p-1 text-red-600 hover:bg-white"
            onclick={() => handleDelete(media)}
            title="Delete"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    {/each}
  {/if}
</div>

<!-- Edit Dialog -->
<Dialog bind:open={showEditDialog} title="Edit Media">
  {#if selectedMedia}
    <div class="space-y-4">
      <div class="mx-auto max-w-xs overflow-hidden rounded-lg">
        <img
          src={selectedMedia.url}
          alt={selectedMedia.alt || selectedMedia.filename}
          class="w-full"
        />
      </div>

      <div class="text-center text-sm text-neutral-500">
        <p>{selectedMedia.filename}</p>
        <p>{selectedMedia.contentType}</p>
      </div>

      <Input
        label="Alt Text"
        placeholder="Describe this image for accessibility"
        bind:value={editAlt}
      />
    </div>
  {/if}

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (showEditDialog = false)}>Cancel</Button>
    <Button onclick={handleUpdate}>Save</Button>
  {/snippet}
</Dialog>
