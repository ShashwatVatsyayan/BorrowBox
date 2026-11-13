/**
 * Full-document snapshots of the page in a given theme.
 * Ported from https://github.com/codemure-official/ink-bleed-theme-changer
 *
 * We capture the whole document (not just the viewport) so a snapshot stays valid
 * while the user scrolls; the shader picks the visible window using the live scroll
 * offset. The theme is applied to html2canvas' cloned document via `onclone`, so the
 * live page never flickers during pre-capture.
 */

const BACKGROUND = {
  light: '#F8FAFC',
  dark: '#0B0F19',
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
  return { width: el.clientWidth, height: Math.max(el.scrollHeight, el.clientHeight) };
}

/**
 * Identifies the layout a snapshot depends on. Viewport height is deliberately
 * excluded (mobile URL-bar show/hide changes it without reflowing the document).
 */
export function layoutKey(scale) {
  const { width, height } = documentSize();
  return `${width}x${height}@${scale}`;
}

export async function capturePage(theme, scale, maxTextureSize) {
  const t0 = performance.now();
  const key = layoutKey(scale);
  const { width, height } = documentSize();

  // Never exceed what the GPU can hold; the shader handles scale != canvas DPR.
  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height);

  // Lazy-loaded: html2canvas is ~200 KB and only needed after first paint.
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(document.body, {
    scale: safeScale,
    backgroundColor: BACKGROUND[theme] || (theme === 'dark' ? '#0B0F19' : '#F8FAFC'),
    x: 0,
    y: 0,
    width,
    height,
    scrollX: 0,
    scrollY: 0,
    // The clone iframe renders without a scrollbar, so give it the live page's
    // scrollbar-less width; otherwise centred content shifts by half a scrollbar.
    windowWidth: width,
    windowHeight: document.documentElement.clientHeight,
    logging: false,
    useCORS: true,
    onclone: (doc) => {
      doc.documentElement.dataset.theme = theme;
      if (theme === 'dark') {
        doc.documentElement.classList.add('dark');
      } else {
        doc.documentElement.classList.remove('dark');
      }
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

  return { theme, canvas, scale: safeScale, key, ms: performance.now() - t0 };
}
