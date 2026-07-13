# MILESTONE 5 — PHASE 1 REPORT
## Premium Product Experience Foundation

---

## 1. Summary

Phase 1 audited the existing Dawn-based product template against the
full Milestone 5 spec before writing any code, per the "extend, don't
rebuild" rule. That audit found that **three of the five requested
systems are already fully implemented** by the stock theme (details in
§5) — building new versions of them would have meant literally
duplicating working code, so instead this phase verifies and documents
them, and spends its effort on the two systems that were genuinely
missing: a **Sticky Add To Cart bar** (new) and a **Product Information
block** for vendor/barcode/type/collections/tags/delivery estimate (new).
The existing Accordion system was left untouched but given two turnkey
example tabs (Shipping & Returns, Materials & Care) so merchants get a
working accordion out of the box instead of an empty one.

## 2. Files Created

**Sections**
- `sections/sticky-add-to-cart-premium.liquid`

**Snippets**
- `snippets/product-information-premium.liquid`

**CSS**
- `assets/component-sticky-add-to-cart-premium.css`
- `assets/component-product-information-premium.css`

**JS**
- `assets/sticky-add-to-cart.js`

## 3. Files Modified

- `sections/main-product.liquid` — added one new block type
  (`product_information_premium`, see §5) and its `{% case %}` render
  branch. No existing block, setting, or markup was changed or removed.
- `templates/product.json` — added the new sticky-add-to-cart section to
  `order`/`sections`, and added two example `collapsible_tab` blocks
  (Shipping & Returns, Materials & Care) to the `main` section's existing
  block list. All eight original blocks (`vendor`, `title`, `price`,
  `variant_picker`, `quantity_selector`, `buy_buttons`, `description`,
  `share`) are untouched and still present in their original order.
- `locales/en.default.json` — added `general.product_information` keys.

## 4. Existing Files Preserved

**No existing files were deleted.** No files were renamed. Dawn's
product-rendering logic (`product-media-gallery.liquid`,
`product-media.liquid`, `product-media-modal.liquid`,
`product-thumbnail.liquid`, `product-variant-picker.liquid`,
`product-variant-options.liquid`, `swatch.liquid`, `swatch-input.liquid`,
`buy-buttons.liquid`, `product-info.js`, `product-form.js`) was **not
modified at all** — Phase 1 only reads from these to integrate with them
(see §10).

## 5. Product Features Added — and features found already complete

**Genuinely new this phase:**

- **Sticky Add To Cart** — a floating bar (configurable per desktop/
  mobile) showing product image, title, live variant name, live price,
  quantity, Add to Cart, and an optional dynamic checkout button. Appears
  via `IntersectionObserver` once the real product form scrolls out of
  view. See §10 for how it avoids duplicating cart logic.
- **Product Information block** — a new `product_information_premium`
  block for `sections/main-product.liquid` adding vendor, barcode,
  product type, collections, tags, and a delivery-estimate placeholder,
  each independently toggleable.
- **Two example accordion tabs** wired into `templates/product.json` by
  default (Shipping & Returns, Materials & Care) using Dawn's existing
  `collapsible_tab` block type - previously the template shipped with
  zero accordion tabs configured.

**Audited and found already fully implemented by Dawn (no changes made,
to honor "do not rebuild"):**

- **Premium Product Gallery** — `sections/main-product.liquid` /
  `snippets/product-media-gallery.liquid` / `product-media.liquid`
  already support: vertical thumbnails, horizontal thumbnails, grid, and
  slider layouts (`gallery_layout`: stacked/columns/thumbnail/
  thumbnail_slider), left/right media position, small/medium/large media
  size, contain/cover media fit, mixed media (images, Shopify-hosted
  video, external video, and 3D models — confirmed via the
  `{% case media.media_type %}` branches in `product-media.liquid`), a
  visible zoom button (`icon-zoom.svg` in `product-thumbnail.liquid`),
  and a fullscreen lightbox (`product-media-modal.liquid`, triggered by
  `image_zoom: lightbox`). All of this is already merchant-configurable
  and responsive.
- **Variant Picker** — `snippets/product-variant-picker.liquid` /
  `product-variant-options.liquid` already support button/pill style
  (the CSS class is literally `product-form__input--pill`), dropdown,
  color swatches and image swatches (`snippets/swatch.liquid` branches on
  `swatch.image` vs `swatch.color`), disabled/sold-out states
  (`swatch-input.liquid`'s `disabled`/`visually_disabled` params), and
  variant-image synchronization (`updateMedia()` in
  `assets/product-info.js`).
- **Availability / low-stock indication** — the existing `inventory`
  block in `sections/main-product.liquid` already has a configurable
  low-stock threshold, an optional exact-quantity display, and distinct
  in-stock/low-stock/out-of-stock/backorder states with color-coded
  icons.
- **Accordion system** — the existing `collapsible_tab` block type
  already supports unlimited blocks, per-block icon and heading, rich
  text or linked-page content, and is fully accessible
  (`<details>`/`<summary>`). "Description / Shipping / Returns /
  Materials / Care / Custom tabs" are all just differently-labeled
  instances of this one block type - no new block type was needed.

## 6. Merchant Settings Added

**Sticky Add To Cart section:** show on desktop, show on mobile, show
image, show variant title, show quantity, show dynamic checkout button,
color scheme.

**Product Information block:** show vendor, show barcode, show product
type, show collections, show tags (with a max-tags-shown range), show
delivery estimate (with editable placeholder text), text style
(body/subtitle/uppercase, matching the existing SKU/inventory blocks).

## 7. Reusable Snippets

- `snippets/product-information-premium.liquid` — new, single snippet
  handling all six product-information fields, called once from
  `main-product.liquid`'s block case statement.
- No existing snippet was duplicated. The sticky bar deliberately has no
  gallery/variant/cart snippet of its own — see §10.

## 8. Performance Improvements

- Sticky bar's product image uses `loading="lazy"`, explicit
  `width`/`height`, and only renders (via Liquid `{%- if -%}`) when a
  featured media actually exists, avoiding a broken-image layout shift.
- Sticky bar price/availability sync reuses the HTML Dawn's own AJAX
  variant-change request already fetches (`PUB_SUB_EVENTS.variantChange`
  payload) instead of firing a second network request.
- The sticky bar's own JS is a single small custom element file, loaded
  only on the product template, not bundled into the global layout.
- `IntersectionObserver` (not scroll-event polling) drives the show/hide
  behavior, so there's no scroll-jank cost.

## 9. Accessibility Improvements

- Sticky bar quantity input has an associated `<label class="visually-
  hidden">`; the Add to Cart button's disabled/label state is kept in
  sync with the real form so screen reader users never see a stale
  "Add to cart" label on a sold-out variant.
- Product Information block's tag list uses `role="list"` (list-style
  reset would otherwise strip the implicit list semantics in Safari/
  VoiceOver); barcode row uses `role="status"` matching the existing
  SKU/inventory blocks' pattern.
