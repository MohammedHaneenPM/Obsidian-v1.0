# MILESTONE 4 - PHASE 1 REPORT
## Premium Homepage Foundation

## Summary

All five homepage sections specified for this phase are complete: Premium
Hero Banner, Featured Collections, Featured Products, Best Sellers, and
New Arrivals. Every section is new (no existing section was modified or
rebuilt), fully merchant-configurable from the Theme Editor, industry
agnostic, and built on reusable shared snippets. Per the stop condition,
work stopped after these five sections - no later homepage sections were
started.

**Phase 1 completion: 100%** of the specified scope.

---

## Files Created

**Sections:**
- `sections/hero-banner-premium.liquid`
- `sections/featured-collections-premium.liquid`
- `sections/featured-products-premium.liquid`
- `sections/best-sellers-premium.liquid`
- `sections/new-arrivals-premium.liquid`

**Snippets:**
- `snippets/section-header.liquid`
- `snippets/button.liquid`
- `snippets/badge.liquid`
- `snippets/collection-card-premium.liquid`
- `snippets/product-card-premium.liquid`

**CSS:**
- `assets/component-hero-banner-premium.css`
- `assets/component-card-premium.css` (product/collection cards + section-header)

**JavaScript:**
- `assets/homepage.js` (functionality only - no animations, per spec)

## Files Modified

- `locales/en.default.json` - added new translation keys used by the new
  sections/snippets (badges, wishlist, quick add, collection card, hero
  scroll indicator, best-sellers empty state). No existing keys were
  changed.

**No other existing files were modified.** Integration was not required
beyond adding these new locale keys.

## Files Preserved

**No existing files were deleted.** No files were renamed. No existing
section, snippet, or architecture was rebuilt or altered. Specifically:
`sections/image-banner.liquid`, `sections/slideshow.liquid`,
`sections/featured-collection.liquid` (singular), `sections/collection-list.liquid`,
`snippets/card-product.liquid`, and `snippets/card-collection.liquid` are
all untouched and continue to work exactly as before - the new premium
sections/snippets are deliberately named and built to avoid any overlap
with them.

---

## Sections Completed

### 1. Premium Hero Banner (`hero-banner-premium.liquid`)
- Desktop image, mobile image, desktop video, mobile video (with graceful
  fallback: video overrides the image when set; mobile falls back to
  desktop if not provided separately)
- Overlay: none / solid / gradient (top or bottom), with an opacity slider
- Badge (small pill above the heading)
- Two independently configurable CTA buttons (label, link, style)
- Scroll indicator (optional, scrolls to the next section on click)
- Two layouts: full-bleed (media behind content) and split (media beside
  content)
- Full-height option plus small/medium/large presets
- 9-point content position grid (desktop) + independent text alignment
  (desktop and mobile)
