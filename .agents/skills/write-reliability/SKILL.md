---
name: write-reliability
description: Document verified runtime, failure-handling, and operational reliability behavior.
---
# Write Reliability

## Workflow

Run `xxx context reliability`, then inspect runtime entry points, critical flows, dependencies, error paths, retries, timeouts, jobs, queues, concurrency, logging, metrics, tracing, health/readiness, shutdown, recovery, and degradation. Populate applicable schema sections.

Run `xxx validate docs/RELIABILITY.md --json`; repair actionable errors and repeat until valid.

## Evidence Rules

Do not infer configured retries, observability, monitoring, SLOs, SLIs, RTOs, or RPOs from dependencies or development tooling. State unknowns and limits instead of inventing operational claims.
