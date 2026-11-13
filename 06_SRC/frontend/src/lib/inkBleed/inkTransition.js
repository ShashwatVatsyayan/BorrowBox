import gsap from 'gsap';
import { capturePage, layoutKey, renderScale } from './capture';
import { inkParams } from './params';
import { InkRenderer } from './renderer';
import { applyTheme, getTheme, otherTheme } from './theme';

const EASE = 'power3.out';
const FADE_OUT = 0.15;
const RESIZE_DEBOUNCE_MS = 250;
const CSS_FADE_S = 0.45;

/**
 * Spread shape over time.
 * growth: base radius at progress 1 relative to farthest corner.
 * cleanupFrom: fraction of linear duration after which extra reach cleans up noise edge.
 */
export const SPREAD = { growth: 0.7, cleanupFrom: 0.45, cleanupReach: 0.4, cleanupPow: 2 };

const reducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : { matches: false, addEventListener: () => {} };

/**
 * Orchestrates the theme transition:
 * 1. Pre-captures and caches snapshots of both themes on the GPU.
 * 2. On toggle, renders the "from" image on WebGL canvas, flips live DOM underneath,
 *    spreads procedural ink with FBM domain warping, then fades out the canvas.
 * 3. Supports mid-spread interruption by freezing the composite.
 * 4. Gracefully falls back to CSS color cross-fade when WebGL2 is unavailable or reduced-motion is active.
 */
export class InkTransition {
  constructor(canvas, toggleButton = null, opts = {}) {
    this.canvas = canvas;
    this.toggleButton = toggleButton;
    this.onThemeChange = opts.onThemeChange || null;
    this.state = { progress: 0, time: 0 };
    this.tween = null;
    this.fade = null;
    this.frame = null;
    this.cssFadeTimer = 0;
    this.replayTimer = 0;
    this.last = null;

    this.captureGen = 0;
    this.capturing = false;
    this.captureQueued = false;
    this.resizeTimer = 0;

    this.renderer = opts.webgl === false ? null : InkRenderer.create(canvas);
    if (!this.renderer) {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.ink = 'css';
      }
      return;
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.ink = 'webgl';
    }

