# OBSIDIAN Premium Shopify Theme
# AI_SESSION_RULES.md

Version: v1.0

Status: ACTIVE

---

# Purpose

This document defines how AI coding assistants must behave while working on OBSIDIAN.

These rules are mandatory.

They exist to ensure every AI session produces consistent, maintainable, commercial-quality code.

This document applies to:

- Antigravity IDE
- Gemini
- Claude
- Cursor
- Codex
- ChatGPT
- Any future AI coding assistant

---

# Session Startup

Before writing any code, ALWAYS read:

1. MASTER_CONTEXT.md
2. ROADMAP.md
3. DEVELOPMENT_RULES.md
4. DESIGN_PRINCIPLES.md

Never begin implementation without reading these documents.

---

# Source of Truth

ROADMAP.md is the project's single source of truth.

Always determine the current engineering ticket from ROADMAP.md.

Never infer the next task from previous conversations.

Never assume.

---

# Engineering Workflow

Every ticket must follow this sequence.

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

Never merge multiple stages into one ticket.

---

# One Ticket Rule

One engineering ticket equals one feature.

Implement ONLY the requested ticket.

Never implement future tickets.

Never continue automatically.

Always stop after completion.

---

# Development Philosophy

Always extend Shopify Dawn.

Never rebuild Shopify Dawn.

Reuse existing:

- Sections
- Snippets
- JavaScript
- CSS
- Theme Settings

If Shopify already provides a solution:

Improve it.

Do not replace it.

---

# Scope Control

Modify ONLY files directly related to the current ticket.

Do not refactor unrelated systems.

Do not perform repository-wide cleanup.

Do not change completed subsystems.

Keep implementation focused.

---

# Preferred Order of Solutions

Always prefer:

CSS

↓

Native HTML

↓

Liquid

↓

JavaScript

↓

New Architecture

Never introduce JavaScript if CSS is sufficient.

---

# JavaScript Rules

Avoid writing JavaScript unless absolutely necessary.

Never duplicate existing Dawn functionality.

Reuse existing classes.

Reuse existing events.

Reuse existing utilities.

Avoid creating new global objects.

---

# CSS Rules

Prefer additive CSS.

Avoid rewriting existing blocks.

Append new styles where appropriate.

Maintain responsive behavior.

Maintain accessibility.

Avoid unnecessary !important declarations.

Use !important only when overriding:

- Inline styles
- Highly specific Dawn selectors

---

# Liquid Rules

Modify Liquid only when structure must change.

Avoid duplicating markup.

Reuse existing snippets whenever possible.

Maintain Theme Check compatibility.

---

# Accessibility Rules

Accessibility is mandatory.

Maintain:

- Keyboard navigation
- Focus management
- Screen reader support
- Semantic HTML
- ARIA labels
- Visible focus states

Never reduce accessibility.

---

# Performance Rules

Performance is a feature.

Avoid:

- Duplicate DOM
- Duplicate JavaScript
- Excessive event listeners
- Layout shifts
- Heavy animations
- Unnecessary calculations

Prefer native browser behavior.

---

# Motion Rules

Premium motion belongs ONLY to Milestone 8.

Do NOT introduce:

- GSAP
- ScrollTrigger
- Lenis
- ScrollSmoother
- FLIP
- Image Sequences
- Custom Motion Engine

Before Milestone 8.

---

# Frozen Subsystems

Frozen subsystems may receive ONLY:

- Critical bug fixes
- Accessibility improvements
- Performance improvements
- Compatibility fixes

No new features.

Always verify subsystem status in ROADMAP.md.

---

# Merchant Experience

Always prioritize merchants.

Whenever appropriate:

Prefer Theme Settings.

Avoid hardcoded values.

Avoid requiring merchants to edit code.

Features should be intuitive.

---

# Documentation Rules

After every completed ticket:

Update ROADMAP.md.

Mark:

Completed ticket → ✅

Next ticket → ⬜ NEXT

Never modify future milestones.

---

# Required Engineering Report

After every ticket provide ONLY:

Summary

Files Modified

Merchant Settings Added

Bugs Found & Fixed

Verification Checklist

Confirm:

"No existing files were deleted."

Do not provide unnecessary explanations.

---

# QA Rules

QA tickets are not feature tickets.

QA should:

Verify implementation.

Find genuine bugs.

Fix only genuine bugs.

Do not redesign.

Do not introduce new functionality.

---

# Code Quality

Write production-quality code.

Prefer:

- Small changes
- Modular code
- Readable naming
- Reusable logic
- Predictable behavior

Avoid clever solutions.

Maintainability always wins.

---

# Stop Condition

Immediately stop after completing the assigned ticket.

Do NOT continue to the next ticket.

Do NOT suggest future implementations.

Wait for the next engineering ticket.

---

# Repository Safety

Never:

Delete files.

Rename stable files.

Move project structure.

Replace Shopify architecture.

Rewrite working systems.

Repository changes should always be additive.

---

# Final Objective

Every implementation should satisfy all of the following:

✓ Extend Shopify Dawn

✓ Preserve Online Store 2.0 compatibility

✓ Pass Theme Check

✓ Preserve accessibility

✓ Maintain performance

✓ Improve merchant experience

✓ Remain maintainable

✓ Be commercial quality

If a solution violates any of these principles, choose a simpler approach.

---

# End of Document

These rules apply to every AI session without exception.