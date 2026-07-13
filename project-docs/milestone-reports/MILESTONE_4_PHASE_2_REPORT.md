# MILESTONE 4 - PHASE 2 REPORT
## Phase 1 Improvements + Premium Homepage Expansion

## 1. Summary

Part A reviewed all five Phase 1 sections and applied targeted, non-rebuild
improvements: a real DRY refactor (shared carousel/grid markup extracted
into a new snippet), onboarding empty states, icon-capable buttons,
improved card typography/hover states, and hero enhancements (background
pattern, decorative shapes, glass card, badge styles, responsive
typography). Part B added all six new homepage sections: Brand Story,
Premium Image With Text, Split Banner, Lookbook, Video Banner, and
Before/After Slider. No existing file was deleted, renamed, or rebuilt.
Per the stop condition, work stopped after these six sections plus the
Phase 1 review - Phase 3 was not started.

Three real bugs were found and fixed during self-review before delivery
(details in section 10) - flagging this openly rather than only listing
what went right.

---

## 2. Files Created

**New sections (Part B):**
- `sections/brand-story-premium.liquid`
- `sections/image-with-text-premium.liquid`
- `sections/split-banner-premium.liquid`
- `sections/lookbook-premium.liquid`
- `sections/video-banner-premium.liquid`
- `sections/before-after-premium.liquid`

**New snippet (Part A - DRY refactor):**
- `snippets/premium-grid.liquid`

**New CSS:**
- `assets/component-brand-story-premium.css`
- `assets/component-image-with-text-premium.css`
- `assets/component-split-banner-premium.css`
- `assets/component-lookbook-premium.css`
- `assets/component-video-banner-premium.css`
- `assets/component-before-after-premium.css`

No new JS files were created - all new interactivity was added to the
existing `assets/homepage.js`, per the brief.

## 3. Files Modified

- `sections/featured-collections-premium.liquid` - refactored to use the
  new `premium-grid` snippet; added an onboarding empty state.
- `sections/featured-products-premium.liquid` - same refactor; added an
  onboarding empty state; added a `new_badge_days` setting (it existed on
  Best Sellers/New Arrivals but was missing here - now consistent).
- `sections/best-sellers-premium.liquid` - same refactor; empty state now
  also covers "collection selected but has zero products", not just "no
  collection selected".
- `sections/new-arrivals-premium.liquid` - same refactor; added an
  onboarding empty state.
- `snippets/button.liquid` - added optional `icon` / `icon_position`
  parameters (Part A hero improvement: "optional icon inside buttons"),
  built as a generic, reusable addition rather than a hero-only special case.
- `snippets/product-card-premium.liquid` - fixed a real bug (see section 10).
- `snippets/collection-card-premium.liquid` - fixed the same class of bug,
  plus improved hover overlay gradient and responsive heading size.
- `sections/hero-banner-premium.liquid` - Part A improvements: background
  pattern, floating decorative shapes, glass card option, badge style
  variants, icon-in-button wiring for both CTAs.
- `assets/base.css` - added `.button--with-icon` / `.button__icon` rules
  next to the existing `.button` component styles.
- `assets/component-card-premium.css` - onboarding empty-state styling,
  badge shadow for legibility over images, product title line-clamp,
  collection card overlay/typography improvements.
- `assets/component-hero-banner-premium.css` - CSS for all new hero
  features listed above, plus `clamp()`-based responsive typography for
  the heading and subheading (previously fixed sizes).
- `assets/homepage.js` - extended with `initLookbookHotspots()` and
  `initBeforeAfterSliders()` (Part B functionality only, no animation).
- `locales/en.default.json` - new keys for onboarding empty states, the
  lookbook, and the before/after slider's accessible label.

**No other existing files were modified.**

## 4. Files Preserved

**No existing files were deleted.** No files were renamed. Every Phase 1
section listed above was *improved in place*, not rebuilt: the original
markup structure, class names, and settings all still exist - the changes
are additions (new optional settings, new conditional markup blocks, new
CSS rules) layered on top. A merchant with an existing Phase 1 homepage
configured will see everything continue to work exactly as before, with
new optional settings available if they want them.

---

## 5. Phase 1 Improvements (Part A)

### Cross-cutting: duplicated code reduction
All four Phase 1 grid/carousel sections
(`featured-collections-premium.liquid`, `featured-products-premium.liquid`,
`best-sellers-premium.liquid`, `new-arrivals-premium.liquid`) repeated the
same ~35-line `<slider-component>`/grid/counter markup block. This is now
a single shared snippet, `premium-grid.liquid`, that each section calls
with a `{% capture %}`'d list of `<li>` items. This was the most concrete,
measurable duplication in the Phase 1 codebase and reducing it was
explicitly called out in the Phase 2 brief.