- `homepage.js` handles responsive video swapping (only the visible
  breakpoint's video downloads/plays) and the scroll indicator's click
  behavior
- **Design note:** hero content uses direct section settings (heading,
  subheading, two buttons) rather than a block-based system like
  `image-banner.liquid` uses, since the brief listed a fixed set of hero
  features rather than open-ended content blocks. This keeps the hero
  simpler to configure. Flagging this as a deliberate deviation from
  Dawn's block-based banner convention.

### 2. Featured Collections (`featured-collections-premium.liquid`)
- Grid or carousel (carousel reuses the theme's existing
  `<slider-component>` from `assets/global.js` - no new carousel JS was
  written)
- Merchant selects collections via blocks (up to 12)
- Collection image, description (optional), product count (optional),
  hover state (image zoom), CTA button per card
- Responsive column controls (desktop 2-5, mobile 1-2)

### 3. Featured Products (`featured-products-premium.liquid`)
- Manual product selection (blocks) or pull from a collection
- Sale badge, New badge (auto-computed from `created_at` vs. a
  merchant-configurable day cutoff), vendor, hover image swap, rating
  placeholder, quick-add placeholder, wishlist placeholder, real color
  swatches (see "Design notes" below)
- Grid or carousel, responsive columns

### 4. Best Sellers (`best-sellers-premium.liquid`)
- Merchant selects one collection
- Grid or carousel, configurable column counts
- **Important caveat, surfaced directly in the Theme Editor via a
  paragraph setting:** Liquid cannot force an arbitrary sort order on a
  collection independently of how that collection is configured in
  Shopify Admin. This section renders `collection.products` as-is, so for
  it to actually show best sellers, the merchant must set that
  collection's sort order to "Best selling" in Shopify Admin. This is the
  standard approach for this feature in Shopify themes; pretending to sort
  by sales without that data would silently show the wrong order.

### 5. New Arrivals (`new-arrivals-premium.liquid`)
- Fully automatic: pulls the newest products (sorted by `created_at`,
  descending) from the whole catalog by default, or from an optional
  merchant-selected collection
- Configurable "New" badge cutoff (days) shared with Featured Products'
  and Best Sellers' badge logic
- Grid or carousel, responsive columns

---

## Reusable Snippets

- **`section-header.liquid`**: eyebrow, heading, rich-text description,
  and an optional CTA, with left/center alignment. Used by all four
  grid/carousel sections (hero has its own layout).
- **`button.liquid`**: thin wrapper around the theme's existing `.button`
  / `.button--secondary` / `.button--small` / `.button--full-width` CSS
  classes (defined in `assets/base.css`) - no new button CSS was written.
- **`badge.liquid`**: thin wrapper around the theme's existing `.badge`
  CSS class and color-scheme settings, reused for sale/sold-out/new
  labels.
- **`collection-card-premium.liquid`**: full-bleed image collection tile
  with overlay title, product count, description, and CTA.
- **`product-card-premium.liquid`**: product card with badges, hover image
  swap, vendor, rating placeholder, quick-add placeholder, wishlist
  placeholder, and real color swatches.

**Design note on the two new card snippets:** these are intentionally new
and lighter-weight rather than extensions of the existing
`card-product.liquid` (627 lines, deeply tied to quick-order/bulk-modal
flows used on collection/search pages) and `card-collection.liquid`. Both
existing snippets are used unmodified across the rest of the site.
Building on top of them for a visually distinct premium homepage card
would have meant fighting their existing markup/CSS; a new, smaller
snippet was the lower-risk path. Both new cards reuse the theme's
existing `price`, `swatch`, and (new) `badge`/`button` snippets rather
than reimplementing pricing or swatch logic.

**Design note on Quick Add / Wishlist / Rating:** per the brief, these are
explicitly placeholders in this phase:
- *Quick add* links to the product page rather than adding to cart (cart
  interactions are out of scope until a later milestone, consistent with
  how cart drawer animations were deferred to Milestone 7 in Milestone 3).
- *Wishlist* toggles a visual pressed/unpressed state via `homepage.js`
  (`aria-pressed`, icon fill) with no persistence - ready for a future
  wishlist app or metafield integration to hook into.
- *Rating* renders five outline stars as a static visual placeholder
  (`data-rating-placeholder` attribute left in the markup) for a future
  reviews app to replace.
- *Color swatches* are the one exception: these are real, not a
  placeholder - they reuse the existing `swatch.liquid` snippet against
  the product's actual "Color"/"Colour" option, since the underlying data
  and rendering snippet already existed and a fake placeholder would have
  been strictly worse than the real thing.

---

## Merchant Settings

Every section exposes, at minimum: heading, subheading/description,
button(s), heading alignment, layout (grid/carousel where applicable),
responsive column counts, image ratio, card content toggles, color scheme,
and top/bottom padding (scaled down on mobile via the same 0.75x/breakpoint
pattern already used by `header.liquid`, `footer.liquid`, and
`video.liquid`).

**On "desktop / tablet / mobile settings":** rather than adding three
separate full setting tiers per section, this phase follows the theme's
existing convention (seen in `featured-collection.liquid`,
`multicolumn.liquid`, `collection-list.liquid`): a `columns_desktop` and
`columns_mobile` setting, with tablet handled by the theme's existing
`grid--N-col-tablet-down` CSS breakpoint step (also pre-existing, reused
as-is). Padding similarly scales automatically at the 750px breakpoint.
This was a deliberate choice to match the theme's established responsive
system rather than introduce a third, redundant tier of settings not used
anywhere else in the theme. Flagging this in case fully independent
tablet-specific settings are still wanted.

Hero-specific settings: layout, height, content position (9-point),
text alignment (desktop + mobile), background image/video (desktop +
mobile), image loading priority, overlay style/opacity, badge text +
color scheme, heading/subheading, two buttons, scroll indicator toggle.

Best Sellers and New Arrivals both expose a "New badge cutoff (days)"
setting, and Best Sellers exposes the sort-order caveat as an in-editor
paragraph (see above).

---

## Performance Improvements

- All images use `srcset`/`sizes` with multiple widths, matching the
  density/breakpoint pattern already used by `card-product.liquid` and
  `card-collection.liquid`.
- Hero images support `fetchpriority="high"` via a "Prioritize image
  loading" toggle (on by default, intended for when the hero is the first
  thing on the page) and otherwise `loading="lazy"`.
