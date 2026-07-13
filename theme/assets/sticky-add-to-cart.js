/**
 * Sticky Add To Cart - Milestone 5, Phase 1.
 *
 * Functionality only - no animation (Milestone 8 scope). Deliberately
 * thin: delegates the actual "add to cart" request to Dawn's existing
 * <product-form> element instead of re-implementing the AJAX call, and
 * reuses the theme's existing PUB_SUB_EVENTS.variantChange event
 * (published by assets/product-info.js) to stay in sync with variant
 * selection rather than re-parsing the variant picker itself.
 */
(() => {
  class StickyAddToCartPremium extends HTMLElement {
    connectedCallback() {
      this.mainForm = document.querySelector('product-form form[id^="product-form-"]');
      this.mainSubmitButton = document.querySelector('[id^="ProductSubmitButton-"]');
      this.mainQuantityInput = document.querySelector('input[id^="Quantity-"][name="quantity"]');
      this.mainFormWrapper =
        document.querySelector('.product-form') || this.mainSubmitButton?.closest('div');

      this.priceEl = this.querySelector('[data-sticky-atc-price]');
      this.variantTitleEl = this.querySelector('[data-sticky-atc-variant-title]');
      this.imageEl = this.querySelector('[data-sticky-atc-image]');
      this.quantityInput = this.querySelector('[data-sticky-atc-quantity]');
      this.submitButton = this.querySelector('[data-sticky-atc-submit]');
      this.submitButtonText = this.querySelector('[data-sticky-atc-submit-text]');
      this.dynamicCheckoutVariantInput = this.querySelector('[data-sticky-atc-variant-input]');

      this.bindEvents();
      this.observeVisibility();
    }

    bindEvents() {
      if (this.submitButton) {
        this.submitButton.addEventListener('click', this.handleSubmitClick.bind(this));
      }

      if (this.quantityInput && this.mainQuantityInput) {
        this.quantityInput.addEventListener('change', () => {
          this.mainQuantityInput.value = this.quantityInput.value;
          this.mainQuantityInput.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }

      // Sync loading state from the main form's submit button
      if (this.mainSubmitButton && this.submitButton) {
        this.observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
              const isLoading = this.mainSubmitButton.classList.contains('loading');
              this.submitButton.classList.toggle('loading', isLoading);
            }
          });
        });
        this.observer.observe(this.mainSubmitButton, { attributes: true, attributeFilter: ['class'] });
      }

      // Reuse the theme's existing variant-change pub/sub event rather than
      // re-parsing the variant picker or re-implementing price formatting.
      if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        subscribe(PUB_SUB_EVENTS.variantChange, (event) => this.handleVariantChange(event));
      }
    }

    handleVariantChange(event) {
      const { html, variant } = event.data || {};
      if (!variant) return;

      const sourcePrice = html?.getElementById?.(`price-${event.data.sectionId}`);
      if (sourcePrice && this.priceEl) {
        this.priceEl.innerHTML = sourcePrice.innerHTML;
      }

      if (this.variantTitleEl) {
        this.variantTitleEl.textContent = variant.title || '';
      }

      if (this.imageEl && variant.featured_image && variant.featured_image.src) {
        // variant.featured_image.src from the cart/product JSON is already a
        // full CDN URL; Shopify accepts a width param appended the same way
        // the theme's image_url filter would produce it.
        this.imageEl.src = variant.featured_image.src;
      }

      if (this.dynamicCheckoutVariantInput) {
        this.dynamicCheckoutVariantInput.value = variant.id;
        this.dynamicCheckoutVariantInput.disabled = !variant.available;
      }

      const sourceSubmit = html?.getElementById?.(`ProductSubmitButton-${event.data.sectionId}`);
      const disabled = sourceSubmit ? sourceSubmit.hasAttribute('disabled') : !variant.available;
      this.setSubmitState(disabled);
    }

    setSubmitState(disabled) {
      if (!this.submitButton) return;
      this.submitButton.disabled = disabled;
      if (this.submitButtonText && window.variantStrings) {
        this.submitButtonText.textContent = disabled
          ? window.variantStrings.soldOut
          : window.variantStrings.addToCart;
      }
    }

    handleSubmitClick() {
      if (!this.mainForm || !this.mainSubmitButton) return;

      if (this.quantityInput && this.mainQuantityInput) {
        this.mainQuantityInput.value = this.quantityInput.value;
      }

      // Delegate to the real product form's submit button rather than
      // calling mainForm.requestSubmit() directly, since <product-form>
      // (assets/product-form.js) binds its AJAX-add handler to the
      // form's submit event either way - clicking the real button is the
      // most compatible way to trigger that existing logic unchanged.
      this.mainSubmitButton.click();
    }

    observeVisibility() {
      const target = this.mainFormWrapper;
      if (!target || !('IntersectionObserver' in window)) {
        this.classList.add('sticky-add-to-cart-premium--visible');
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.classList.toggle('sticky-add-to-cart-premium--visible', !entry.isIntersecting);
          });
        },
        { rootMargin: '0px 0px -10% 0px' }
      );

      observer.observe(target);
    }
  }

  if (!customElements.get('sticky-add-to-cart-premium')) {
    customElements.define('sticky-add-to-cart-premium', StickyAddToCartPremium);
  }
})();
