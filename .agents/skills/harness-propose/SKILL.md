---
name: harness-propose
description: Create a structured, evidence-backed plan for updating managed Harness documentation.
---
# Harness Propose

## Workflow

1. Use `harness-explore` first. Do not propose an update until its unresolved prerequisites are addressed.
2. Create a kebab-case change and list only managed target documents: `AIharness propose <change-name> --documents AGENTS.md,ARCHITECTURE.md`.
3. Fill `.aiharness/changes/<change-name>/proposal.md` with the Why, Scope, Evidence, Document Updates, and Verification sections.
4. Each `### Document: <path>` block must state the durable change, evidence, and its exact `AIharness validate <path> --json` command.
5. Run `AIharness apply <change-name> --json`. Repair proposal errors until the result is ready; this command does not edit managed documentation.

## Boundaries

The proposal plans documentation changes only. It must not claim source behavior that has not been verified or substitute documentation work for an implementation change.
