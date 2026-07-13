/**
 * Milestone 4 - Premium Homepage Foundation
 *
 * Functionality only - no animations. Carousels reuse the theme's
 * existing <slider-component> (assets/global.js), so this file only
 * covers behavior that doesn't already exist elsewhere:
 *
 *  - Wishlist toggle placeholder (visual state only, ready for a future
 *    wishlist integration - no persistence is implemented here)
 *  - Hero banner: responsive video swap (only the visible breakpoint's
 *    video loads/plays, so we don't download both) + scroll indicator
 *
 * Animation hooks (data-attributes, class names) are left in the markup
 * for Milestone 8 (GSAP) to attach to; this file does not animate anything.
 */

(function () {
  'use strict';

  function initWishlistToggles() {
    document.querySelectorAll('[data-wishlist-toggle]').forEach((button) => {
      if (button.dataset.wishlistBound) return;
      button.dataset.wishlistBound = 'true';

      button.addEventListener('click', () => {
        const pressed = button.getAttribute('aria-pressed') === 'true';
        const next = !pressed;

        button.setAttribute('aria-pressed', String(next));
        button.classList.toggle('product-card-premium__wishlist--active', next);

        const label = next ? button.dataset.labelRemove : button.dataset.labelAdd;
        if (label) button.setAttribute('aria-label', label);
      });
    });
  }

  function initHeroVideos() {
    document.querySelectorAll('[data-hero-video]').forEach((wrapper) => {
      const desktopVideo = wrapper.querySelector('[data-video-desktop]');
      const mobileVideo = wrapper.querySelector('[data-video-mobile]');
      if (!desktopVideo && !mobileVideo) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const breakpoint = window.matchMedia('(max-width: 749px)');

      function syncVideos() {
        const showMobile = breakpoint.matches && mobileVideo;
        const active = showMobile ? mobileVideo : desktopVideo;
        const inactive = showMobile ? desktopVideo : mobileVideo;

        if (inactive) {
          inactive.pause();
          inactive.removeAttribute('src');
          inactive.querySelectorAll('source').forEach((source) => {
            if (source.dataset.src) return; // already unloaded
            source.dataset.src = source.src;
            source.removeAttribute('src');
          });
          inactive.load();
        }

        if (active) {
          let needsLoad = false;
          active.querySelectorAll('source').forEach((source) => {
            if (source.dataset.src) {
              source.src = source.dataset.src;
              delete source.dataset.src;
              needsLoad = true;
            }
          });
          if (needsLoad) active.load();

          if (reducedMotion.matches) {
            active.pause();
          } else {
            const playPromise = active.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {
                // Autoplay can be blocked by the browser; the poster image
                // stays visible in that case, which is an acceptable fallback.
              });
            }
          }
        }
      }

      syncVideos();
      breakpoint.addEventListener('change', syncVideos);
      reducedMotion.addEventListener('change', syncVideos);
    });
  }

  function initScrollIndicators() {
    document.querySelectorAll('[data-scroll-indicator]').forEach((button) => {
      if (button.dataset.scrollBound) return;
      button.dataset.scrollBound = 'true';

      button.addEventListener('click', () => {
        const section = button.closest('.shopify-section');
        const target = section ? section.nextElementSibling : null;

        if (target) {
          target.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start',
          });
        } else {
          window.scrollBy({
            top: window.innerHeight,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          });
        }
      });
    });
  }

  function closeAllHotspots(exceptButton) {
    document.querySelectorAll('[data-lookbook-hotspot][aria-expanded="true"]').forEach((btn) => {
      if (btn === exceptButton) return;
      btn.setAttribute('aria-expanded', 'false');
      const card = btn.nextElementSibling;
      if (card) card.hidden = true;
    });
  }

  function positionHotspotCard(card) {
    // Clamp the popover card so it doesn't overflow the viewport edges.
    card.style.left = '';
    card.style.transform = '';
    const rect = card.getBoundingClientRect();
    const overflowRight = rect.right - window.innerWidth;
    const overflowLeft = rect.left;

    if (overflowRight > 0) {
      card.style.left = 'auto';
      card.style.right = '0';
      card.style.transform = 'none';
    } else if (overflowLeft < 0) {
      card.style.left = '0';
      card.style.transform = 'none';
    }
  }

  function initLookbookHotspots() {
    const hotspotButtons = document.querySelectorAll('[data-lookbook-hotspot]');
    if (!hotspotButtons.length) return;

    hotspotButtons.forEach((button) => {
      if (button.dataset.lookbookBound) return;
      button.dataset.lookbookBound = 'true';

      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const card = button.nextElementSibling;
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        closeAllHotspots(button);

        button.setAttribute('aria-expanded', String(!isOpen));
        if (card) {
          card.hidden = isOpen;
          if (!isOpen) positionHotspotCard(card);
        }
      });
    });

    if (!window.__lookbookGlobalListenersBound) {
      window.__lookbookGlobalListenersBound = true;

      document.addEventListener('click', (event) => {
        if (!event.target.closest('.lookbook-premium__hotspot')) {
          closeAllHotspots();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          const openButton = document.querySelector('[data-lookbook-hotspot][aria-expanded="true"]');
          closeAllHotspots();
          if (openButton) openButton.focus();
        }
      });
    }
  }

  function initBeforeAfterSliders() {
    document.querySelectorAll('[data-before-after]').forEach((wrapper) => {
      if (wrapper.dataset.baBound) return;
      wrapper.dataset.baBound = 'true';

      const frame = wrapper.querySelector('.before-after-premium__frame');
      const input = wrapper.querySelector('[data-ba-input]');
      if (!frame || !input) return;

      function setPosition(percent) {
        const clamped = Math.min(100, Math.max(0, percent));
        wrapper.style.setProperty('--ba-position', clamped + '%');
        input.value = clamped;
      }

      function percentFromClientX(clientX) {
        const rect = frame.getBoundingClientRect();
        const ratio = (clientX - rect.left) / rect.width;
        return ratio * 100;
      }

      let dragging = false;

      frame.addEventListener('pointerdown', (event) => {
        dragging = true;
        frame.setPointerCapture(event.pointerId);
        setPosition(percentFromClientX(event.clientX));
      });

      frame.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        setPosition(percentFromClientX(event.clientX));
      });

      function stopDragging(event) {
        if (!dragging) return;
        dragging = false;
        if (frame.hasPointerCapture(event.pointerId)) {
          frame.releasePointerCapture(event.pointerId);
        }
      }

      frame.addEventListener('pointerup', stopDragging);
      frame.addEventListener('pointercancel', stopDragging);

      // Keyboard access via the visually-hidden native range input.
      input.addEventListener('input', () => {
        setPosition(Number(input.value));
      });
    });
  }

  function initFaqPremium() {
    document.querySelectorAll('[data-faq-premium]').forEach((wrapper) => {
      if (wrapper.dataset.faqBound) return;
      wrapper.dataset.faqBound = 'true';

      const section = wrapper.closest('.faq-premium');
      if (!section) return;

      const searchInput = wrapper.querySelector('[data-faq-search]');
      const categoryButtons = wrapper.querySelectorAll('[data-faq-category]');
      const expandAllButton = wrapper.querySelector('[data-faq-expand-all]');
      const collapseAllButton = wrapper.querySelector('[data-faq-collapse-all]');
      const items = section.querySelectorAll('[data-faq-item]');
      const noResults = section.querySelector('[data-faq-no-results]');

      let activeCategory = 'all';

      function applyFilters() {
        const query = (searchInput && searchInput.value || '').trim().toLowerCase();
        let visibleCount = 0;

        items.forEach((item) => {
          const matchesCategory = activeCategory === 'all' || item.dataset.faqCategory === activeCategory;
          const searchText = (item.dataset.faqSearchText || '').toLowerCase();
          const matchesSearch = query === '' || searchText.indexOf(query) !== -1;
          const visible = matchesCategory && matchesSearch;

          item.hidden = !visible;
          if (visible) visibleCount += 1;
        });

        if (noResults) noResults.hidden = visibleCount !== 0;
      }

      if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
      }

      categoryButtons.forEach((button) => {
        button.addEventListener('click', () => {
          activeCategory = button.dataset.faqCategory;
          categoryButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
          applyFilters();
        });
      });

      if (expandAllButton) {
        expandAllButton.addEventListener('click', () => {
          items.forEach((item) => {
            const details = item.querySelector('details');
            if (details) details.open = true;
          });
        });
      }

      if (collapseAllButton) {
        collapseAllButton.addEventListener('click', () => {
          items.forEach((item) => {
            const details = item.querySelector('details');
            if (details) details.open = false;
          });
        });
      }
    });
  }

  function initCountdownBanners() {
    document.querySelectorAll('[data-countdown-banner]').forEach((banner) => {
      if (banner.dataset.countdownBound) return;
      banner.dataset.countdownBound = 'true';

      const mode = banner.dataset.countdownMode;
      const expiryBehavior = banner.dataset.countdownExpiryBehavior;
      const redirectUrl = banner.dataset.countdownRedirectUrl;
      const storageKey = banner.dataset.countdownStorageKey;

      let endDate = null;

      if (mode === 'evergreen') {
        const hours = parseFloat(banner.dataset.countdownEvergreenHours) || 24;
        let startTime = null;
        try {
          startTime = window.localStorage.getItem(storageKey);
        } catch (error) {
          startTime = null;
        }
        if (!startTime) {
          startTime = Date.now();
          try {
            window.localStorage.setItem(storageKey, String(startTime));
          } catch (error) {
            // Storage unavailable (private browsing, etc). Timer will just
            // restart on every page view for this visitor - acceptable
            // degradation rather than a hard failure.
          }
        }
        endDate = new Date(Number(startTime) + hours * 60 * 60 * 1000);
      } else {
        const raw = (banner.dataset.countdownEnd || '').trim();
        if (raw) {
          // Normalize "YYYY-MM-DD HH:MM" to a format Safari also parses.
          endDate = new Date(raw.replace(' ', 'T'));
        }
      }

      if (!endDate || Number.isNaN(endDate.getTime())) return;

      const daysEl = banner.querySelector('[data-countdown-days]');
      const hoursEl = banner.querySelector('[data-countdown-hours]');
      const minutesEl = banner.querySelector('[data-countdown-minutes]');
      const secondsEl = banner.querySelector('[data-countdown-seconds]');
      const liveRegion = banner.querySelector('[data-countdown-live]');
      const expiryMessage = banner.querySelector('[data-countdown-expiry-message]');
      const timerEl = banner.querySelector('[data-countdown-timer]');

      let lastAnnouncedMinute = null;
      let intervalId = null;

      function pad(number) {
        return String(number).padStart(2, '0');
      }

      function handleExpiry() {
        if (intervalId) window.clearInterval(intervalId);
        if (timerEl) timerEl.hidden = true;

        if (expiryBehavior === 'hide') {
          banner.hidden = true;
        } else if (expiryBehavior === 'redirect' && redirectUrl) {
          window.location.href = redirectUrl;
        } else if (expiryMessage) {
          expiryMessage.hidden = false;
        }
      }

      function tick() {
        const remainingMs = endDate.getTime() - Date.now();

        if (remainingMs <= 0) {
          if (daysEl) daysEl.textContent = '00';
          if (hoursEl) hoursEl.textContent = '00';
          if (minutesEl) minutesEl.textContent = '00';
          if (secondsEl) secondsEl.textContent = '00';
          handleExpiry();
          return;
        }

        const totalSeconds = Math.floor(remainingMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(hours);
        if (minutesEl) minutesEl.textContent = pad(minutes);
        if (secondsEl) secondsEl.textContent = pad(seconds);

        // Update the screen-reader live region at most once per minute so
        // it doesn't announce every second.
        if (liveRegion && minutes !== lastAnnouncedMinute) {
          lastAnnouncedMinute = minutes;
          liveRegion.textContent = days + 'd ' + hours + 'h ' + minutes + 'm remaining';
        }
      }

      tick();
      intervalId = window.setInterval(tick, 1000);
    });
  }

  function initHorizontalGalleries() {
    document.querySelectorAll('.horizontal-gallery-premium').forEach((gallery) => {
      if (gallery.dataset.hgBound) return;
      gallery.dataset.hgBound = 'true';

      const track = gallery.querySelector('.horizontal-gallery-premium__track');
      const prevButton = gallery.querySelector('[data-horizontal-gallery-prev]');
      const nextButton = gallery.querySelector('[data-horizontal-gallery-next]');
      if (!track) return;

      function scrollByAmount(direction) {
        const item = track.querySelector('.horizontal-gallery-premium__item');
        const distance = item ? item.getBoundingClientRect().width + 32 : track.clientWidth * 0.8;
        track.scrollBy({ left: distance * direction, behavior: 'smooth' });
      }

      function updateButtonState() {
        if (prevButton) prevButton.disabled = track.scrollLeft <= 2;
        if (nextButton) {
          nextButton.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        }
      }

      if (prevButton) prevButton.addEventListener('click', () => scrollByAmount(-1));
      if (nextButton) nextButton.addEventListener('click', () => scrollByAmount(1));
      track.addEventListener('scroll', updateButtonState, { passive: true });
      updateButtonState();
    });
  }

  function init() {
    initWishlistToggles();
    initHeroVideos();
    initScrollIndicators();
    initLookbookHotspots();
    initBeforeAfterSliders();
    initFaqPremium();
    initCountdownBanners();
    initHorizontalGalleries();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run wishlist binding after Theme Editor section re-renders.
  document.addEventListener('shopify:section:load', init);
})();
