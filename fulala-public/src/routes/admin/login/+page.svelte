<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Input } from '$lib/components/ui';
  import type { ActionData } from './$types';

  interface Props {
    form: ActionData;
  }

  let { form }: Props = $props();

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
</script>

<svelte:head>
  <title>Login - Fulala Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-tiger-orange/30 px-4">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="mb-8 text-center">
      <span class="text-6xl">🥟</span>
      <h1 class="mt-4 font-chewy text-3xl text-fulala-red">Fulala Admin</h1>
      <p class="mt-2 text-neutral-600">Sign in to manage your restaurant</p>
    </div>

    <!-- Login Form -->
    <div class="rounded-2xl bg-white p-8 shadow-xl">
      <form
        method="POST"
        action="?/login"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            await update();
          };
        }}
        class="space-y-6"
      >
        {#if form?.error}
          <div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {form.error}
          </div>
        {/if}

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="admin@fulala.cz"
          bind:value={email}
          required
          autocomplete="email"
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          bind:value={password}
          required
          autocomplete="current-password"
        />

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              class="h-4 w-4 rounded border-neutral-300 text-fulala-red focus:ring-fulala-red"
            />
            <span class="text-sm text-neutral-600">Remember me</span>
          </label>
        </div>

        <Button type="submit" fullWidth {loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-neutral-500">
          Demo: admin@fulala.cz / admin123
        </p>
      </div>
    </div>

    <!-- Back to site -->
    <div class="mt-6 text-center">
      <a href="/" class="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back to website
      </a>
    </div>
  </div>
</div>
