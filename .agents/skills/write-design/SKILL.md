---
name: write-design
description: Write evidence-backed UI and UX guidance for repositories with a meaningful user interface.
---
# Write Design

## Applicability and Workflow

Use only when a meaningful user-facing interface exists. Run `AIharness inspect` and `AIharness status`, then inspect screens, repeated components, theme/tokens, navigation, forms, states, responsive behavior, accessibility, motion, and microcopy.

Populate applicable sections in the DESIGN schema from repeated, stable UI patterns. DESIGN.md describes user experience and visual behavior; FRONTEND.md describes implementation. Run `AIharness validate docs/DESIGN.md --json`, repair actionable errors, and repeat until valid.

## Evidence Rules

Do not infer a design language, tokens, or policy from an isolated implementation. Do not turn implementation accidents into UX guidance. Mark unavailable evidence as unknown rather than inventing it.
