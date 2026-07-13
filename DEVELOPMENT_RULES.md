# OBSIDIAN Premium Shopify Theme
# DEVELOPMENT_RULES.md

## Purpose

This file defines the mandatory development rules for the OBSIDIAN Premium Shopify Theme.

Every engineering ticket must follow these rules.

---

# FIRST INSTRUCTION

Before starting ANY engineering ticket:

1. Read `DEVELOPMENT_RULES.md`.
2. Read `ROADMAP.md`.
3. Read ONLY the files listed in the current engineering ticket.
4. Read direct dependencies ONLY if absolutely necessary.
5. Do NOT scan the entire repository.
6. Do NOT inspect unrelated files.
7. Complete ONLY the requested engineering ticket.
8. Stop immediately after completing the requested work.

---

# PROJECT

Project Name

OBSIDIAN Premium Shopify Theme

Base Theme

Shopify Dawn

Goal

Build a commercial-quality Shopify Online Store 2.0 premium theme.

---

# DEVELOPMENT PRINCIPLES

Always extend Dawn.

Never rebuild Dawn.

Never replace existing Shopify functionality unless explicitly requested.

Prefer extending existing systems.

Maintain clean architecture.

Prioritize:

- Performance
- Accessibility
- Merchant Experience
- Reusability
- Maintainability
- Commercial Quality

---

# FILE SAFETY

NEVER

- Delete files
- Rename files
- Move files
- Replace entire systems

Always preserve backward compatibility.

---

# DEVELOPMENT SCOPE

Only inspect files listed in the engineering ticket.

Only inspect direct dependencies when required.

Do NOT inspect unrelated sections.

Examples:

Do NOT inspect

- Homepage
- Collection
- Cart
- Search
- Blog
- Customer
- Other milestones

unless explicitly required.

---

# DAWN POLICY

If Dawn already provides a feature:

Improve it.

Extend it.

Reuse it.

Never rebuild it.

Examples

- Gallery
- Product Form
- Variant Picker
- Inventory
- Recommendations
- Cart
- Search
- Filtering
- Pagination
- Media

---

# CODE QUALITY

Reuse existing

- Snippets
- JavaScript
- CSS
- Liquid

Avoid duplicate logic.

Avoid duplicated markup.

Keep implementations modular.

Write production-ready code.

No placeholder implementations.

No TODO comments.

---

# LIQUID

Use valid Shopify Liquid.

Never invent Liquid syntax.

Never invent filters.

Prefer reusable snippets.

Keep templates clean.

---

# JAVASCRIPT

Use ES6.

No jQuery.

Reuse Shopify events.

Reuse existing architecture.

Avoid duplicate AJAX requests.

Avoid duplicate event listeners.

Prefer event-driven architecture.

Use IntersectionObserver where appropriate.

---

# CSS

Keep CSS modular.

Reuse existing styles.

Avoid duplicate selectors.

Maintain responsive consistency.

---

# PERFORMANCE

Prevent CLS.

Use lazy loading.

Use responsive images.

Specify width and height.

Avoid duplicate assets.

Reuse existing Shopify functionality.

---

# ACCESSIBILITY

Support

- Keyboard navigation
- Semantic HTML
- Screen readers
- Focus management
- ARIA labels
- Reduced motion compatibility

---

# MERCHANT EXPERIENCE

Every new feature should be configurable through the Theme Editor when appropriate.

Use:

- Clear setting names
- Logical grouping
- Sensible defaults
- Good presets

---

# ANIMATION POLICY

Do NOT implement

- GSAP
- ScrollTrigger
- Lenis
- ScrollSmoother
- FLIP
- Premium motion effects

unless the ticket explicitly belongs to Milestone 8.

---

# ENGINEERING TICKETS

One engineering ticket = one feature.

Do not continue to another ticket automatically.

Do not perform unrelated improvements.

Stay within the ticket scope.

---

# REPORT FORMAT

After completing the ticket provide only:

- Summary
- Files Created
- Files Modified
- Merchant Settings Added
- Bugs Found & Fixed
- Verification Checklist

Always confirm:

"No existing files were deleted."

Keep reports concise.

---

# ROADMAP

Use `ROADMAP.md` as the single source of truth.

Always determine:

- Current milestone
- Current engineering ticket
- Completed tickets
- Next ticket

Never assume future work.

Never skip tickets.

---

# STOP CONDITION

After completing the requested engineering ticket:

STOP.

Wait for the next engineering ticket.

Never begin another feature automatically.