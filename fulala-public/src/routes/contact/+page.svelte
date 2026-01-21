<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { LocationMap } from '$lib/components/map';

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

  const contactInfo = [
    {
      icon: '📍',
      label: 'Address',
      value: 'Prague, Czech Republic',
      subtext: 'Location coming soon!',
    },
    {
      icon: '⏰',
      label: 'Hours',
      value: 'Tue - Sun: 11:00 - 21:00',
      subtext: 'Closed Mondays',
    },
    {
      icon: '📧',
      label: 'Email',
      value: 'hello@fulala.cz',
      link: 'mailto:hello@fulala.cz',
    },
  ];
</script>

<svelte:head>
  <title>Contact | Fulala</title>
  <meta name="description" content="Get in touch with Fulala. Find our location, hours, and contact information." />
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12">
  <!-- Header -->
  {#if mounted}
    <div in:fly={{ y: -20, duration: 400 }} class="text-center mb-16">
      <h1 class="text-5xl md:text-7xl text-fulala-red text-shadow mb-4">
        FIND US
      </h1>
      <p class="text-lg text-soy-brown/70">
        We'd love to see you!
      </p>
    </div>
  {/if}

  <div class="grid md:grid-cols-2 gap-12">
    <!-- Contact Info -->
    {#if mounted}
      <div in:fly={{ x: -30, duration: 500, delay: 200 }} class="space-y-8">
        <h2 class="text-3xl text-ink-black mb-6">Contact Info</h2>

        <div class="space-y-6">
          {#each contactInfo as info}
            <div class="flex items-start gap-4">
              <div class="text-3xl">{info.icon}</div>
              <div>
                <p class="text-sm text-soy-brown/50 uppercase tracking-wide">
                  {info.label}
                </p>
                {#if info.link}
                  <a
                    href={info.link}
                    class="text-lg text-ink-black hover:text-fulala-red transition-colors"
                  >
                    {info.value}
                  </a>
                {:else}
                  <p class="text-lg text-ink-black">{info.value}</p>
                {/if}
                {#if info.subtext}
                  <p class="text-sm text-soy-brown/50">{info.subtext}</p>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <!-- Map -->
        <LocationMap
          latitude={50.0755}
          longitude={14.4378}
          zoom={15}
          markerTitle="Fulala"
          address="Prague, Czech Republic"
          class="mt-8"
        />
      </div>
    {/if}

    <!-- Contact Form -->
    {#if mounted}
      <div in:fly={{ x: 30, duration: 500, delay: 300 }}>
        <h2 class="text-3xl text-ink-black mb-6">Send a Message</h2>

        {#if formState === 'success'}
          <div
            in:fade
            class="p-8 bg-tiger-orange/30 rounded-xl text-center"
          >
            <div class="text-5xl mb-4">🎉</div>
            <h3 class="text-2xl text-ink-black mb-2">Message Sent!</h3>
            <p class="text-soy-brown/70 mb-6">
              Thanks for reaching out! We'll get back to you soon.
            </p>
            <button onclick={resetForm} class="btn-secondary">
              Send Another
            </button>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="space-y-6">
            <div>
              <label for="name" class="block text-sm text-soy-brown/70 mb-2">
                Your Name
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
                placeholder="Tiger McTigerface"
              />
            </div>

            <div>
              <label for="email" class="block text-sm text-soy-brown/70 mb-2">
                Email
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
                placeholder="tiger@example.com"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm text-soy-brown/70 mb-2">
                Subject
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
                <option value="">Select a topic...</option>
                <option value="general">General Inquiry</option>
                <option value="reservation">Reservation</option>
                <option value="catering">Catering</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm text-soy-brown/70 mb-2">
                Message
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
                placeholder="Tell us what's on your mind..."
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
                  Sending...
                </span>
              {:else}
                Send Message
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
        Common Questions
      </h2>

      <div class="grid md:grid-cols-2 gap-6">
        {#each [
          {
            q: 'Do you take reservations?',
            a: 'Yes! You can book a table by email or phone. Walk-ins are also welcome.',
          },
          {
            q: 'Is there vegetarian options?',
            a: 'Absolutely! Our Zen Garden dumplings and many sides are vegetarian-friendly.',
          },
          {
            q: 'Do you offer catering?',
            a: 'We do! Contact us for catering inquiries and we\'ll create a custom menu.',
          },
          {
            q: 'Can I buy dumplings to take home?',
            a: 'Yes, frozen dumplings are available for takeaway. Ask our team!',
          },
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
