---
name: harness-explore
description: Explore repository evidence and documentation prerequisites without changing files.
---
# Harness Explore

## Workflow

1. Run `AIharness explore --json` before proposing a managed-document change.
2. Inspect the returned repository facts, capability reasons, and document readiness. This command is read-only; do not create or edit documentation in this phase.
3. Read source, configuration, and existing managed documents needed to answer the reported questions.
4. Ask the user to resolve any fact, ownership, or policy decision that the repository cannot prove.
5. Identify only the managed documents whose durable content should change. Continue with `harness-propose` only after the evidence and target list are clear.

## Evidence Rule

Exploration distinguishes verified facts from questions. Never turn an inference, a directory name, or an unfinished feature into a documentation claim.