- Hero background videos use `preload="none"` and only the
  currently-visible breakpoint's video is loaded/played - `homepage.js`
  actively strips the `<source>` `src` of the inactive video so the
  browser never downloads both.
- Carousels reuse the theme's existing `<slider-component>`
  (`ResizeObserver`-based, no scroll-jank) instead of new JS.
- All product/collection card images use explicit `width`/`height`
  attributes to prevent layout shift (no CLS).
- No JavaScript animation loops were introduced (per spec, "no animations
  yet" - only `requestAnimationFrame`-free, purely functional JS).

## Accessibility Improvements

- Hero: scroll indicator is a real `<button>` with an `aria-label`;
  respects `prefers-reduced-motion` (its bounce animation is gated behind
  `@media (prefers-reduced-motion: no-preference)`).
- Product card: wishlist toggle uses `aria-pressed` and swaps its
  `aria-label` between "Add"/"Remove" states; quick-add link has a
  descriptive `aria-label` including the product title; rating placeholder
  is `aria-hidden` (decorative until real ratings exist, so it can't
  confuse screen readers with fake data).
- Collection/product cards render `role="link" aria-disabled="true"` in
  their onboarding/placeholder state (no `card_product`/`card_collection`
  set yet), matching the pattern already used by `card-product.liquid`.
- All new interactive elements are real, keyboard-reachable
  `<button>`/`<a>` elements - nothing is a `<div>` with a click handler.
- Carousel keyboard/focus behavior comes from the theme's existing,
  already-accessible `<slider-component>`.
- Semantic heading levels: hero uses `<h1>` (it's expected to be the page's
  main heading), the other four sections use `<h2>` via `section-header.liquid`,
  and cards use `<h3>` - a consistent, valid heading hierarchy.

---

## Verification Checklist

- [x] No files deleted
- [x] No files renamed
- [x] No existing section, snippet, or architecture modified beyond the
      documented locale-file addition
- [x] Every section's embedded `{% schema %}` JSON parses cleanly
      (validated across the entire theme, not just the new files)
- [x] `config/settings_schema.json` and `locales/en.default.json` parse
      cleanly as JSON
- [x] `assets/homepage.js` (and every other JS asset in the theme) passes
      `node --check`
- [x] Two real Liquid logic bugs were found during self-review and fixed
      before delivery: (1) a `| default: X | t` filter-chain bug that
      would have run real, merchant-entered titles/button text through
      the translation filter instead of only the placeholder fallback
      text (present in both new card snippets); (2) an order-of-operations
      bug in the "New" badge date math (`(now - days) * 86400` instead of
      `now - (days * 86400)`). Both are fixed and re-verified.
- [x] All referenced image/icon assets (`icon-caret.svg`, `icon-heart.svg`,
      `icon-star.svg`, `hero-apparel-1`, `collection-apparel-1`,
      `product-apparel-2` placeholder keys) confirmed to exist / match
      Shopify's real placeholder key set, cross-checked against how
      existing sections use them
- [x] Online Store 2.0 compatible - fully block/setting driven, presets
      included so every new section appears in "Add section"
- [x] No jQuery; ES6 throughout `homepage.js`
- [x] Responsive: grid column counts for desktop/mobile, tablet inherited
      via the theme's existing breakpoint classes (see design note above)
- [ ] Theme Check - **not run**. No Ruby/Shopify CLI available in this
      sandbox. Recommend running `shopify theme check` before merging.
- [ ] Manual Theme Editor QA - **not performed** (no live store to preview
      against here). Recommend: add each new section with default
      settings, toggle grid↔carousel on all four applicable sections,
      and test the hero with an actual video upload.

## Confirmation

**No existing files were deleted.**
