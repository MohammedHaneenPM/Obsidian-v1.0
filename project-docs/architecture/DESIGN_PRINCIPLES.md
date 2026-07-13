# OBSIDIAN Premium Shopify Theme
# DESIGN_PRINCIPLES.md

Version: v1.0

Status: ACTIVE

---

# Purpose

This document defines the engineering philosophy behind OBSIDIAN.

It explains *how architectural decisions are made*, ensuring every contributor,
AI agent, and future version of OBSIDIAN follows the same standards.

This document complements:

- ROADMAP.md
- DEVELOPMENT_RULES.md

ROADMAP defines **what** to build.

DEVELOPMENT_RULES defines **how** to build.

DESIGN_PRINCIPLES defines **why** we build it this way.

---

# Core Philosophy

OBSIDIAN is a premium Shopify Online Store 2.0 theme built by extending Shopify Dawn rather than replacing it.

Every feature should:

- feel premium
- remain maintainable
- preserve compatibility
- maximize performance
- improve merchant experience

Commercial quality always takes priority over unnecessary complexity.

---

# Principle 1
## Extend Before Replacing

If Shopify already provides a feature,
extend it.

Never rebuild existing Dawn functionality unless there is a proven technical limitation.

Prefer extending:

- Sections
- Snippets
- Custom Elements
- JavaScript Modules
- Theme Settings
- CSS Components

The fewer custom systems introduced, the easier future maintenance becomes.

---

# Principle 2
## Reuse Native Shopify Components

Always reuse existing Shopify architecture whenever possible.

Examples include:

- MediaGallery
- DeferredMedia
- ModalDialog
- SliderComponent
- ProductForm
- Variant Picker
- Product Modal
- Predictive Search
- Drawer Components

Native systems are preferred over custom implementations.

---

# Principle 3
## CSS Before JavaScript

Prefer solving problems with CSS.

JavaScript should only be introduced when state management or user interaction genuinely requires it.

Avoid JavaScript used solely for visual effects.

Preferred order:

CSS

↓

Native HTML

↓

Liquid

↓

JavaScript

---

# Principle 4
## Small, Focused Engineering Tickets

Each engineering ticket should solve one problem only.

Examples:

✓ Structure

✓ Styling

✓ Synchronization

✓ QA

Avoid combining multiple concerns into one implementation.

Smaller tickets improve:

- maintainability
- code review
- debugging
- AI context efficiency

---

# Principle 5
## Progressive Enhancement

Every feature should be developed in stages.

Architecture

↓

Structure

↓

Styling

↓

Behavior

↓

Quality Assurance

Never build all layers simultaneously.

---

# Principle 6
## Accessibility Is Mandatory

Every feature must preserve accessibility.

Maintain:

- keyboard navigation
- focus management
- screen reader compatibility
- semantic HTML
- sufficient contrast
- logical tab order

Accessibility is never optional.

---

# Principle 7
## Performance First

Performance is a feature.

Avoid:

- unnecessary JavaScript
- duplicate DOM structures
- layout shifts
- excessive event listeners
- forced reflows

Prefer:

- native browser APIs
- CSS solutions
- reusable components
- efficient rendering

---

# Principle 8
## Merchant Experience First

Every feature should improve the merchant experience.

Merchants should be able to:

- understand settings
- configure features easily
- avoid editing code

Whenever appropriate:

Prefer Theme Settings over hardcoded values.

---

# Principle 9
## Commercial Quality

Every feature should be production ready.

Before a feature is considered complete:

- Theme Check passes
- responsive behavior verified
- accessibility preserved
- performance maintained
- merchant experience verified
- code reviewed
- QA completed

No experimental code should remain.

---

# Principle 10
## Maintainability Over Cleverness

Readable code is preferred over clever code.

Prefer:

- clear naming
- modular files
- reusable snippets
- small functions
- predictable behavior

Future maintenance is more important than short-term convenience.

---

# Principle 11
## Frozen Subsystems

Completed subsystems become frozen.

Frozen subsystems may only receive:

- critical bug fixes
- accessibility improvements
- performance improvements
- compatibility fixes

No new features may be added to frozen subsystems.

---

# Principle 12
## Single Source of Truth

Project documentation has clearly defined responsibilities.

ROADMAP.md

Defines:

- milestones
- tickets
- development order

DEVELOPMENT_RULES.md

Defines:

- engineering workflow
- coding rules
- implementation constraints

DESIGN_PRINCIPLES.md

Defines:

- engineering philosophy
- architectural decisions
- long-term standards

Do not duplicate responsibilities across documents.

---

# Principle 13
## Minimal Change Principle

Modify only what is required.

Avoid touching unrelated systems.

A feature should have the smallest possible implementation footprint.

Smaller changes reduce:

- regressions
- merge conflicts
- maintenance cost

---

# Principle 14
## Additive Development

Prefer additive implementations.

Do not:

- remove existing Dawn functionality
- rename stable components
- rewrite working systems

Extend existing functionality whenever possible.

---

# Principle 15
## Motion With Purpose

Animations should improve usability.

Motion should:

- communicate state
- guide attention
- reinforce interactions

Motion should never exist solely for decoration.

All advanced motion systems belong to Milestone 8.

Before Milestone 8:

Do NOT introduce:

- GSAP
- ScrollTrigger
- Lenis
- ScrollSmoother
- FLIP
- Image Sequences

---

# Principle 16
## AI-Assisted Engineering

AI is treated as an engineering assistant.

AI should:

- extend existing architecture
- avoid unnecessary rewrites
- preserve compatibility
- work ticket-by-ticket

Repository-wide modifications are discouraged unless explicitly requested.

---

# Principle 17
## Documentation Is Part of the Product

Documentation is considered production code.

Every completed subsystem should have:

- clear roadmap status
- engineering history
- architectural consistency

Well-maintained documentation improves future development and onboarding.

---

# OBSIDIAN Engineering Values

Every implementation should satisfy these goals:

✓ Extend Dawn

✓ Keep code modular

✓ Preserve compatibility

✓ Prefer CSS over JavaScript

✓ Accessibility first

✓ Performance first

✓ Merchant friendly

✓ Production ready

✓ Maintainable

✓ Commercial quality

---

# End of Document

This document should evolve only when the long-term engineering philosophy of OBSIDIAN changes.

Feature-specific decisions belong in ROADMAP.md or DEVELOPMENT_RULES.md, not here.