# OBSIDIAN Premium Shopify Theme
# M5-T8-001 – Image Hotspots Architecture Audit

Version: v0.5

Status: ✅ COMPLETE

Milestone: M5 – Premium Product Experience

Ticket: M5-T8-001

---

# Objective

Perform a comprehensive architectural audit of Shopify Dawn's product media system to determine the optimal implementation strategy for interactive product image hotspots.

The objective of this audit was to identify existing reusable components within OBSIDIAN and Shopify Dawn that could support product hotspots while avoiding duplicate architectures and preserving long-term maintainability.

No implementation work was performed during this ticket.

---

# Scope

The audit focused exclusively on the architecture required for interactive product image hotspots.

Areas inspected included:

- Product media rendering
- Product gallery architecture
- Existing Premium Lookbook implementation
- Hotspot rendering
- Responsive positioning
- Accessibility
- Theme architecture
- Component reuse

No implementation changes were made.

---

# Existing Shopify Dawn Architecture

Shopify Dawn provides a flexible product media architecture but does not include native hotspot functionality.

The audit therefore evaluated OBSIDIAN's existing systems to identify reusable components.

---

## Product Media

Product images are rendered through:

- `snippets/product-media.liquid`

Responsibilities include:

- Image rendering
- Video rendering
- External video rendering
- 3D model rendering

This snippet represents the optimal insertion point for product-specific hotspot rendering.

---

## Product Media Gallery

The gallery structure is managed by:

- `snippets/product-media-gallery.liquid`

Responsibilities include:

- Gallery layout
- Media navigation
- Thumbnail synchronization
- Responsive behavior

This component provides the ideal container for hotspot overlays.

---

## Premium Lookbook

Milestone 4 introduced a Premium Lookbook component featuring:

- Interactive hotspots
- Responsive positioning
- Popovers
- Accessible controls
- Merchant-friendly editing

This subsystem already satisfies most functional requirements for product hotspots.

---

# Audit Findings

Several important architectural findings were identified.

---

## Existing Hotspot Engine

OBSIDIAN already contains a mature hotspot implementation within the Premium Lookbook subsystem.

The existing implementation provides:

- Hotspot rendering
- Percentage positioning
- Responsive scaling
- Keyboard accessibility
- Popover interactions

Creating a second hotspot system would unnecessarily duplicate logic.

---

## Reusable CSS

The existing stylesheet:

- `assets/component-lookbook-premium.css`

already contains:

- Hotspot positioning
- Responsive behavior
- Visual styling
- Interaction states

Most of this styling can be reused directly.

---

## Product Gallery Compatibility

The gallery architecture allows overlays to be injected without modifying MediaGallery.

Hotspots can exist as an additional presentation layer above product images.

No changes to gallery logic are required.

---

## Responsive Positioning

Percentage-based coordinates naturally adapt to responsive image scaling.

No JavaScript calculations or resize listeners are necessary.

---

# Architectural Decisions

The following engineering decisions were established.

---

## Reuse Existing Hotspot Engine

The existing Premium Lookbook hotspot architecture will become the foundation for Product Hotspots.

A second hotspot implementation will not be created.

---

## Shared Components

Future hotspot implementations should share:

- Markup
- CSS
- Accessibility
- Interaction patterns

This minimizes maintenance and keeps user experience consistent.

---

## Metafield-Driven Data

Hotspot positions should be derived from product metafields rather than hardcoded coordinates.

Benefits include:

- Merchant configurability
- Scalability
- Cleaner templates
- Easier maintenance

---

## CSS-First Strategy

Presentation should be handled primarily through CSS.

JavaScript should only be introduced if interaction requirements cannot be met otherwise.

---

# Recommended Implementation Strategy

The subsystem should be implemented incrementally.

---

## Phase 1

Inject hotspot rendering into:

- `product-media.liquid`
- `product-media-gallery.liquid`

using existing hotspot markup patterns.

---

## Phase 2

Introduce reusable hotspot popovers.

Extract shared markup into:

- `snippets/hotspot-popover.liquid`

to eliminate duplication between Lookbook and Product Media.

---

## Phase 3

Quality Assurance

Verify:

- Desktop
- Tablet
- Mobile
- Keyboard navigation
- Accessibility
- Theme Check
- Performance

---

# Files Requiring Modification

Expected implementation files:

- `snippets/product-media.liquid`
- `snippets/product-media-gallery.liquid`
- `sections/lookbook-premium.liquid` (reuse only)
- `assets/component-lookbook-premium.css`

Potential reusable component:

- `snippets/hotspot-popover.liquid`

---

# Files Remaining Untouched

The following systems should remain unchanged:

- MediaGallery
- ProductModal
- DeferredMedia
- Gallery synchronization
- ProductForm
- Variant logic

---

# Risks

Potential implementation risks identified during the audit.

---

## Duplicate Architectures

Creating separate hotspot systems for Lookbook and Product Media would significantly increase maintenance cost.

A single reusable hotspot engine is preferred.

---

## Responsive Accuracy

Hotspot positioning must remain accurate across varying image sizes and aspect ratios.

Percentage-based coordinates provide the most robust solution.

---

## Accessibility

Hotspots must continue supporting:

- Keyboard navigation
- Focus management
- Screen reader compatibility

---

## Performance

Rendering hotspot overlays must not interfere with gallery performance or media loading.

---

# Design Principle Compliance

The proposed implementation fully aligns with OBSIDIAN's engineering principles.

✓ Extend Shopify Dawn

✓ Reuse existing Lookbook architecture

✓ CSS before JavaScript

✓ Accessibility first

✓ Performance first

✓ Maintainability first

✓ Merchant-first implementation

✓ Online Store 2.0 compatible

✓ Theme Check compatible

---

# Expected Outcome

After implementation, OBSIDIAN will provide a unified Premium Hotspot Engine capable of powering:

- Lookbook hotspots
- Product image hotspots
- Future landing pages
- Featured product sections
- Additional marketing experiences

through a single reusable architecture.

---

# Conclusion

The audit concludes that OBSIDIAN's existing Premium Lookbook subsystem provides a robust foundation for interactive product hotspots.

Rather than introducing a new hotspot implementation, the existing architecture should be extended and generalized into a reusable Premium Hotspot Engine.

This approach minimizes code duplication, preserves maintainability, and ensures a consistent user experience across the theme.

No implementation was performed during this audit.

No existing files were modified.

---

# Audit Status

Status: ✅ COMPLETE

Approved for implementation.

Next Engineering Ticket:

**M5-T8-002 – Interactive Product Hotspots**