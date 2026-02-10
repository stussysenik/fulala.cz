<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { LocationMap } from '$lib/components/map';
  import { getT } from '$lib/i18n/store.svelte';

  let mounted = $state(false);
  let formState = $state<'idle' | 'sending' | 'success' | 'error'>('idle');

  onMount(() => {
    mounted = true;
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    formState = 'sending';

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo, always succeed
    formState = 'success';
  }

  function resetForm() {
    formState = 'idle';
  }
</script>

<svelte:head>
  <title>Contact | FULALA</title>
  <meta name="description" content="Get in touch with FULALA. Find our location, hours, and contact information." />
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12">
  <!-- Header with language toggle -->
  {#if mounted}
    <div in:fly={{ y: -20, duration: 400 }} class="text-center mb-16">
      <h1 class="text-5xl md:text-7xl text-fulala-red text-shadow mb-4">
        {getT().findUsTitle}
      </h1>
      <p class="text-lg text-soy-brown/70">
        {getT().findUsSubtitle}
      </p>
    </div>
  {/if}

  <div class="grid md:grid-cols-2 gap-12">
    <!-- Contact Info -->
    {#if mounted}
      <div in:fly={{ x: -30, duration: 500, delay: 200 }} class="space-y-8">
        <h2 class="text-3xl text-ink-black mb-6">{getT().contactInfo}</h2>

        <div class="space-y-6">
          <!-- Address -->
          <div class="flex items-start gap-4">
            <div class="text-3xl">📍</div>
            <div>
              <p class="text-sm text-soy-brown/50 uppercase tracking-wide">
                {getT().address}
              </p>
              <a
                href="https://maps.app.goo.gl/mE8kQm8nSKFb5P2H7"
                class="text-lg text-ink-black hover:text-fulala-red transition-colors"
              >
                {getT().addressValue}
              </a>
              <p class="text-sm text-soy-brown/50">{getT().addressSubtext}</p>
            </div>
          </div>

          <!-- Hours -->
          <div class="flex items-start gap-4">
            <div class="text-3xl">⏰</div>
            <div>
              <p class="text-sm text-soy-brown/50 uppercase tracking-wide">
                {getT().hours}
              </p>
              <p class="text-lg text-ink-black">{getT().hoursValue}</p>
              <p class="text-sm text-soy-brown/50">{getT().hoursClosed}</p>
            </div>
          </div>

          <!-- Email — Say hello in any language! -->
          <div class="flex items-start gap-4">
            <div class="text-3xl">📧</div>
            <div>
              <p class="text-sm text-soy-brown/50 uppercase tracking-wide">
                {getT().email}
              </p>
              <div class="space-y-1 mt-1">
                {#each [
                  { addr: 'ahoj@fulala.cz', flag: '🇨🇿' },
                  { addr: 'hello@fulala.cz', flag: '🇬🇧' },
                  { addr: 'nihao@fulala.cz', flag: '🇨🇳' },
                  { addr: 'bonjour@fulala.cz', flag: '🇫🇷' },
                  { addr: 'ciao@fulala.cz', flag: '🇮🇹' },
                  { addr: 'dobryden@fulala.cz', flag: '🇷🇺' },
                  { addr: 'nazdar@fulala.cz', flag: '🇨🇿' },
                ] as item}
                  <a
                    href="mailto:ahoj@fulala.cz"
                    class="block text-sm text-ink-black hover:text-fulala-red transition-colors"
                  >
                    <span class="mr-1.5">{item.flag}</span>{item.addr}
                  </a>
                {/each}
              </div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <LocationMap
          latitude={50.0892311}
          longitude={14.4202074}
          zoom={17}
          markerTitle="FULALA"
          address="Kostečná 121/3, 110 00 Staré Město, Prague"
          googleMapsUrl="https://maps.app.goo.gl/mE8kQm8nSKFb5P2H7"
          class="mt-8"
        />
      </div>
    {/if}

    <!-- Contact Form -->
    {#if mounted}
      <div in:fly={{ x: 30, duration: 500, delay: 300 }}>
        <h2 class="text-3xl text-ink-black mb-6">{getT().sendMessage}</h2>

        {#if formState === 'success'}
          <div
            in:fade
            class="p-8 bg-tiger-orange/30 rounded-xl text-center"
          >
            <div class="text-5xl mb-4">🎉</div>
            <h3 class="text-2xl text-ink-black mb-2">{getT().messageSent}</h3>
            <p class="text-soy-brown/70 mb-6">
              {getT().messageSentDesc}
            </p>
            <button onclick={resetForm} class="btn-secondary">
              {getT().sendAnother}
            </button>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="space-y-6">
            <div>
              <label for="name" class="block text-sm text-soy-brown/70 mb-2">
                {getT().yourName}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={formState === 'sending'}
                class="w-full px-4 py-3 bg-white border-2 border-tiger-orange rounded-lg
                       focus:outline-none focus:border-fulala-red transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={getT().namePlaceholder}
              />
            </div>

            <div>
              <label for="email" class="block text-sm text-soy-brown/70 mb-2">
                {getT().emailLabel}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={formState === 'sending'}
                class="w-full px-4 py-3 bg-white border-2 border-tiger-orange rounded-lg
                       focus:outline-none focus:border-fulala-red transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={getT().emailPlaceholder}
              />
            </div>

            <div>
              <label for="subject" class="block text-sm text-soy-brown/70 mb-2">
                {getT().subject}
              </label>
              <select
                id="subject"
                name="subject"
                required
                disabled={formState === 'sending'}
                class="w-full px-4 py-3 bg-white border-2 border-tiger-orange rounded-lg
                       focus:outline-none focus:border-fulala-red transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{getT().selectTopic}</option>
                <option value="general">{getT().optGeneral}</option>
                <option value="reservation">{getT().optReservation}</option>
                <option value="catering">{getT().optCatering}</option>
                <option value="feedback">{getT().optFeedback}</option>
                <option value="other">{getT().optOther}</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm text-soy-brown/70 mb-2">
                {getT().message}
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                disabled={formState === 'sending'}
                class="w-full px-4 py-3 bg-white border-2 border-tiger-orange rounded-lg
                       focus:outline-none focus:border-fulala-red transition-colors resize-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={getT().messagePlaceholder}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={formState === 'sending'}
              class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if formState === 'sending'}
                <span class="inline-flex items-center gap-2">
                  <span class="animate-spin">🥟</span>
                  {getT().sending}
                </span>
              {:else}
                {getT().sendBtn}
              {/if}
            </button>
          </form>
        {/if}
      </div>
    {/if}
  </div>

  <!-- FAQ Section -->
  {#if mounted}
    <section
      in:fly={{ y: 40, duration: 500, delay: 500 }}
      class="mt-20"
    >
      <h2 class="text-3xl text-ink-black text-center mb-8">
        {getT().commonQuestions}
      </h2>

      <div class="grid md:grid-cols-2 gap-6">
        {#each [
          { q: getT().faq1q, a: getT().faq1a },
          { q: getT().faq2q, a: getT().faq2a },
          { q: getT().faq3q, a: getT().faq3a },
          { q: getT().faq4q, a: getT().faq4a },
        ] as faq}
          <div class="p-6 bg-tiger-orange/20 rounded-xl">
            <h3 class="text-lg text-ink-black mb-2">{faq.q}</h3>
            <p class="text-sm text-soy-brown/70">{faq.a}</p>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>
