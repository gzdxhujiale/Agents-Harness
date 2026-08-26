---
name: bootstrap-docs
description: Orchestrate evidence-based initialization and repair of applicable Harness documents.
---
# Bootstrap Documentation

## Purpose

Coordinate managed-document work; do not mechanically fill every template.

## Workflow

1. Run `AIharness inspect`, then parse the JSON from `AIharness status`.
2. Use each `documents[]` entry's `applicability`, `readiness`, and `reasons`. Do not infer applicability independently when this status is available.
3. Prioritize `required` documents with `pending` or `invalid` readiness, then `recommended` documents. Route each to its matching `write-*` Skill; use `assess-quality` only when the quality report is chosen.
4. After each update, run `AIharness validate <document> --json`, repair actionable errors, and repeat.
5. Run `AIharness status` again. Complete only when every required applicable document has `valid` readiness.

## Evidence and Completion

Never fabricate content for an inapplicable document. Inspect source and configuration when status is insufficient. Record genuine evidence/configuration blockers rather than declaring bootstrap complete.
