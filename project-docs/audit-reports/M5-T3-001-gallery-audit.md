# M5-T3-001 – Product Gallery Layout Audit

## Files Inspected

| File | Role |
|------|------|
| `snippets/product-media-gallery.liquid` | Gallery wrapper, viewer slider, thumbnail slider |
| `snippets/product-thumbnail.liquid` | Individual media item renderer |
| `sections/main-product.liquid` | Section schema (settings definition, class application) |
| `assets/section-main-product.css` | All gallery layout CSS |
| `assets/media-gallery.js` | `<media-gallery>` custom element logic |
| `locales/en.default.schema.json` | Label strings for setting options |

---

## Existing Gallery Capabilities

### Layout values surfaced via `section.settings.gallery_layout`

The setting is a `<select>` with **4 options**. The selected value is stamped directly onto the product wrapper as a CSS class (`product--<value>`), and passed to `product-media-gallery.liquid` as `data-desktop-layout`.

| Value | CSS class applied | Label | What it renders |
|-------|-------------------|-------|-----------------|
| `stacked` | `.product--stacked` | Stacked | All media stacked vertically, full-width. First image is full-width; all others are half-width at ≥990 px. Thumbnail strip is **hidden**. |
| `columns` | `.product--columns` | 2 columns | All media displayed in a 2-column masonry-style grid. No thumbnail strip. |
| `thumbnail` | `.product--thumbnail` | Thumbnails | Only the active media item is shown; horizontal thumbnail grid (4-up at ≥750 px, 5-up at medium, 6-up at large) below the main image. |
| `thumbnail_slider` | `.product--thumbnail_slider` | Thumbnail carousel | Same as `thumbnail` but the strip becomes a scrollable carousel with prev/next arrows at ≥750 px. |

### Mobile layout (`mobile_thumbnails` setting)

A separate setting controls mobile independently: `columns` (2-col grid), `show` (thumbnail strip), or `hide` (single slider).

### JavaScript (`media-gallery.js`)

The `<media-gallery>` custom element handles:
- Thumbnail click → scroll viewer to correct slide
- Slide change → sync active thumbnail highlight
- `removeListSemantic()` when thumbnail layout is active on desktop

It uses `this.dataset.desktopLayout.includes('thumbnail')` to branch behaviour, so any new layout value that does **not** contain `"thumbnail"` is automatically treated as a scroll-based layout — no JS changes would be needed for non-thumbnail new layouts.

---

## What Already EXISTS ✅

| Requested layout | Present? | Implementation |
|-----------------|----------|----------------|
| Horizontal thumbnails | ✅ **Yes** | `thumbnail_slider` — horizontal scrollable strip below the main image |
| Vertical thumbnails | ❌ **No** | No side-rail thumbnail column exists |
| Grid layout | ✅ **Yes** | `columns` — 2-column media grid |
| Compact layout | ❌ **No** | No compact / condensed single-image-with-dots variant exists |
| Large layout | ✅ **Partial** | `stacked` + `media_size: large` gives a large stacked view, but there is no dedicated `large` gallery *layout* value — "large" is a separate width modifier (`product--large`) not a gallery layout mode |

---

## What is MISSING ❌

### 1. Vertical Thumbnail Layout
**Gap:** Dawn only has a horizontal thumbnail rail beneath the main image. There is no side-column (left or right) thumbnail strip — a common pattern in premium themes (Turbo, Prestige, Symmetry).

**What it needs:**
- A new `gallery_layout` option value, e.g. `thumbnail_left` / `thumbnail_right`
- CSS: switch `<media-gallery>` from `flex-column` to `flex-row`; constrain the thumbnail column to a fixed width (e.g. 80–100 px); make it overflow-y scrollable
- The thumbnail `<slider-component>` currently uses a horizontal flexbox slider. For vertical, the `flex-direction: column` and `overflow-y: auto` pattern replaces it
- No JS changes required — `media-gallery.js` already routes click and slide-changed events agnostically

### 2. Compact Layout
**Gap:** No layout exists that shows a single prominent hero image with a small dot-indicator or minimal navigation strip — common for single-product or fashion contexts.

**What it needs:**
- A new `gallery_layout` option value, e.g. `compact`
- CSS: constrains the main image container height; shows only dots (CSS-only counter) instead of a full thumbnail rail
- Could reuse the mobile slider dots pattern already present in `slider-buttons`

