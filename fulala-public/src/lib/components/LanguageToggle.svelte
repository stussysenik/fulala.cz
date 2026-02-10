<script lang="ts">
  import { getLang, setLang } from '$lib/i18n/store.svelte';
  import type { Lang } from '$lib/i18n/translations';

  const languages: { code: Lang; label: string }[] = [
    { code: 'cs', label: 'CZ' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
  ];
</script>

<div class="lang-toggle" role="radiogroup" aria-label="Language selection">
  {#each languages as { code, label }}
    <button
      class="lang-option"
      class:active={getLang() === code}
      onclick={() => setLang(code)}
      role="radio"
      aria-checked={getLang() === code}
      type="button"
    >
      {label}
    </button>
  {/each}
</div>

<style>
  .lang-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border: 2px solid var(--color-fulala-red, #E83636);
    border-radius: 9999px;
    overflow: hidden;
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    background: transparent;
    padding: 0;
    line-height: 1;
  }

  .lang-option {
    padding: 0.375rem 0.625rem;
    color: var(--color-fulala-red, #E83636);
    transition: all 0.15s ease;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  .lang-option.active {
    background: var(--color-fulala-red, #E83636);
    color: white;
  }

  .lang-option:hover:not(.active) {
    background: color-mix(in srgb, var(--color-fulala-red, #E83636) 10%, transparent);
  }
</style>
