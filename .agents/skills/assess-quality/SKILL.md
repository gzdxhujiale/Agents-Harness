---
name: assess-quality
description: Produce an evidence-backed quality assessment in docs/QUALITY_SCORE.md.
---
# Assess Quality

## Workflow

Measure deterministic evidence first: configured build, typecheck, lint, tests, coverage, document validation, dependency/static analysis, and documented architecture, security, reliability, and frontend findings. Evaluate findings against any dedicated scoring configuration, explain the evidence, then update applicable sections in the quality schema.

Run `xxx validate docs/QUALITY_SCORE.md --json`, repair actionable failures, and repeat until valid.

## Scoring Rules

Never assign a score without evidence. Unknown does not silently pass; missing optional tooling is not automatically a failure. Do not reward files or dependencies merely for existing. Keep qualitative interpretation traceable to repository evidence, and apply score caps only where the configured scoring model defines them.
