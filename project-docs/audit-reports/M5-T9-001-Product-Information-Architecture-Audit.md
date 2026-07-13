# OBSIDIAN Premium Shopify Theme
# M5-T9-001 – Technical Product Information Architecture Audit

Version: v0.5

Status: ✅ COMPLETE

Milestone: M5 – Premium Product Experience

Ticket: M5-T9-001

---

# Objective

Perform a comprehensive architectural audit of Shopify Dawn's native product information handling. The goal is to identify how Shopify Dawn currently processes product details and determine the best architecture for implementing a reusable Premium Product Information Engine within OBSIDIAN.

No implementation work was performed during this ticket.

---

# Scope

The audit focused exclusively on Shopify Dawn's existing architecture for product information rendering.

Areas inspected included:
- `sections/main-product.liquid`
- Collapsible content blocks (`collapsible_tab`)
- Product description blocks
- Custom liquid blocks
- Native HTML details/summary implementations
- Existing Theme Editor schema

No files were modified.

---

# Existing Shopify Dawn Architecture

Shopify Dawn handles product information through a block-based architecture within the `main-product.liquid` section.

---

## Product Description
Rendered as a standard block (`type: 'description'`). It simply outputs the `product.description` HTML field directly from Shopify's backend.

## Specifications and Additional Information
Dawn has no dedicated block type for specifications. Instead, merchants must rely on:
- **Collapsible Tabs** (`type: 'collapsible_tab'`): Uses native HTML `<details>` and `<summary>` elements to create accordions. It supports static rich text (`content` setting) or pulling content from a Page (`page` setting).
- **Custom Liquid** (`type: 'custom_liquid'`): Allows merchants to manually write Liquid code to loop through metafields or render custom HTML structures.

## Tabs
Dawn does not support horizontal tabs natively. All nested/collapsible content is forced into the vertical accordion pattern via `collapsible_tab`.

## Merchant Customization & Dynamic Sources
Merchants can use the Theme Editor to reorder product info blocks. `collapsible_tab` text fields and custom liquid blocks support Shopify's "Dynamic Sources," enabling merchants to bind product metafields to accordion content. However, rendering structured specification tables or grouped technical details requires manual HTML/Liquid coding by the merchant.

## Existing Accessibility Patterns
By utilizing the native HTML `<details>` and `<summary>` elements, the `collapsible_tab` block benefits from native browser accessibility. This provides built-in keyboard navigation, focus management, and screen reader announcements without relying on JavaScript ARIA polyfills.

## Existing Responsive Behavior
The product information column automatically shifts from a single-column stacked layout on mobile to a side-by-side 2-column layout on desktop. The `<details>` accordions naturally flow within this container width.

---

# Recommended Implementation Strategy

To create a reusable Premium Product Information Engine while adhering to the rule of extending Dawn rather than replacing it, the following architectural strategy is recommended:

## 1. Create a Reusable Snippet
Move the product information rendering logic into a centralized snippet (e.g., `snippets/product-information-engine.liquid`). This allows the logic to be shared across `main-product`, `featured-product`, and future `quick-view` architectures.

## 2. Enhance the Collapsible Tab
Create a premium equivalent of the `collapsible_tab` (or extend the existing one) to support structured metafield data (e.g., metaobjects for specifications) alongside standard text and page content.

## 3. Introduce Premium Blocks
Introduce new blocks specifically tailored for structured data:
- `product_specifications` (to render specification tables from metafields)
- `product_downloads` (to render file links from metafields)
- `product_materials`

## 4. CSS-First Styling
Enhance the visual presentation of accordions and tables using additive CSS, preserving the native `<details>` and `<summary>` elements for accessibility and performance.

---

# Files Requiring Modification

Expected implementation files for future tickets:
- `sections/main-product.liquid` (to register new blocks and call the engine)
- `sections/featured-product.liquid` (to integrate the engine)
- `snippets/product-information-engine.liquid` (New snippet to be created)
- `assets/component-product-information-premium.css` (New CSS file for premium styling)

# Files Remaining Untouched

The following systems should remain unchanged:
- Existing JavaScript architecture (`product-info.js`)
- Product variant and media logic

---

# Risks & Considerations

## Dynamic Source Limitations
Merchants are limited to 20 dynamic sources per template. A block-heavy specification architecture could easily hit this limit. A Metaobject-based approach (where a single dynamic source passes a Metaobject reference containing all specs) is the safest long-term strategy for complex products.

## Accessibility
Any premium styling applied to the `<details>`/`<summary>` elements must preserve focus indicators and keyboard operability.

## Reusability
The engine must not rely on `section.id` specific DOM structures, as it will be used in Quick View modals where multiple product instances may exist on the same page.

---

# Recommended Implementation Order

1. **M5-T9-002**: Product Information Engine Structure (Extracting and creating the centralized snippet).
2. **M5-T9-003**: Premium Accordions & Tabs (CSS and layout enhancements).
3. **M5-T9-004**: Specification Tables (Metaobject/Metafield integration).
4. **M5-T9-005**: QA.

---

# Conclusion

The audit concludes that Shopify Dawn's block-based architecture and native `<details>` element provide a solid foundation. OBSIDIAN will extend this by introducing a centralized Product Information Engine snippet and dedicated blocks for structured data (Metafields/Metaobjects), avoiding the need for heavy custom JavaScript or duplicate markup.

No implementation was performed during this audit.
No existing files were modified.