---

## Files That Will Need Modification

| File | Change needed |
|------|--------------|
| `sections/main-product.liquid` | Add new `gallery_layout` option values to the schema `select` |
| `snippets/product-media-gallery.liquid` | Extend thumbnail-slider conditional to also render the vertical rail; add compact dot indicator conditionally |
| `assets/section-main-product.css` | Add CSS rules for `.product--thumbnail_left`, `.product--thumbnail_right`, `.product--compact` |
| `locales/en.default.schema.json` | Add label strings for new options |
| `assets/media-gallery.js` | **No changes needed** — existing branch logic handles any non-thumbnail layout automatically; vertical thumbnail layout still contains `"thumbnail"` in its value name |

> `featured-product.liquid` is a separate section that also uses `product-media-gallery` but it has its own schema. If the layouts are added to `main-product.liquid` only, `featured-product.liquid` is unaffected and unchanged. If parity is desired, its schema would also need updating (separate ticket scope decision).

---

## Recommended Architecture

### Principle
Extend the existing `gallery_layout` select. Never replace Dawn's slider or thumbnail infrastructure — build on top of it using CSS layout switches and minimal Liquid conditionals.

### Plan for Vertical Thumbnails

**1. New setting values** (in `main-product.liquid` schema)
```json
{ "value": "thumbnail_left",  "label": "..." },
{ "value": "thumbnail_right", "label": "..." }
```

**2. Liquid** (`product-media-gallery.liquid`)
The existing thumbnail-slider render condition:
```liquid
{%- if section.settings.gallery_layout contains 'thumbnail' -%}
```
already matches any value containing `"thumbnail"`, including `thumbnail_left` and `thumbnail_right`. No Liquid change is needed for the thumbnail strip to render. Only a CSS class on the `<media-gallery>` wrapper drives the visual arrangement.

**3. CSS** (`section-main-product.css`)
```css
/* Vertical thumbnail – left rail */
@media screen and (min-width: 750px) {
  .product--thumbnail_left media-gallery,
  .product--thumbnail_right media-gallery {
    display: flex;
    gap: 1rem;
  }
  .product--thumbnail_left #GalleryThumbnails-{{ id }} { order: -1; }
  .product--thumbnail_right #GalleryThumbnails-{{ id }} { order: 2; }

  .product--thumbnail_left .thumbnail-slider,
  .product--thumbnail_right .thumbnail-slider {
    flex-direction: column;
    width: 8rem;
    flex-shrink: 0;
  }

  .product--thumbnail_left .thumbnail-list,
  .product--thumbnail_right .thumbnail-list {
    display: flex;
    flex-direction: column;
    grid-template-columns: unset;
    overflow-y: auto;
    max-height: 60rem;
    gap: 0.8rem;
  }
}
```
(IDs in CSS are replaced with class selectors in the real implementation — the above illustrates the approach.)

### Plan for Compact Layout

**1. New setting value**
```json
{ "value": "compact", "label": "Compact" }
```

**2. Liquid** (`product-media-gallery.liquid`)
When `gallery_layout == 'compact'`, suppress the full thumbnail strip and instead render only the mobile-style `slider-buttons` counter on desktop.

**3. CSS** (`section-main-product.css`)
```css
@media screen and (min-width: 750px) {
  .product--compact .product__media-item:not(.is-active) { display: none; }
  .product--compact .slider-buttons { display: flex; } /* override the desktop hide */
  .product--compact .thumbnail-slider { display: none; }
}
```

---

## Summary

| Layout | Status |
|--------|--------|
| Stacked | ✅ Exists |
| 2-Column Grid | ✅ Exists |
| Horizontal Thumbnails (static grid) | ✅ Exists (`thumbnail`) |
| Horizontal Thumbnail Carousel | ✅ Exists (`thumbnail_slider`) |
| Vertical Thumbnails (left/right rail) | ❌ Missing — needs 2 new values + CSS |
| Compact (single image + dots) | ❌ Missing — needs 1 new value + Liquid + CSS |

**No existing files need to be deleted or renamed.**  
Implementation is purely additive: new schema values, new CSS classes, minimal Liquid conditionals.