    this.renderer.resize(renderScale());
    this.renderer.watchContext(
      () => this.cancel(),
      () => this.scheduleCapture(0)
    );

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.renderer?.resize(renderScale());
        if (this.frame) this.draw();
        this.scheduleCapture(RESIZE_DEBOUNCE_MS);
      });

      if (typeof ResizeObserver !== 'undefined' && document.body) {
        new ResizeObserver(() => this.scheduleCapture(RESIZE_DEBOUNCE_MS)).observe(document.body);
      }

      reducedMotion.addEventListener('change', () => this.scheduleCapture(0));

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => this.scheduleCapture(0)).catch(() => {});
      } else {
        this.scheduleCapture(100);
      }
    }
  }

  get isWebGL() {
    return this.renderer !== null;
  }

  get isAnimating() {
    return this.frame !== null;
  }

  get lastClick() {
    return this.last;
  }

  /**
   * Toggle the theme, spreading organically from given point (viewport px) or toggle button.
   */
  toggle(point, seed) {
    if (typeof window !== 'undefined') {
      window.clearTimeout(this.replayTimer);
    }
    const to = otherTheme(getTheme());
    const renderer = this.renderer;
    const scale = renderScale();
    const key = layoutKey(scale);
    const interrupting = this.frame !== null;

    const canAnimate =
      renderer !== null &&
      !renderer.isLost &&
      !reducedMotion.matches &&
      renderer.hasValid(to, key) &&
      (interrupting || renderer.hasValid(getTheme(), key));

    if (!canAnimate || !renderer) {
      this.cancel();
      this.crossFade(to);
      if (renderer && !reducedMotion.matches) {
        this.scheduleCapture(0);
      }
      return;
    }

    // Interrupted: freeze exactly what is on screen and spread the new ink over it
    let from = getTheme();
    if (interrupting) {
      this.tween?.kill();
      this.fade?.kill();
      this.tween = this.fade = null;
      renderer.resize(scale);
      const frozen = this.currentFrame();
      from = frozen && renderer.freeze(frozen) ? 'composite' : getTheme();
    }

    const center = point ?? this.toggleCenter();
    const maxDist = farthestCorner(center);
    const frameSeed = seed ?? randomSeed();
    this.last = { point: center, seed: frameSeed, from: otherTheme(to) };

    this.frame = { from, to, center, maxDist, seed: frameSeed };
    this.state.progress = 0;
    this.state.time = 0;

    renderer.resize(scale);
    this.draw();

    // Show overlay showing "from", flip DOM underneath to "to"
    gsap.set(renderer.canvas, { opacity: 1 });
    renderer.canvas.classList.add('is-active');
    applyTheme(to, this.toggleButton);
    if (this.onThemeChange) {
      this.onThemeChange(to);
    }

    const duration = inkParams.duration;

    this.tween = gsap.to(this.state, {
      progress: 1,
      duration,
      ease: EASE,
      onUpdate: () => {
        this.state.time = this.tween?.time() ?? 0;
        this.draw();
      },
      onComplete: () => this.finish(),
    });
    this.tween.timeScale(inkParams.timeScale);
  }

  replay() {
    const last = this.last;
    if (!last || typeof window === 'undefined') return false;
    window.clearTimeout(this.replayTimer);
    this.cancel();
    if (getTheme() !== last.from) {
      applyTheme(last.from, this.toggleButton);
      if (this.onThemeChange) {
        this.onThemeChange(last.from);
      }
    }
    this.replayTimer = window.setTimeout(() => this.toggle(last.point, last.seed), 400);
    return true;
  }

  setTimeScale(scale) {
    inkParams.timeScale = scale;
    this.tween?.timeScale(scale);
    this.fade?.timeScale(scale);
  }

  currentFrame() {
    if (!this.frame) return null;
    const { progress, time } = this.state;
    const { maxDist } = this.frame;
    const linear = Math.min(1, time / inkParams.duration);
    const ramp = Math.max(0, (linear - SPREAD.cleanupFrom) / (1 - SPREAD.cleanupFrom));
    const cleanup =
      Math.pow(ramp, SPREAD.cleanupPow) * maxDist * SPREAD.cleanupReach +
      Math.max(0, (linear - 0.97) / 0.03) * maxDist;

    return { ...this.frame, progress, time, radius: progress * maxDist * SPREAD.growth, cleanup };
  }

  draw() {
    const frame = this.currentFrame();
    if (this.renderer && frame) {
      this.renderer.draw(frame);
    }
  }

  finish() {
    const canvas = this.renderer?.canvas;
    this.tween = null;
    if (!canvas) return;
    this.fade = gsap
      .to(canvas, { opacity: 0, duration: FADE_OUT, ease: 'none', onComplete: () => this.hide() })
      .timeScale(inkParams.timeScale);
  }

  hide() {
    this.fade = null;
    this.frame = null;
    this.renderer?.canvas.classList.remove('is-active');
    if (this.captureQueued) {
      this.scheduleCapture(0);
    }
  }

  cancel() {
    if (!this.frame) return;
    this.tween?.kill();
    this.fade?.kill();
    this.tween = null;
    this.hide();
  }

  crossFade(to) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.add('theme-fade');
    root.style.setProperty('--theme-fade', `${CSS_FADE_S}s`);
    applyTheme(to, this.toggleButton);
    if (this.onThemeChange) {
      this.onThemeChange(to);
    }
    if (typeof window !== 'undefined') {
      window.clearTimeout(this.cssFadeTimer);
      this.cssFadeTimer = window.setTimeout(() => {
        root.classList.remove('theme-fade');
        if (this.captureQueued) {
          this.scheduleCapture(0);
        }
      }, CSS_FADE_S * 1000 + 50);
    }
  }

  toggleCenter() {
    if (typeof window === 'undefined') return { x: 500, y: 500 };
    const r = this.toggleButton?.getBoundingClientRect();
    if (!r) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  scheduleCapture(delay) {
    if (typeof window === 'undefined') return;
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => void this.captureAll(), delay);
  }

  async captureAll() {
    const renderer = this.renderer;
    if (!renderer || renderer.isLost || reducedMotion.matches) return;

    if (this.capturing || this.frame || (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-fade'))) {
      this.captureQueued = true;
      return;
    }

    const scale = renderScale();
    const key = layoutKey(scale);
    const current = getTheme();
    const themes = [current, otherTheme(current)].filter((t) => !renderer.hasValid(t, key));
    this.captureQueued = false;
    if (themes.length === 0) return;

    const gen = ++this.captureGen;
    this.capturing = true;
    try {
      for (const theme of themes) {
        const snap = await capturePage(theme, scale, renderer.maxTextureSize);
        if (gen !== this.captureGen) return;
        if (snap.key !== layoutKey(renderScale())) {
          this.captureQueued = true;
          break;
        }
        renderer.upload(snap);
      }
    } catch (err) {
      console.error('Ink snapshot capture failed:', err);
    } finally {
      this.capturing = false;
    }

    if (this.captureQueued) {
      this.scheduleCapture(RESIZE_DEBOUNCE_MS);
    }
  }

  clearSnapshots() {
    this.renderer?.clear();
    this.last = null;
    this.capturing = false;
    this.captureQueued = false;
  }

  destroy() {
    this.cancel();
    if (typeof window !== 'undefined') {
      window.clearTimeout(this.resizeTimer);
      window.clearTimeout(this.cssFadeTimer);
      window.clearTimeout(this.replayTimer);
    }
  }
}

function farthestCorner(p) {
  if (typeof document === 'undefined') return 1000;
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  return Math.max(Math.hypot(p.x, p.y), Math.hypot(w - p.x, p.y), Math.hypot(p.x, h - p.y), Math.hypot(w - p.x, h - p.y)) + 4;
}

function randomSeed() {
  return {
    x: Math.random() * 64 - 32,
    y: Math.random() * 64 - 32,
    angle: Math.random() * Math.PI * 2,
  };
}