### Hero Banner
- **Background pattern support**: optional tileable image with an opacity
  slider, layered above the image/video and below the overlay.
- **Optional floating decorative shapes**: three soft blurred circles,
  pure CSS (no JS/GSAP), toggleable.
- **Glass card option**: wraps the content in a translucent,
  backdrop-blurred panel - useful for busy background images where flat
  text would be hard to read.
- **Hero label (badge) styles**: pill (existing default), minimal
  (no background), and underlined-text variants.
- **Icon inside buttons**: both hero CTAs can now show an icon
  (arrow/cart/play) before or after the label, via the newly-generic
  `button.liquid` icon support.
- **Better responsive typography**: heading and subheading now scale
  fluidly with `clamp()` instead of jumping between fixed sizes at
  breakpoints.
- **Better spacing**: glass-card padding adjusts for mobile.

### Featured Collections
- **Better hover overlay**: two-stop gradient (was a single flat stop) for
  better text legibility at rest, and intensifies further on hover.
- **Better typography**: collection card heading now uses `clamp()` for
  fluid sizing instead of the theme's fixed `.h2` size.
- **Better empty states**: shows an onboarding message in the Theme Editor
  when no collection blocks have been added yet (previously rendered
  nothing, which looked broken while configuring).
- CTA placement and card spacing were reviewed and found already solid
  from Phase 1 - no change needed there.

### Featured Products
- **Better badges**: badges now have a subtle drop shadow so they stay
  legible over any image, light or dark.
- **Better card layout**: product title now clamps to 2 lines with
  consistent line-height, so cards with long vs. short titles stay
  visually aligned in a grid row.
- **Better placeholders**: added the `new_badge_days` setting that was
  present on the other three product sections but missing here, for
  consistency; added an onboarding empty state.
- Pricing hierarchy, color swatches, and hover state were reviewed and
  found already solid (swatches were real, not placeholder, from Phase 1) -
  no rebuild needed.

### Best Sellers
- **Better section layout integration**: now uses the same shared
  `premium-grid` snippet as the other three sections (was previously its
  own near-duplicate implementation).
- **Better empty state**: now also handles "collection selected but
  currently has zero products," not just "no collection selected."

### New Arrivals
- **Better badge presentation**: inherits the badge shadow improvement
  from the shared card CSS.
- **Better responsive layout**: same shared-snippet refactor as above;
  added an onboarding empty state for when the catalog/collection has no
  products yet.

**Explicitly not done:** no GSAP or other animation was introduced
anywhere in Part A, per the brief.

---

## 6. New Homepage Sections (Part B)

### 1. Brand Story (`brand-story-premium.liquid`)
Heading, rich text body, an image or Shopify-hosted video, a CTA button,
and up to 4 statistic blocks (each with an optional icon, a number, and a
label). Three layouts: image-left, image-right, and centered (media below
text). Background is controlled via the section's color scheme, consistent
with the rest of the theme's background pattern.

### 2. Premium Image With Text (`image-with-text-premium.liquid`)
Two layouts: **split** (image and text side by side, image position
left/right) and **overlay** (text panel floated on top of the image, with
its own independent color scheme from the section background). Decorative
options: an accent ring shape behind the image, and an optional border on
the image itself. Distinct from and does not touch the existing
`sections/image-with-text.liquid`.

### 3. Split Banner (`split-banner-premium.liquid`)
Two independent promotional panels via blocks (max 2, so the Theme Editor
naturally enforces "two areas" while still letting a merchant use just
one if they want). Each panel independently configures: image, video
(overrides image when set), overlay opacity, heading, subheading, CTA
button + link, and color scheme. The whole panel is clickable (an
`aria-hidden` full-panel link layered behind the visible button, so
keyboard/screen-reader users get one clear link, not two).

### 4. Lookbook (`lookbook-premium.liquid`)
An image with merchant-positioned hotspot blocks (max 10), each linked to
a product via x/y percentage position pickers in the Theme Editor. Clicking
a hotspot toggles a small popover product card (image, title, price, and
a quick-add link) built from the existing `product-card-premium` snippet.
Works identically via click or tap across desktop/tablet/mobile - the
popover clamps itself to stay inside the viewport on narrow screens
(handled in `homepage.js`). Only one hotspot's card is open at a time;
Escape and outside-click both close it.

