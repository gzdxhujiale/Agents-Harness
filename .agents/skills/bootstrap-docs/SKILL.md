---
name: bootstrap-docs
description: Orchestrate evidence-based initialization and repair of applicable Harness documents.
---
# Bootstrap Documentation

## Purpose

Coordinate managed-document work; do not mechanically fill every template.

## Workflow

1. Run `xxx inspect`, then `xxx status`.
2. Classify documents using Harness applicability and status: required, recommended, optional, pending, invalid, stale, or not applicable.
3. Prioritize required applicable documents. Route each to its matching `write-*` Skill; use `assess-quality` for the quality report.
4. After each update, run `xxx validate <document> --json`, repair actionable errors, and repeat.
5. Run `xxx status` again. Complete only when all required applicable documents validate.

## Evidence and Completion

Never fabricate content for an inapplicable document. Inspect source and configuration when status is insufficient. Record genuine evidence/configuration blockers rather than declaring bootstrap complete.
