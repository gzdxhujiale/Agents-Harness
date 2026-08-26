# Repository AI Development Guide

<!-- This file is the operating agreement for AI contributors. Replace placeholders with repository facts; remove sections that do not apply. Do not state assumptions as facts. -->

## Purpose and Scope

<!-- Describe what this repository owns, its primary users, and any work that is out of scope. -->

## Start Here

<!-- List the most useful entry points in priority order. Example: ARCHITECTURE.md, docs/DESIGN.md, README.md, package.json. -->

1. Read the repository documentation relevant to the requested change.
2. Inspect the affected code and existing tests before proposing an implementation.
3. Preserve existing conventions unless the task explicitly changes them.

## Repository Map

<!-- Map important paths to their purpose. Keep this factual and concise. -->

| Path | Purpose |
| --- | --- |
| `[path]` | `[what belongs here]` |

## Development Workflow

<!-- Add the actual install, development, test, lint, type-check, build, and release commands. -->

| Task | Command | Notes |
| --- | --- | --- |
| Install | `[command]` | `[notes]` |
| Test | `[command]` | `[notes]` |
| Type-check | `[command]` | `[notes]` |
| Build | `[command]` | `[notes]` |

## Implementation Rules

<!-- Record project-specific architecture, API, data, or UI constraints. -->

- Make the smallest change that fully satisfies the request.
- Keep business logic separate from delivery adapters, such as CLIs, HTTP handlers, or UI components.
- Prefer existing utilities and patterns before adding new abstractions.
- Update relevant documentation when behavior, interfaces, or operational expectations change.
- Do not overwrite user-authored files or make unrelated formatting changes.

## Validation Expectations

<!-- Define the minimum evidence required before considering work complete. -->

- Run the checks that cover the modified behavior.
- Add or update tests for changed behavior when the repository has an applicable test setup.
- Report checks that could not be run, including the reason.

## Safety and Security

<!-- Add repository-specific security, privacy, deployment, and data-handling constraints. -->

- Do not expose credentials, tokens, private keys, or personal data in code, logs, fixtures, or documentation.
- Treat destructive operations, production changes, and external side effects as requiring explicit authorization.
- Validate untrusted input at system boundaries.

## Change Handoff

<!-- Specify pull-request, changelog, migration, or review requirements. -->

When handing off work, summarize the behavior changed, files affected, validation performed, and any remaining risk or follow-up.
