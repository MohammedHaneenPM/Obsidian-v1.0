/**
 * Milestone 5, Phase 2 - Premium Product Merchandising & Conversion.
 *
 * Functionality only - no animations (GSAP/ScrollTrigger/Lenis/FLIP are
 * explicitly out of scope for this milestone, per the brief).
 *
 * Reuses existing Dawn infrastructure rather than duplicating it:
 * - `fetchConfig`, `PUB_SUB_EVENTS`, `subscribe`/`publish` from global.js/
 *   pubsub.js/constants.js (already loaded globally by layout/theme.liquid)
 * - `routes.cart_add_url` (already exposed on `window.routes`)
 * - The existing `cart-notification`/`cart-drawer` custom elements' own
 *   `getSectionsToRender()`/`setActiveElement()` so adding items from these
 *   new widgets updates the cart UI exactly the same way Dawn's native
 *   product-form does - no separate cart-rendering logic was written here.
 */

(function () {
  'use strict';

  // --- Shared: add one or more line items to the cart in a single request,
  // reusing the same cart-notification/cart-drawer update flow Dawn's
  // product-form.js already uses. ---------------------------------------
  function addItemsToCart(items, triggerElement) {
    if (!items.length) return Promise.resolve();

    const cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    const config = fetchConfig('json');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    const body = { items };

    if (cart) {
      body.sections = cart.getSectionsToRender().map((section) => section.id);
      body.sections_url = window.location.pathname;
      cart.setActiveElement(triggerElement || document.activeElement);
    }

    config.body = JSON.stringify(body);

    return fetch(`${window.routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          publish(PUB_SUB_EVENTS.cartError, {
            source: 'product-merchandising',
            errors: response.errors || response.description,
            message: response.message,
          });
          return Promise.reject(response);
        }

        if (cart) {
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-merchandising',
            cartData: response,
          });
        } else {
          window.location = window.routes.cart_url;
        }

        return response;
      });
  }

  function setButtonLoading(button, isLoading) {
    if (!button) return;
    button.toggleAttribute('aria-disabled', isLoading);
    button.classList.toggle('loading', isLoading);
    const spinner = button.querySelector('.loading__spinner');
    if (spinner) spinner.classList.toggle('hidden', !isLoading);
  }

  // --- Money formatting -----------------------------------------------
  // Dawn's own JS never formats money client-side (prices are always
  // rendered server-side via Liquid's `money` filter and re-fetched via
  // the Section Rendering API). The running totals in this file are a
  // genuine exception - they need to update instantly as checkboxes are
  // toggled, without a network round-trip. This reimplements Shopify's
  // well-documented public money-format interpolation (the same
  // {{amount}} / {{amount_no_decimals}} tokens `Shopify.formatMoney` uses)
  // rather than assuming a "$" prefix, so it respects the shop's actual
  // currency format. The format string itself comes from `shop.money_format`,
  // passed in via a data attribute from Liquid - never hardcoded here.
  function formatWithDelimiters(number, precision, thousands, decimal) {
    if (isNaN(number) || number == null) return '0';

    const cents = Math.round(number).toString();
    const parts = precision > 0 ? cents.slice(0, -precision) + decimal + cents.slice(-precision) : cents;

    return parts.replace(/(\d)(?=(\d{3})+(?:\D|$))/g, `$1${thousands}`);
  }

  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || '${{amount}}';

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2, ',', '.');
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      default:
        value = formatWithDelimiters(cents, 2, ',', '.');
    }

    return formatString.replace(placeholderRegex, value);
  }

  window.ProductMerchandising = window.ProductMerchandising || {};
  window.ProductMerchandising.addItemsToCart = addItemsToCart;
  window.ProductMerchandising.setButtonLoading = setButtonLoading;
  window.ProductMerchandising.formatMoney = formatMoney;

  // --- Frequently Bought Together / Product Bundles (shared class) ------
  // Both features are a list of selectable items with a running total and
  // a single "add selected items to cart" action - the class below is
  // intentionally generic (data-bundle-* attributes) so it can back both
  // <frequently-bought-together-premium> and <product-bundle-premium>
  // without duplicating this logic.
  class FrequentlyBoughtTogetherPremium extends HTMLElement {
    connectedCallback() {
      this.moneyFormat = this.dataset.moneyFormat || '${{amount}}';
      this.discountPercent = parseFloat(this.dataset.discountPercent) || 0;
      this.totalEl = this.querySelector('[data-bundle-total]');
      this.addAllButton = this.querySelector('[data-bundle-add-all]');
      this.statusEl = this.querySelector('[data-bundle-status]');

      this.addEventListener('change', (event) => {
        if (event.target.matches('[data-bundle-item-checkbox]')) this.updateTotal();
      });

      if (this.addAllButton) {
        this.addAllButton.addEventListener('click', this.onAddAll.bind(this));
      }

      // Recommendations load asynchronously into the DOM via
      // <product-recommendations> (assets/global.js); recompute once that
      // happens so the total includes them.
      const recommendationsEl = this.querySelector('[data-bundle-recommendations]');
      if (recommendationsEl) {
        const observer = new MutationObserver(() => this.updateTotal());
        observer.observe(recommendationsEl, { childList: true });
      }

      this.updateTotal();
    }

    getCheckedItems() {
      return Array.from(this.querySelectorAll('[data-bundle-item]')).filter((item) => {
        const checkbox = item.querySelector('[data-bundle-item-checkbox]');
        return checkbox && checkbox.checked;
      });
    }

    updateTotal() {
      const items = this.getCheckedItems();
      let totalCents = items.reduce((sum, item) => sum + (parseInt(item.dataset.price, 10) || 0), 0);

      if (this.discountPercent > 0) {
        totalCents = Math.round(totalCents * (1 - this.discountPercent / 100));
      }

      if (this.totalEl) this.totalEl.textContent = formatMoney(totalCents, this.moneyFormat);
    }

    onAddAll() {
      const items = this.getCheckedItems();

      if (!items.length) {
        if (this.statusEl) {
          this.statusEl.textContent = this.getAttribute('data-select-at-least-one-text') || 'Select at least one product';
          this.statusEl.classList.remove('visually-hidden');
        }
        return;
      }

      const payload = items.map((item) => ({
        id: parseInt(item.dataset.variantId, 10),
        quantity: 1,
      }));

      setButtonLoading(this.addAllButton, true);

      addItemsToCart(payload, this.addAllButton)
        .then(() => {
          setButtonLoading(this.addAllButton, false);
          if (this.statusEl) {
            this.statusEl.textContent = this.getAttribute('data-added-text') || 'Added to your cart';
          }
        })
        .catch(() => {
          setButtonLoading(this.addAllButton, false);
        });
    }
  }

  if (!customElements.get('frequently-bought-together-premium')) {
    customElements.define('frequently-bought-together-premium', FrequentlyBoughtTogetherPremium);
  }

  // Product Bundles use the exact same selection/running-total/add-to-cart
  // behavior as Frequently Bought Together, so it reuses the same class
  // under a second, semantically distinct tag name rather than
  // duplicating this logic.
  if (!customElements.get('product-bundle-premium')) {
    customElements.define('product-bundle-premium', FrequentlyBoughtTogetherPremium);
  }

  // Upsell's optional "bundle style" display reuses the same class too.
  if (!customElements.get('upsell-premium')) {
    customElements.define('upsell-premium', FrequentlyBoughtTogetherPremium);
  }

  // --- Recently Viewed Products ------------------------------------------
  const RECENTLY_VIEWED_KEY = 'theme:recently-viewed';
  const RECENTLY_VIEWED_MAX = 24;

  function getRecentlyViewed() {
    try {
      const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function trackRecentlyViewed() {
    const dataEl = document.querySelector('[data-recently-viewed-product]');
    if (!dataEl) return;

    let product;
    try {
      product = JSON.parse(dataEl.textContent);
    } catch (error) {
      return;
    }
    if (!product || !product.id) return;

    try {
      let list = getRecentlyViewed().filter((item) => item.id !== product.id);
      list.unshift(product);
      list = list.slice(0, RECENTLY_VIEWED_MAX);
      window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
    } catch (error) {
      // localStorage unavailable (e.g. private browsing); tracking is
      // best-effort only, fail silently.
    }
  }

  class RecentlyViewedPremium extends HTMLElement {
    connectedCallback() {
      this.limit = parseInt(this.dataset.limit, 10) || 8;
      this.excludeId = parseInt(this.dataset.excludeProductId, 10) || null;
      this.listContainer = this.querySelector('[data-recently-viewed-list]');
      this.emptyState = this.querySelector('[data-recently-viewed-empty]');
      this.clearButton = this.querySelector('[data-recently-viewed-clear]');

      if (this.clearButton) {
        this.clearButton.addEventListener('click', () => {
          try {
            window.localStorage.removeItem(RECENTLY_VIEWED_KEY);
          } catch (error) {
            // ignore
          }
          this.render();
        });
      }

      this.render();
    }

    render() {
      const items = getRecentlyViewed()
        .filter((item) => item.id !== this.excludeId)
        .slice(0, this.limit);

      if (!this.listContainer) return;
      this.listContainer.innerHTML = '';

      const sliderComponent = this.querySelector('slider-component');
      const sliderButtons = this.querySelector('[data-recently-viewed-slider-buttons]');

      if (!items.length) {
        this.hidden = this.dataset.hideWhenEmpty === 'true';
        if (this.emptyState) this.emptyState.hidden = false;
        if (this.clearButton) this.clearButton.hidden = true;
        if (sliderButtons) sliderButtons.hidden = true;
        return;
      }

      this.hidden = false;
      if (this.emptyState) this.emptyState.hidden = true;
      if (this.clearButton) this.clearButton.hidden = false;
      // Slider button visibility and the slide counter are left to
      // <slider-component>'s own ResizeObserver (assets/global.js), which
      // recalculates pagination automatically when .slider's content size
      // changes - duplicating that logic here would risk it drifting out
      // of sync with Dawn's own pagination math.
      if (sliderButtons) sliderButtons.hidden = false;

      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = sliderComponent
          ? 'recently-viewed-premium__item grid__item slider__slide'
          : 'recently-viewed-premium__item grid__item';
        if (sliderComponent) li.id = `Slide-${this.id || 'recently-viewed'}-${index + 1}`;

        const link = document.createElement('a');
        link.href = item.url || '#';
        link.className = 'recently-viewed-premium__card';

        const mediaWrap = document.createElement('span');
        mediaWrap.className = 'recently-viewed-premium__media';
        if (item.image) {
          const img = document.createElement('img');
          img.src = item.image;
          img.loading = 'lazy';
          img.alt = ''; // decorative - the title link below already names the product
          mediaWrap.appendChild(img);
        }

        const title = document.createElement('span');
        title.className = 'recently-viewed-premium__title';
        title.textContent = item.title || '';

        const price = document.createElement('span');
        price.className = 'recently-viewed-premium__price';
        price.textContent = item.priceFormatted || '';

        link.appendChild(mediaWrap);
        link.appendChild(title);
        link.appendChild(price);
        li.appendChild(link);
        this.listContainer.appendChild(li);
      });
    }
  }

  if (!customElements.get('recently-viewed-premium')) {
    customElements.define('recently-viewed-premium', RecentlyViewedPremium);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackRecentlyViewed);
  } else {
    trackRecentlyViewed();
  }

  // --- Inventory Urgency Bar: live update on variant change --------------
  // Reuses the existing PUB_SUB_EVENTS.variantChange event (published by
  // product-info.js on every variant swap) rather than modifying that
  // file's own hardcoded list of elements it updates directly.
  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
      const variant = event?.data?.variant;
      const sectionId = event?.data?.sectionId;
      if (!variant || !sectionId) return;

      document.querySelectorAll(`[data-inventory-urgency][data-section-id="${sectionId}"]`).forEach((bar) => {
        const threshold = parseInt(bar.dataset.threshold, 10) || 0;
        const fullStock = parseInt(bar.dataset.fullStock, 10) || 1;
        const hideExact = bar.dataset.hideExactQuantity === 'true';
        const tracksInventory = variant.inventory_management != null;
        const quantity = typeof variant.inventory_quantity === 'number' ? variant.inventory_quantity : 0;
        const showBar = tracksInventory && quantity > 0 && quantity <= threshold;

        bar.hidden = !showBar;
        if (!showBar) return;

        const fill = bar.querySelector('[data-inventory-urgency-fill]');
        const label = bar.querySelector('[data-inventory-urgency-label]');
        const fillPercent = Math.min(100, Math.round((quantity * 100) / fullStock));

        if (fill) fill.style.width = `${fillPercent}%`;
        if (label) {
          label.textContent = hideExact
            ? bar.dataset.genericText || label.textContent
            : (bar.dataset.lowStockTemplate || '').replace('__COUNT__', quantity);
        }
      });
    });
  }
})();
