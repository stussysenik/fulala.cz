<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    markerTitle?: string;
    address?: string;
    class?: string;
  }

  let {
    latitude = 50.0755, // Prague default
    longitude = 14.4378,
    zoom = 15,
    markerTitle = 'Fulala',
    address = 'Prague, Czech Republic',
    class: className = '',
  }: Props = $props();

  let mapContainer: HTMLDivElement;

  // Generate static map URL using OpenStreetMap
  const staticMapUrl = $derived(
    `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&markers=${latitude},${longitude},ol-marker`
  );

  // Google Maps directions URL
  const directionsUrl = $derived(
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  );

  // Apple Maps URL (for iOS)
  const appleMapsUrl = $derived(
    `https://maps.apple.com/?daddr=${latitude},${longitude}`
  );
</script>

<div class="overflow-hidden rounded-xl {className}">
  <!-- Static Map Image -->
  <div class="relative aspect-video w-full bg-neutral-100">
    <img
      src={staticMapUrl}
      alt="Map showing {markerTitle} location"
      class="h-full w-full object-cover"
      loading="lazy"
    />

    <!-- Overlay with marker icon -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="rounded-full bg-fulala-red p-3 shadow-lg">
          <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div class="mt-1 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-fulala-red"></div>
      </div>
    </div>
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
          class="flex items-center gap-1 rounded-lg bg-fulala-red px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
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
