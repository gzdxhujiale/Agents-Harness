---
name: write-product-sense
description: Write conservative product principles only when explicit repository evidence supports them.
---
# Write Product Sense

## Workflow

Run `AIharness context product`, `AIharness inspect`, and inspect product specifications, requirements, accepted proposals, user-visible behavior, terminology, workflows, and constraints. Use this evidence order: explicit specifications, requirements, accepted proposals, behavior, then implementation detail.

Populate only applicable schema sections and run `AIharness validate docs/PRODUCT_SENSE.md --json`; repair actionable failures until valid.

## Evidence Rules

Do not invent users, business goals, strategy, or intent from implementation. Omit or mark rationale unknown when it cannot be verified; do not force an inapplicable document into existence.
