/**
 * Visual overlay that draws red bounding boxes around overlapping elements.
 * Works in tandem with overlap-detector.ts.
 */

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let visible = false;

function ensureCanvas(): CanvasRenderingContext2D {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'overlap-debug-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
    `;
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx = canvas.getContext('2d')!;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  return ctx;
}

export interface OverlapPair {
  a: { label: string; rect: DOMRect };
  b: { label: string; rect: DOMRect };
}

export function drawOverlaps(pairs: OverlapPair[]) {
  const c = ensureCanvas();
  c.clearRect(0, 0, canvas!.width, canvas!.height);

  if (!visible || pairs.length === 0) return;

  c.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  c.lineWidth = 2;
  c.fillStyle = 'rgba(255, 0, 0, 0.1)';
  c.font = '11px monospace';

  const drawn = new Set<string>();

  for (const { a, b } of pairs) {
    for (const item of [a, b]) {
      const key = `${item.rect.x},${item.rect.y},${item.rect.width},${item.rect.height}`;
      if (drawn.has(key)) continue;
      drawn.add(key);

      c.strokeRect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);
      c.fillRect(item.rect.x, item.rect.y, item.rect.width, item.rect.height);

      // Label
      c.fillStyle = 'rgba(255, 0, 0, 0.9)';
      c.fillText(item.label, item.rect.x + 2, item.rect.y - 4);
      c.fillStyle = 'rgba(255, 0, 0, 0.1)';
    }
  }
}

export function show() {
  visible = true;
  if (canvas) canvas.style.display = 'block';
}

export function hide() {
  visible = false;
  if (canvas) canvas.style.display = 'none';
}

export function toggle(): boolean {
  if (visible) {
    hide();
  } else {
    show();
  }
  return visible;
}

export function destroy() {
  if (canvas) {
    canvas.remove();
    canvas = null;
    ctx = null;
  }
  visible = false;
}
