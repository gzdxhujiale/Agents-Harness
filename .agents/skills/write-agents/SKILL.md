---
name: write-agents
description: Create or update AGENTS.md as a verified, concise repository operating guide.
---
# Write AGENTS

## Purpose

Maintain the repository routing and working contract, not a technical encyclopedia.

## Workflow

1. Run `AIharness inspect` and `AIharness status`; inspect the repository layout, managed documents, available Skills, package scripts, and configured deterministic checks.
2. Verify every mentioned path, command, and Skill exists. Read source configuration where evidence is incomplete.
3. Populate every applicable section defined by the current AGENTS schema. Keep architecture and domain detail in their dedicated documents.
4. Run `AIharness validate AGENTS.md --json`; repair every actionable issue and repeat until valid.

## Evidence Rules

Do not invent paths, commands, dependencies, workflow stages, or repository-wide conventions. Prefer repeated stable patterns; package manifests and lockfiles are authoritative for versions. Completion requires verified content and successful validation.
