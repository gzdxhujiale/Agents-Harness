---
name: write-architecture
description: Write ARCHITECTURE.md from verified system structure, boundaries, and runtime evidence.
---
# Write Architecture

## Workflow

1. Run `AIharness context architecture`, `AIharness inspect`, and inspect entry points, modules, manifests, build/runtime configuration, integrations, persistence, and data/state boundaries as needed.
2. Prefer current source, then runtime/build configuration, manifests, current specifications, and existing architecture prose.
3. Populate every applicable schema section with stable responsibilities, boundaries, data flow, and constraints—not individual functions.
4. Run `AIharness validate ARCHITECTURE.md --json`, repair all actionable failures, and repeat until valid.

## Boundaries

Do not invent services, production topology, or microservices from directory names. Keep UI behavior in DESIGN.md, frontend conventions in FRONTEND.md, and detailed business behavior in specifications.
