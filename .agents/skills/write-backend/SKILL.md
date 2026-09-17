---
name: write-backend
description: Write docs/BACKEND.md from verified backend code, runtime configuration, and operational evidence.
---
# Write Backend

## Workflow

1. Run `AIharness context backend`, `AIharness inspect`, and `AIharness status`.
2. Inspect verified backend entry points, routes, handlers, validation, persistence, integrations, jobs, queues, errors, observability, security controls, and tests.
3. Populate only the schema sections justified by current source and configuration. State verified limitations and unknowns explicitly.
4. Run `AIharness validate docs/BACKEND.md --json`; repair actionable errors and repeat until valid.

## Boundaries

Do not invent APIs, data stores, background processing, deployment topology, or security controls. Keep high-level system structure in ARCHITECTURE.md and detailed security analysis in docs/SECURITY.md.