### 5. Video Banner (`video-banner-premium.liquid`)
Supports four video sources with a clear priority order (Shopify-hosted >
pasted external MP4 URL > YouTube/Vimeo), autoplay/loop/mute toggles,
poster image, overlay with opacity control, and an optional CTA. YouTube
and Vimeo are embedded via iframe with playback params (including the
YouTube loop-via-playlist trick and Vimeo's `background=1` param) to
approximate the same autoplaying-background feel as the native `<video>`
paths. Distinct from `sections/video.liquid`, which is a deliberately
different click-to-play pattern used elsewhere in the theme.

### 6. Before / After Slider (`before-after-premium.liquid`)
Two images with a draggable handle. Drag and touch are both handled by a
single Pointer Events implementation (`pointerdown`/`pointermove`/
`pointerup` with pointer capture) rather than separate mouse and touch
handlers - this is the standard modern approach and avoids the classic
double-handling bugs of mixing `mousedown`/`touchstart`. Keyboard users get
a real (visually-hidden but focusable) `<input type="range">` wired to the
same position state, so the slider is fully operable without a pointer.
Before/after labels are configurable text.

**Common to all six:** heading/subheading/rich text where applicable,
buttons where applicable, a color scheme setting, top/bottom padding
controls (mobile-scaled via the same convention used throughout the
theme), a preset so each appears in "Add section," and blocks where the
content is naturally repeatable (Brand Story's statistics, Split Banner's
panels, Lookbook's hotspots).

---

## 7. Merchant Settings Added

**Hero (Part A additions):** `background_pattern`, `background_pattern_opacity`,
`show_decorative_shapes`, `glass_card`, `badge_style`, `button_1_icon`,
`button_2_icon`.

**Featured Products (Part A addition):** `new_badge_days` (parity with the
other three product sections).

**Brand Story:** layout, eyebrow, heading, body, image, video, button
(text/url/style), color scheme, padding; statistic blocks (icon, number,
label).

**Image With Text:** layout (split/overlay), image + position, heading
group (via `section-header`), decorative shape/border toggles, section and
content-panel color schemes (independent), padding.

**Split Banner:** height, full-bleed toggle, padding; per-panel block
settings (image, video, overlay opacity, heading, subheading, button,
color scheme).

**Lookbook:** heading group, image, image ratio, color scheme, padding;
per-hotspot block settings (product, x position, y position).

**Video Banner:** four video-source fields (Shopify video, external MP4
URL, YouTube/Vimeo URL, poster image), autoplay/loop/mute, height,
full-bleed, overlay opacity, heading group, button, color scheme, padding.

**Before/After Slider:** heading group, before/after images and labels,
image ratio, starting position, color scheme, padding.

---

## 8. Reusable Snippets

- **`premium-grid.liquid`** (new): the Part A DRY refactor described
  above - shared by all four Phase 1 grid sections.
- **`button.liquid`** (extended): now supports an optional icon, used by
  the hero and available to every section that already used it.
- **`section-header.liquid`, `badge.liquid`, `collection-card-premium.liquid`,
  `product-card-premium.liquid`** (all from Phase 1): reused as-is by the
  new sections wherever they fit (Lookbook's popover card reuses
  `product-card-premium` directly rather than building a second, smaller
  product card snippet).

No new Liquid duplication was introduced in Part B: the six new sections
share `section-header` and `button` for their common heading/CTA needs
rather than each reimplementing that markup.

---

## 9. Performance Improvements

- All new images use `srcset`/`sizes` with explicit `width`/`height`
  attributes (no CLS), matching the existing pattern from Phase 1.
- Lookbook and Video Banner iframes use `loading="lazy"`.
- Video Banner's `<video>` elements use `preload="none"`, matching the
  hero's approach from Phase 1.
- Before/After Slider's drag handling is done with native Pointer Events
  and direct style/CSS-custom-property updates (no layout thrashing, no
  intermediate re-renders) - dragging only ever touches
  `clip-path`/custom-property values, which are cheap, compositor-friendly
  operations.
- Lookbook's popover positioning check runs only on open (not on every
  scroll/resize), avoiding unnecessary work.
- No new animation loops (`requestAnimationFrame` polling, etc.) were
  introduced anywhere in Phase 2, consistent with "no animations yet."

## 10. Accessibility Improvements

- **Lookbook hotspots**: real `<button>` elements with descriptive
  `aria-label`s including the product name, `aria-expanded` state, closes
  on Escape (returning focus to the trigger button) and on outside click.
- **Before/After Slider**: a real, keyboard-operable `<input type="range">`
  drives the same state as the pointer-drag interaction - the slider is
  fully usable without a mouse or touchscreen. A focus-visible outline on
  the frame confirms keyboard focus.
- **Split Banner**: the full-panel click-area link is `aria-hidden` and
  `tabindex="-1"` so screen reader/keyboard users encounter exactly one
  link per panel (the visible button), not a confusing duplicate.
- **Video Banner**: iframes get a descriptive `title` attribute (falls
  back to "Video" if no heading is set).
- All new decorative elements (hero shapes/pattern, before/after labels,
  split-banner overlay, lookbook pulse animation) are `aria-hidden` or
  otherwise excluded from the accessibility tree where they carry no
  information.
- Consistent, valid heading hierarchy maintained: `section-header`'s
  `<h2>` for the four grid sections and Lookbook; Brand Story, Image With
  Text, Split Banner, and Video Banner headings render as `<h2>` as well
  (the hero remains the page's only `<h1>`, from Phase 1).

### Bugs found and fixed during this review
Being direct about what needed fixing before this was ready to ship:

1. **Invalid `ternary` filter.** `brand-story-premium.liquid` initially
   used `{{ condition | ternary: 'a', 'b' }}` - this filter does not exist
   in Shopify's Liquid dialect (it's a Jekyll/Ruby-Liquid-only filter) and
   would have thrown a Liquid syntax error. Replaced with a proper
   `{% if %}`/`assign` block. Searched the rest of the new and modified
   files for the same mistake - none found elsewhere.
2. **Broken image-clipping technique.** The first draft of the
   Before/After Slider clipped the "before" image by shrinking its
   container's `width` while trying to keep the inner `<img>` at a fixed
   pixel width via an undefined `--frame-width` custom property that
   nothing ever set - this would have rendered incorrectly (the before
   image would scale down instead of staying full-size and being
   progressively revealed). Replaced with `clip-path: inset(...)` on a
   full-size, identically-positioned image, which is the correct and
   standard technique and doesn't depend on knowing the container's pixel
   width.
3. **Missing settings parity.** `featured-products-premium.liquid` was
   missing the `new_badge_days` setting present on the other three
   product-grid sections, meaning its "New" badge silently used a
   hardcoded 30-day fallback with no way for a merchant to change it.
   Added for consistency.

---

## 11. Verification Checklist

- [x] No files deleted
- [x] No files renamed
- [x] No Phase 1 section rebuilt - all changes are additive/in-place
- [x] Every section's embedded `{% schema %}` JSON parses cleanly,
      re-validated across the entire theme (not just files touched this
      phase)
- [x] `locales/en.default.json` and `config/settings_schema.json` parse
      cleanly as JSON
- [x] Every file in `assets/*.js` passes `node --check`
- [x] Theme-wide search for the two bug patterns found during this review
      (`| ternary`, `default: X | t` chains) confirms both are fully fixed
      and don't recur anywhere else
- [x] All new placeholder image keys (`lifestyle-apparel-1/2`,
      `hero-apparel-2`) and CSS asset references cross-checked against
      what's actually on disk and what the original theme already uses
- [x] No jQuery; ES6 throughout `homepage.js`
- [x] Blocks have sensible `max_blocks` limits (Brand Story: 4, Split
      Banner: 2, Lookbook: 10)
- [x] Every new section has a preset and appears in "Add section"
- [ ] Theme Check - **not run**. No Ruby/Shopify CLI available in this
      sandbox. Recommend running `shopify theme check` before merging.
- [ ] Manual Theme Editor QA - **not performed** (no live store to preview
      against here). Particular things worth checking by hand: the
      Lookbook popover on a real narrow-viewport phone, the Before/After
      drag feel on an actual touchscreen, and the YouTube/Vimeo embed
      params against current platform behavior (embed APIs occasionally
      change parameter names).

## Confirmation

**No existing files were deleted.**

---

## 12. Overall Milestone 4 Completion & Remaining Work

**Overall Milestone 4 completion: ~55%.**

Phase 1 (5 sections) + Phase 2 (Phase 1 improvements + 6 more sections) are
done - 11 homepage sections total, plus the shared snippet/CSS/JS
foundation both phases build on. Based on the "premium homepage comparable
to Prestige/Motion/Impulse/Focal" scope implied across this milestone,
that foundation and roughly half the typical section catalog such a theme
would ship is in place.

**Estimated remaining work:**

- **Phase 3** (estimate): likely content/merchandising sections not yet
  covered - e.g. testimonials/reviews carousel, FAQ/accordion, Instagram/
  UGC gallery, size guide or comparison table, blog/press mentions,
  logo/"as seen in" bar, countdown/promo bar variants, newsletter/popup
  capture section. Also plausibly where cross-section polish happens
  (shared spacing/rhythm audit across all 11+ sections, dark-mode/color-
  scheme contrast pass). Rough estimate: comparable in size to Phase 2
  (6 sections + a review pass).
- **Phase 4** (estimate): given the pattern so far (Milestone 3 =
  header/footer, Milestone 4 = homepage), Phase 4 is likely final
  homepage polish and/or the handoff into whatever Milestone 5 covers
  (product/collection page templates, based on nothing being built for
  those yet). If Phase 4 stays homepage-scoped, expect it to be smaller
  than Phase 2 - finishing touches, cross-section QA, and the
  documentation/report consolidation for the full milestone.

These are estimates based on the pattern of this milestone so far, not
commitments - actual Phase 3/4 scope will depend on the next prompt.
