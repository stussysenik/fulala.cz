/**
 * Overlap detector dev utility for fulala-public.
 * Scans the DOM for visually overlapping elements and highlights them
 * using the overlap-overlay canvas.
 *
 * Toggle with Ctrl+Option+Shift+D in dev mode.
 */

import { drawOverlaps, toggle, destroy, show, type OverlapPair } from './overlap-overlay';

let active = false;
let rafId: number | null = null;

/** Elements to skip when scanning for overlaps */
const SKIP_SELECTORS = [
  '#overlap-debug-canvas',
  'script',
  'style',
  'link',
  'meta',
  'head',
  'br',
  'hr',
  'noscript',
];

const SKIP_SELECTOR = SKIP_SELECTORS.join(',');

function isVisible(el: Element): boolean {
  const style = getComputedStyle(el);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    el.getBoundingClientRect().width > 0 &&
    el.getBoundingClientRect().height > 0
  );
}

function getLabel(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.split(/\s+/).slice(0, 2).join('.')
    : '';
  return `${tag}${id}${cls}`.slice(0, 40);
}

function rectsOverlap(a: DOMRect, b: DOMRect): boolean {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

function isAncestor(a: Element, b: Element): boolean {
  return a.contains(b) || b.contains(a);
}

function scan(): OverlapPair[] {
  const elements = Array.from(document.querySelectorAll('*'))
    .filter(el => !el.matches(SKIP_SELECTOR) && isVisible(el));

  const pairs: OverlapPair[] = [];
  const rects = new Map<Element, DOMRect>();

  for (const el of elements) {
    rects.set(el, el.getBoundingClientRect());
  }

  // Only check siblings and non-ancestor pairs to reduce noise
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const a = elements[i];
      const b = elements[j];

      // Skip ancestor-descendant pairs (overlap is expected)
      if (isAncestor(a, b)) continue;

      const rectA = rects.get(a)!;
      const rectB = rects.get(b)!;

      // Skip tiny elements
      if (rectA.width < 5 || rectA.height < 5 || rectB.width < 5 || rectB.height < 5) continue;

      if (rectsOverlap(rectA, rectB)) {
        // Check if overlap area is significant (> 20% of smaller element)
        const overlapX = Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left);
        const overlapY = Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top);
        const overlapArea = overlapX * overlapY;
        const smallerArea = Math.min(rectA.width * rectA.height, rectB.width * rectB.height);

        if (overlapArea / smallerArea > 0.2) {
          pairs.push({
            a: { label: getLabel(a), rect: rectA },
            b: { label: getLabel(b), rect: rectB },
          });
        }
      }
    }
  }

  return pairs;
}

function loop() {
  if (!active) return;
  const pairs = scan();
  drawOverlaps(pairs);
  rafId = requestAnimationFrame(loop);
}

export function toggleDetector(): boolean {
  active = toggle();
  if (active) {
    show();
    loop();
    console.log('[overlap-detector] ON — scanning for overlaps');
  } else {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    console.log('[overlap-detector] OFF');
  }
  return active;
}

export function init() {
  window.addEventListener('keydown', (e) => {
    // Ctrl+Option+Shift+D
    if (e.ctrlKey && e.altKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleDetector();
    }
  });

  console.log('[overlap-detector] Ready — press Ctrl+Option+Shift+D to toggle');
}

export function cleanup() {
  active = false;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  destroy();
}
