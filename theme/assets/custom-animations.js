/**
 * custom-animations.js
 * Reusable GSAP + ScrollTrigger utility classes for Shopify themes.
 *
 * Usage: add any fx-* class to an element in your Liquid/HTML markup.
 * Example: <div class="fx-fade-up">...</div>
 *
 * Optional data attributes:
 *   data-fx-delay="0.2"       — delay in seconds before animation starts
 *   data-fx-duration="1.2"  — override default duration
 *   data-fx-stagger="0.12"    — stagger interval for .fx-stagger-list children
 *   data-fx-reveal="words"    — split mode for .fx-text-reveal ("words" | "chars")
 *   data-fx-speed="0.4"       — parallax intensity for .fx-parallax (default 0.35)
 *   data-fx-duration="20"     — loop duration for .fx-marquee (default 20 seconds)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Shared config ─────────────────────────────────────────────── */

  const SCROLL_START = 'top 85%';
  const TOGGLE_ACTIONS = 'play none none none';
  const DEFAULT_DURATION = 1;
  const DEFAULT_EASE = 'power3.out';

  /** Read optional per-element overrides from data attributes */
  function getElementConfig(el) {
    return {
      delay: parseFloat(el.dataset.fxDelay) || 0,
      duration: parseFloat(el.dataset.fxDuration) || DEFAULT_DURATION,
    };
  }

  /** Skip animation and reveal element immediately (a11y / missing GSAP) */
  function revealInstantly(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      gsap.set(el, { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1 });
    });
  }

  if (prefersReducedMotion) {
    revealInstantly(
      '.fx-fade-in, .fx-fade-up, .fx-fade-down, .fx-slide-left, .fx-slide-right, .fx-zoom-in, .fx-text-reveal, .fx-stagger-list > *'
    );
    return;
  }

  /** Create a scroll-triggered entrance tween for a single element */
  function scrollReveal(el, fromVars, toVars = {}) {
    const { delay, duration } = getElementConfig(el);

    gsap.fromTo(
      el,
      fromVars,
      {
        ...toVars,
        duration,
        delay,
        ease: toVars.ease || DEFAULT_EASE,
        scrollTrigger: {
          trigger: el,
          start: SCROLL_START,
          toggleActions: TOGGLE_ACTIONS,
        },
      }
    );
  }

  /* ── .fx-fade-in ─────────────────────────────────────────────────
   * Simple smooth opacity fade-in when the element enters the viewport.
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-fade-in').forEach((el) => {
    gsap.set(el, { opacity: 0 });
    scrollReveal(el, { opacity: 0 }, { opacity: 1, ease: 'power2.out' });
  });

  /* ── .fx-fade-up ─────────────────────────────────────────────────
   * Fades in while sliding upward from y: 50 — classic luxury reveal.
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-fade-up').forEach((el) => {
    gsap.set(el, { opacity: 0, y: 50 });
    scrollReveal(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
  });

  /* ── .fx-fade-down ───────────────────────────────────────────────
   * Fades in while sliding downward from y: -50.
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-fade-down').forEach((el) => {
    gsap.set(el, { opacity: 0, y: -50 });
    scrollReveal(el, { opacity: 0, y: -50 }, { opacity: 1, y: 0 });
  });

  /* ── .fx-slide-left / .fx-slide-right ────────────────────────────
   * Slides in from the left or right edge of the viewport with a fade.
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-slide-left').forEach((el) => {
    gsap.set(el, { opacity: 0, x: -80 });
    scrollReveal(el, { opacity: 0, x: -80 }, { opacity: 1, x: 0, ease: 'power3.out' });
  });

  gsap.utils.toArray('.fx-slide-right').forEach((el) => {
    gsap.set(el, { opacity: 0, x: 80 });
    scrollReveal(el, { opacity: 0, x: 80 }, { opacity: 1, x: 0, ease: 'power3.out' });
  });

  /* ── .fx-stagger-list ────────────────────────────────────────────
   * Animates direct children sequentially with a stagger delay.
   * Perfect for product grids, feature lists, and card rows.
   *
   * Optional: data-fx-stagger="0.15" on the container to adjust timing.
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-stagger-list').forEach((container) => {
    const children = gsap.utils.toArray(container.children);
    if (!children.length) return;

    const stagger = parseFloat(container.dataset.fxStagger) || 0.12;
    const { delay, duration } = getElementConfig(container);

    gsap.set(children, { opacity: 0, y: 40 });

    gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      stagger,
      scrollTrigger: {
        trigger: container,
        start: SCROLL_START,
        toggleActions: TOGGLE_ACTIONS,
      },
    });
  });

  /* ── .fx-zoom-in ─────────────────────────────────────────────────
   * Subtle scale-up from 0.8 → 1 with a soft fade for a premium feel.
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-zoom-in').forEach((el) => {
    gsap.set(el, { opacity: 0, scale: 0.8 });
    scrollReveal(el, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ease: 'power2.out' });
  });

  /* ── .fx-text-reveal ─────────────────────────────────────────────
   * Splits heading text into animated words or characters.
   * Wraps each unit in a <span> and staggers their reveal upward.
   *
   * Optional: data-fx-reveal="chars" for letter-by-letter animation.
   * Default: data-fx-reveal="words" (word-by-word).
   * ─────────────────────────────────────────────────────────────── */
  function initTextReveal(el) {
    const originalText = el.textContent.trim();
    if (!originalText) return;

    const mode = el.dataset.fxReveal || 'words';
    el.setAttribute('aria-label', originalText);
    el.textContent = '';

    const wrapper = document.createElement('span');
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.display = 'inline';

    const units =
      mode === 'chars'
        ? originalText.split('')
        : originalText.split(/(\s+)/).filter((part) => part.length > 0);

    const spans = units.map((unit) => {
      const mask = document.createElement('span');
      mask.style.display = 'inline-block';
      mask.style.overflow = 'hidden';
      mask.style.verticalAlign = 'top';
      if (unit.trim() === '') mask.style.width = '0.25em';

      const inner = document.createElement('span');
      inner.textContent = unit;
      inner.style.display = 'inline-block';
      mask.appendChild(inner);
      wrapper.appendChild(mask);
      return inner;
    });

    el.appendChild(wrapper);

    gsap.set(spans, { opacity: 0, y: '100%' });

    const { delay, duration } = getElementConfig(el);
    const stagger = parseFloat(el.dataset.fxStagger) || (mode === 'chars' ? 0.03 : 0.08);

    gsap.to(spans, {
      opacity: 1,
      y: '0%',
      duration: duration * 0.9,
      delay,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: el,
        start: SCROLL_START,
        toggleActions: TOGGLE_ACTIONS,
      },
    });
  }

  gsap.utils.toArray('.fx-text-reveal').forEach(initTextReveal);

  /* ── .fx-parallax ────────────────────────────────────────────────
   * Creates a gentle luxury parallax effect tied to scroll position.
   * Apply to a container; animates the element itself or its <img> child.
   *
   * Optional: data-fx-speed="0.4" — higher = more movement (default 0.35).
   * Uses scrub for buttery, scroll-linked motion.
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-parallax').forEach((el) => {
    const target = el.querySelector('img') || el;
    const speed = parseFloat(el.dataset.fxSpeed) || 0.35;
    const yPercent = speed * 100;

    gsap.fromTo(
      target,
      { yPercent: -yPercent / 2 },
      {
        yPercent: yPercent / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  /* ── .fx-marquee ─────────────────────────────────────────────────
   * Smooth infinite horizontal scroll — text moves left continuously.
   *
   * HTML structure:
   *   <div class="fx-marquee" data-fx-duration="20" style="overflow: hidden;">
   *     <div class="fx-marquee__track" style="display: flex; width: max-content;">
   *       <span class="fx-marquee__item">Luxury Brand · Timeless Design · </span>
   *     </div>
   *   </div>
   *
   * One .fx-marquee__item is enough — the script clones it for a seamless loop.
   * Optional: data-fx-duration="15" — seconds per full loop (default 20).
   * ─────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.fx-marquee').forEach((el) => {
    const track = el.querySelector('.fx-marquee__track');
    if (!track) return;

    const items = gsap.utils.toArray(track.children);
    if (!items.length) return;

    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    const duration = parseFloat(el.dataset.fxDuration) || 20;

    gsap.set(el, { overflow: 'hidden' });
    gsap.set(track, { display: 'flex', width: 'max-content', flexWrap: 'nowrap', xPercent: 0 });

    gsap.to(track, {
      xPercent: -50,
      duration,
      ease: 'none',
      repeat: -1,
    });
  });

  /* ── Shopify theme editor support ────────────────────────────────
   * Refresh ScrollTrigger when sections are loaded/reordered in the editor.
   * ─────────────────────────────────────────────────────────────── */
  if (Shopify && Shopify.designMode) {
    document.addEventListener('shopify:section:load', () => ScrollTrigger.refresh());
    document.addEventListener('shopify:section:reorder', () => ScrollTrigger.refresh());
  }
});
