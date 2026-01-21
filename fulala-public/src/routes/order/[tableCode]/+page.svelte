<script lang="ts">
  import { page } from '$app/stores';
  import { useQuery, useMutation } from 'convex/svelte';
  import { api } from '../../../../convex/_generated/api';
  import { Button, Card, Badge } from '$lib/components/ui';
  import { fly, fade } from 'svelte/transition';

  // Get table code from URL
  const tableCode = $page.params.tableCode;

  // Queries
  const qrCode = useQuery(api.qrCodes.getByCode, { code: tableCode });
  const menuItems = useQuery(api.menu.list, {});
  const categories = useQuery(api.categories.list, {});
  const recordScan = useMutation(api.qrCodes.recordScan);
  const createOrder = useMutation(api.orders.create);

  // Record scan on mount
  $effect(() => {
    if (tableCode) {
      recordScan({ code: tableCode }).catch(() => {});
    }
  });

  // Cart state
  interface CartItem {
    menuItemId: string;
    title: string;
    price: number;
    quantity: number;
    notes?: string;
  }

  let cart = $state<CartItem[]>([]);
  let activeCategory = $state('all');
  let showCart = $state(false);
  let customerName = $state('');
  let customerPhone = $state('');
  let orderNotes = $state('');
  let submitting = $state(false);
  let orderSubmitted = $state(false);
  let orderNumber = $state('');

  const cartTotal = $derived(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const cartCount = $derived(cart.reduce((sum, item) => sum + item.quantity, 0));

  const filteredMenuItems = $derived(() => {
    if (!$menuItems) return [];
    const available = $menuItems.filter((item) => item.isAvailable);
    if (activeCategory === 'all') return available;
    return available.filter((item) => item.category === activeCategory);
  });

  function addToCart(item: NonNullable<typeof $menuItems>[number]) {
    const existing = cart.find((c) => c.menuItemId === item._id);
    if (existing) {
      existing.quantity += 1;
      cart = [...cart];
    } else {
      cart = [
        ...cart,
        {
          menuItemId: item._id,
          title: item.title,
          price: item.price,
          quantity: 1,
        },
      ];
    }
  }

  function removeFromCart(menuItemId: string) {
    const existing = cart.find((c) => c.menuItemId === menuItemId);
    if (existing && existing.quantity > 1) {
      existing.quantity -= 1;
      cart = [...cart];
    } else {
      cart = cart.filter((c) => c.menuItemId !== menuItemId);
    }
  }

  function getCartQuantity(menuItemId: string): number {
    return cart.find((c) => c.menuItemId === menuItemId)?.quantity || 0;
  }

  async function submitOrder() {
    if (cart.length === 0) return;

    submitting = true;

    try {
      const orderId = await createOrder({
        tableId: $qrCode?.tableId || undefined,
        items: cart.map((item) => ({
          menuItemId: item.menuItemId as any,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes,
        })),
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        notes: orderNotes || undefined,
      });

      // Get order number from response
      orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      orderSubmitted = true;
      cart = [];
      showCart = false;
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>{$qrCode?.table?.name || 'Order'} - Fulala</title>
</svelte:head>

<main class="min-h-screen bg-tiger-orange/30 pb-24">
  <!-- Header -->
  <header class="sticky top-0 z-40 bg-white shadow-sm">
    <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🥟</span>
        <div>
          <h1 class="font-chewy text-xl text-fulala-red">Fulala</h1>
          {#if $qrCode?.table}
            <p class="text-xs text-soy-brown">{$qrCode.table.name}</p>
          {/if}
        </div>
      </div>

      <button
        class="relative rounded-full bg-fulala-red p-3 text-white"
        onclick={() => (showCart = true)}
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {#if cartCount > 0}
          <span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-soy-brown text-xs font-bold text-white">
            {cartCount}
          </span>
        {/if}
      </button>
    </div>
  </header>

  {#if orderSubmitted}
    <!-- Order Confirmation -->
    <div class="mx-auto max-w-md px-4 pt-12">
      <Card class="text-center">
        <div class="py-8">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 class="font-chewy text-3xl text-fulala-red">Order Placed!</h2>
          <p class="mt-2 text-soy-brown">Your order is being prepared</p>

          <div class="mt-6 rounded-xl bg-tiger-orange/50 p-4">
            <p class="text-sm text-soy-brown/70">Order Number</p>
            <p class="font-mono text-2xl font-bold text-soy-brown">{orderNumber}</p>
          </div>

          <p class="mt-6 text-sm text-soy-brown/70">
            We'll bring your food to the table when it's ready.
          </p>

          <Button class="mt-6" onclick={() => (orderSubmitted = false)}>
            Order More
          </Button>
        </div>
      </Card>
    </div>
  {:else}
    <!-- Category Tabs -->
    <div class="sticky top-[60px] z-30 bg-tiger-orange/30 px-4 py-3">
      <div class="flex gap-2 overflow-x-auto">
        <button
          class="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors {activeCategory === 'all' ? 'bg-fulala-red text-white' : 'bg-white text-soy-brown'}"
          onclick={() => (activeCategory = 'all')}
        >
          All
        </button>
        {#if $categories}
          {#each $categories as category}
            <button
              class="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors {activeCategory === category.slug ? 'bg-fulala-red text-white' : 'bg-white text-soy-brown'}"
              onclick={() => (activeCategory = category.slug)}
            >
              {category.name}
            </button>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Menu Items -->
    <div class="mx-auto max-w-4xl px-4 py-4">
      <div class="space-y-3">
        {#if $menuItems === undefined}
          {#each Array(6) as _}
            <div class="animate-pulse rounded-xl bg-white p-4">
              <div class="h-6 w-1/2 rounded bg-neutral-200"></div>
              <div class="mt-2 h-4 w-3/4 rounded bg-neutral-200"></div>
            </div>
          {/each}
        {:else}
          {#each filteredMenuItems() as item}
            {@const qty = getCartQuantity(item._id)}
            <div
              class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              transition:fly={{ y: 20, duration: 200 }}
            >
              <div class="flex-1">
                <h3 class="font-medium text-soy-brown">{item.title}</h3>
                <p class="text-sm text-soy-brown/70 line-clamp-2">{item.description}</p>
                <p class="mt-1 font-bold text-fulala-red">{item.priceDisplay}</p>
              </div>

              <div class="flex items-center gap-2">
                {#if qty > 0}
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-soy-brown"
                    onclick={() => removeFromCart(item._id)}
                  >
                    -
                  </button>
                  <span class="w-6 text-center font-bold">{qty}</span>
                {/if}
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-fulala-red text-white"
                  onclick={() => addToCart(item)}
                >
                  +
                </button>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}

  <!-- Cart Drawer -->
  {#if showCart}
    <div
      class="fixed inset-0 z-50 bg-black/50"
      transition:fade={{ duration: 200 }}
      onclick={() => (showCart = false)}
    ></div>

    <div
      class="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-4 pb-8"
      transition:fly={{ y: 300, duration: 300 }}
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="font-chewy text-2xl text-fulala-red">Your Order</h2>
        <button
          class="rounded-full p-2 hover:bg-neutral-100"
          onclick={() => (showCart = false)}
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {#if cart.length === 0}
        <p class="py-8 text-center text-soy-brown/70">Your cart is empty</p>
      {:else}
        <div class="space-y-3">
          {#each cart as item}
            <div class="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
              <div>
                <p class="font-medium">{item.title}</p>
                <p class="text-sm text-neutral-500">{item.price} Kč each</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="h-6 w-6 rounded-full bg-neutral-200"
                  onclick={() => removeFromCart(item.menuItemId)}
                >
                  -
                </button>
                <span class="w-6 text-center">{item.quantity}</span>
                <button
                  class="h-6 w-6 rounded-full bg-fulala-red text-white"
                  onclick={() => {
                    const menuItem = $menuItems?.find((m) => m._id === item.menuItemId);
                    if (menuItem) addToCart(menuItem);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          {/each}
        </div>

        <div class="mt-4 border-t border-neutral-200 pt-4">
          <input
            type="text"
            placeholder="Your name (optional)"
            class="mb-2 w-full rounded-lg border border-neutral-300 px-3 py-2"
            bind:value={customerName}
          />
          <textarea
            placeholder="Special requests..."
            class="w-full rounded-lg border border-neutral-300 px-3 py-2"
            rows="2"
            bind:value={orderNotes}
          ></textarea>
        </div>

        <div class="mt-4 flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span class="text-fulala-red">{cartTotal} Kč</span>
        </div>

        <Button
          class="mt-4"
          fullWidth
          loading={submitting}
          onclick={submitOrder}
        >
          Place Order
        </Button>
      {/if}
    </div>
  {/if}

  <!-- Floating Cart Button (when cart has items) -->
  {#if cartCount > 0 && !showCart && !orderSubmitted}
    <div
      class="fixed bottom-4 left-4 right-4 z-40"
      transition:fly={{ y: 100, duration: 200 }}
    >
      <button
        class="flex w-full items-center justify-between rounded-xl bg-fulala-red px-4 py-3 text-white shadow-lg"
        onclick={() => (showCart = true)}
      >
        <span class="flex items-center gap-2">
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-fulala-red">
            {cartCount}
          </span>
          View Order
        </span>
        <span class="font-bold">{cartTotal} Kč</span>
      </button>
    </div>
  {/if}
</main>
