---
name: write-frontend
description: Write frontend implementation guidance from verified framework and code conventions.
---
# Write Frontend

## Workflow

Use only when frontend code exists. Run `xxx context frontend`, then inspect bootstrap, routing, providers, source ownership, components, design-system integration, styling, state, remote data, forms, hooks, effects, TypeScript, testing, performance, and accessibility.

Populate applicable schema sections from current repeated conventions. Run `xxx validate docs/FRONTEND.md --json`, fix every actionable issue, and repeat until valid.

## Boundaries and Evidence

ARCHITECTURE.md owns system boundaries; DESIGN.md owns UX behavior; this document owns frontend implementation conventions. Do not recommend a library merely because it is installed or popular. Verify versions in manifests or lockfiles.
