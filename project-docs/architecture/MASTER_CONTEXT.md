# OBSIDIAN Premium Shopify Theme
# MASTER_CONTEXT.md

Version: v1.0

Status: ACTIVE

---

# Purpose

This document is the master context for every AI coding session.

Every new AI session MUST read this document before performing any work.

It defines the project philosophy, development workflow, engineering constraints, repository rules, and current development state.

This document is the primary onboarding document for AI assistants.

---

# Project

Project Name

OBSIDIAN Premium Shopify Theme

Base Theme

Shopify Dawn

Target

Commercial Shopify Online Store 2.0 Premium Theme

Goals

- Premium UX
- Premium UI
- Merchant Friendly
- Accessibility
- Performance
- Maintainability
- Theme Check Compatible
- Commercial Quality

---

# Development Philosophy

Always extend Shopify Dawn.

Never rebuild existing Dawn functionality.

Always prefer extending:

- Sections
- Snippets
- Custom Elements
- Existing JavaScript
- Existing CSS

Do not replace working Dawn systems.

---

# Documentation

Always read these documents before starting work:

1. ROADMAP.md
2. DEVELOPMENT_RULES.md
3. DESIGN_PRINCIPLES.md
4. CHANGELOG.md (if required)

ROADMAP is the source of truth.

---

# Engineering Workflow

Every feature follows this order.

Architecture Audit

↓

Structure

↓

Styling

↓

Behavior

↓

QA

↓

Freeze

Never skip stages.

Never combine multiple tickets.

Stop after every ticket.

Wait for the next engineering ticket.

---

# Current Development Status

Current Version

v0.5 Development

Current Milestone

Milestone 5

Current Ticket

Always check ROADMAP.md.

Never assume.

---

# Coding Rules

Prefer CSS over JavaScript.

Prefer JavaScript over rebuilding Liquid.

Modify Liquid only when necessary.

Reuse Shopify architecture whenever possible.

Keep changes additive.

Never rewrite large files.

Never introduce duplicate systems.

Never introduce unnecessary abstractions.

---

# Architecture Rules

Reuse:

MediaGallery

DeferredMedia

ProductModel

ModalDialog

SliderComponent

Variant Picker

Predictive Search

Drawers

ProductForm

Never replace these systems.

---

# Motion Rules

Premium animation belongs ONLY to Milestone 8.

Do NOT introduce:

GSAP

ScrollTrigger

Lenis

ScrollSmoother

FLIP

Image Sequences

Custom Motion Engine

Before Milestone 8.

---

# Frozen Subsystems

Frozen systems may receive ONLY:

- Critical bug fixes
- Accessibility improvements
- Performance improvements
- Compatibility fixes

No new features.

Always check ROADMAP.md before modifying a subsystem.

---

# Merchant Philosophy

Merchant experience is always prioritized.

Whenever appropriate:

Prefer Theme Settings over hardcoded values.

Avoid requiring merchants to edit code.

---

# Accessibility

Maintain:

Keyboard navigation

Focus management

Screen reader compatibility

Semantic HTML

Theme Check compatibility

WCAG-friendly interactions

Accessibility is mandatory.

---

# Performance

Performance is a feature.

Avoid:

Duplicate DOM

Large JavaScript

Layout shifts

Excessive event listeners

Forced reflows

Prefer CSS solutions.

---

# AI Instructions

Every ticket must:

Read existing implementation.

Understand Dawn.

Extend Dawn.

Do NOT rebuild Dawn.

Do NOT introduce competing implementations.

If a feature already exists:

Improve it.

Do not replace it.

---

# Engineering Reports

After every ticket provide ONLY:

Summary

Files Modified

Merchant Settings Added

Bugs Found & Fixed

Verification Checklist

Confirm:

"No existing files were deleted."

---

# Stop Condition

Complete ONLY the requested ticket.

Never continue automatically.

Wait for the next engineering ticket.

---

# Current Repository State

Always determine the current task by reading:

ROADMAP.md

Never infer the next ticket from previous conversations.

ROADMAP.md is the single source of truth.

---

# Engineering Goal

Build one of the highest-quality commercial Shopify themes while preserving:

- Shopify compatibility
- Maintainability
- Performance
- Accessibility
- Merchant usability

Commercial quality is always preferred over complexity.

---

# End of Document