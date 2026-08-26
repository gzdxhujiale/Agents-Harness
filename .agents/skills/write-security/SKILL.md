---
name: write-security
description: Document verified repository security controls, boundaries, unknowns, and limitations.
---
# Write Security

## Workflow

Run `AIharness context security`, then inspect trust boundaries, authentication and authorization enforcement, sessions, configuration, input/API boundaries, sensitive data, uploads, integrations, headers, and security tooling. Populate applicable schema sections, distinguishing verified controls, known limitations, and unknown behavior.

Run `AIharness validate docs/SECURITY.md --json`; repair actionable errors and repeat until valid.

## Safety Rules

Never reveal `.env` values, tokens, credentials, or private keys. An installed library does not prove a control, and a claim of encryption or authorization requires implementation/configuration evidence. Do not label the repository secure without evidence.
