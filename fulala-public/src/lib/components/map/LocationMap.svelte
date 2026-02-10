<script lang="ts">
  interface Props {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    markerTitle?: string;
    address?: string;
    googleMapsUrl?: string;
    class?: string;
  }

  let {
    latitude = 50.0892311,
    longitude = 14.4202074,
    zoom = 17,
    markerTitle = 'FULALA',
    address = 'Kostečná 121/3, 110 00 Staré Město, Prague',
    googleMapsUrl = 'https://maps.app.goo.gl/mE8kQm8nSKFb5P2H7',
    class: className = '',
  }: Props = $props();

  // Google Maps embed URL (free, no API key needed)
  const embedUrl = $derived(
    `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&t=k&output=embed`
  );

  // Google Maps directions URL
  const directionsUrl = $derived(
    googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  );
</script>

<div class="overflow-hidden rounded-xl {className}">
  <!-- Interactive Google Maps Embed -->
  <div class="relative aspect-video w-full bg-neutral-100">
    <iframe
      src={embedUrl}
      title="Map showing {markerTitle} at {address}"
      class="h-full w-full border-0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>

  <!-- Address & Directions -->
  <div class="bg-white p-4">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-semibold text-soy-brown">{markerTitle}</h3>
        <p class="text-sm text-soy-brown/70">{address}</p>
      </div>

      <div class="flex gap-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 rounded-lg bg-fulala-red px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Directions
        </a>
      </div>
    </div>
  </div>
</div>