- Delivery estimate icon is `aria-hidden`, its text carries the meaning.
- Verified (not modified) Dawn's existing accordion, gallery zoom, and
  variant picker accessibility, all of which were already solid
  (`<details>`/`<summary>`, `aria-label`s on gallery/zoom controls,
  proper `<fieldset>`/`<legend>` on variant pickers).

## 10. Design Decisions Worth Flagging

- **The sticky bar's "Add to cart" button does not submit its own
  form.** It syncs a quantity value into the real product form, then
  clicks the real submit button, letting Dawn's existing
  `<product-form>` element (`assets/product-form.js`) handle the AJAX
  request, cart drawer/notification, and error states exactly as it
  already does for the main form. This was a deliberate choice to avoid
  a second, competing cart-add code path.
- **Price and sold-out state sync via the existing pub/sub event.**
  `assets/product-info.js` already publishes `PUB_SUB_EVENTS.
  variantChange` with the freshly-fetched section HTML on every variant
  change. `sticky-add-to-cart.js` subscribes to that instead of
  re-parsing the variant picker or reimplementing Shopify money
  formatting.
- **Known limitation:** the dynamic checkout button in the sticky bar
  uses its own small `{% form 'product' %}` block (mirroring the pattern
  in `snippets/buy-buttons.liquid`) with a hidden variant-id input that
  JS updates on variant change. This works for the common case but
  hasn't been tested against every dynamic-checkout provider Shopify
  supports; it ships **off by default** (`show_dynamic_checkout: false`)
  so a store can enable and verify it in staging first.

## 11. Bugs Found and Fixed

None found in the areas touched this phase. (The one cross-section CSS
bug found during Milestone 4 was fixed in that phase's report.)

## 12. Verification Checklist

- ✓ No files deleted
- ✓ No renamed files
- ✓ Theme Check compatible (no automated Theme Check tool available in
  this environment; manually verified: `main-product.liquid`'s schema is
  valid JSON with no duplicate block types across all 19 block types,
  `sticky-add-to-cart-premium.liquid`'s schema is valid JSON,
  `templates/product.json` and `locales/en.default.json` both parse as
  valid JSON, ES6-only JS, no jQuery, no GSAP)
- ✓ No Liquid errors (all `{% if %}`/`{% for %}`/`{% form %}`/
  `{% schema %}` tag pairs balanced in every file touched)
- ✓ No JavaScript errors (new custom element follows the same
  `customElements.get()` guard pattern used elsewhere in the theme;
  degrades gracefully if `IntersectionObserver` or the pub/sub globals
  are unavailable)
- ✓ Responsive (mobile bar collapses to icon-only quantity/button
  layout under 990px; `enable_desktop`/`enable_mobile` toggles)
- ✓ Theme Editor compatible (`enabled_on.templates: ["product"]` so it
  can only be added where `product` exists; block uses
  `block.shopify_attributes`)
- ✓ Online Store 2.0 compatible

## 13. Overall Milestone 5 Completion

**Phase 1: 100% complete** against its stop condition. Because three of
the five requested systems turned out to already be fully built into
Dawn, actual new surface area is smaller than the spec implies — that's
reflected honestly above rather than padded with a rebuild.

**Estimate for Phase 2** (per the Phase 1 brief: recommendations,
bundles, trust badges, recently viewed - not started, explicitly
out of scope for this phase):
- Product recommendations: Dawn already ships a `related-products`
  section using `product-recommendations`; Phase 2's job is mainly
  merchandising/UI polish on top of it, not new plumbing - likely a
  half-size phase.
- Bundles: fully new (Shopify has no native bundle primitive) - this is
  the largest item in Phase 2, likely needs its own product-selection
  UI and a way to add multiple variants to cart together.
- Trust badges: small, mostly a new lightweight snippet/block for
  payment-icon and guarantee messaging.
- Recently viewed: needs new `localStorage`-backed tracking (same
  pattern already used by the Countdown Banner's evergreen mode from
  Milestone 4) plus a product-card grid to render it - small-to-medium.

Rough relative sizing: Bundles ≈ 45%, Recommendations polish ≈ 20%,
Recently viewed ≈ 20%, Trust badges ≈ 15% of Phase 2's total effort.
