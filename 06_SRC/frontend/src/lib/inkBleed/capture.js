/**
 * Viewport-aligned snapshots of the page in a given theme.
 * Ported from https://github.com/codemure-official/ink-bleed-theme-changer
 *
 * Aligns the captured canvas 1:1 with the active viewport and scroll position
 * to completely eliminate horizontal and vertical layout jumps during transition.
 */

const BACKGROUND = {
  light: '#F8FAFC',
  dark: '#000000',
};

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** Device-pixel ratio used for both the snapshots and the overlay canvas. */
export function renderScale() {
  if (typeof window === 'undefined') return 1;
  const cap = isCoarsePointer() ? 1.5 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function documentSize() {
  if (typeof document === 'undefined') return { width: 1024, height: 768 };
  const el = document.documentElement;
  return { width: el.clientWidth, height: el.clientHeight };
}

/**
 * Identifies the exact layout a snapshot depends on:
 * Viewport width x height, device scale, route path, and scroll position.
 */
export function layoutKey(scale) {
  const { width, height } = documentSize();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const scroll = typeof window !== 'undefined' ? Math.round((window.scrollY || 0) / 40) * 40 : 0;
  return `${width}x${height}@${scale}:${path}:${scroll}`;
}

export async function capturePage(theme, scale, maxTextureSize) {
  const t0 = performance.now();
  const key = layoutKey(scale);
  const { width, height } = documentSize();

  const scrollX = typeof window !== 'undefined' ? window.scrollX || window.pageXOffset || 0 : 0;
  const scrollY = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0;

  // Never exceed what the GPU can hold; the shader handles scale != canvas DPR.
  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height);

  // Lazy-loaded: html2canvas is ~200 KB and only needed after first paint.
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(document.documentElement, {
    scale: safeScale,
    backgroundColor: BACKGROUND[theme] || (theme === 'dark' ? '#000000' : '#F8FAFC'),
    x: scrollX,
    y: scrollY,
    width,
    height,
    scrollX: 0,
    scrollY: 0,
    windowWidth: width,
    windowHeight: height,
    logging: false,
    useCORS: true,
    onclone: (doc) => {
      doc.documentElement.dataset.theme = theme;
      if (theme === 'dark') {
        doc.documentElement.classList.add('dark');
      } else {
        doc.documentElement.classList.remove('dark');
      }
      doc.documentElement.style.overflow = 'hidden';
      doc.body.style.overflow = 'hidden';
      // The live toggle is drawn above the overlay, so leave a hole for it if tagged
      doc.querySelectorAll('[data-ink-live]').forEach((el) => {
        el.style.visibility = 'hidden';
      });
      // Ensure the canvas itself is not captured into the background image
      doc.querySelectorAll('.ink-canvas').forEach((el) => {
        el.style.visibility = 'hidden';
      });
    },
  });

  return { theme, canvas, scale: safeScale, key, scrollX, scrollY, ms: performance.now() - t0 };
}
