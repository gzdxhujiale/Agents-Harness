# AGENTS.md

## Project

<!--
Purpose:
Summarize the repository using verified project facts.

Include only when detected:
- Primary purpose
- Main language(s)
- Primary framework(s)
- Package/build system
- Major runtime or deployment model
- Major application type


Constraints:
- Do not infer technologies that cannot be verified from the repository.
- Do not invent the business purpose of the project.
- For exact dependency versions, treat package manifests and lockfiles as the source of truth.
- Keep this section concise and useful for an agent entering the repository.
-->


## Repository Map

<!--
Purpose:
Provide a concise navigation map for coding agents.

Focus on major repository locations such as:
- Application source
- Tests
- Configuration
- Long-lived documentation
- Current specifications
- Active changes
- Generated artifacts
- Agent skills

Example format:
- `src/` — application source
- `tests/` — automated tests
- `docs/` — long-lived engineering documentation
- `openspec/specs/` — current effective system behavior
- `openspec/changes/` — proposed and active behavior changes
- `.agents/skills/` — task-specific agent workflows

Examples illustrate format only.
Do not include paths that do not exist in the repository.

Constraints:
- Do not enumerate every directory.
- Include only locations useful for common development tasks.
- Prefer stable repository boundaries over implementation details.
-->


## Task Routing

<!--
Purpose:
Route common task types to the correct source of truth, Skill, and validation path.

For each supported task type, specify:
- What to read first
- Which Skill to use
- Which document or specification is authoritative
- Which validation command must be run when applicable

Example format:

- Architecture work
  - Read: `ARCHITECTURE.md`
  - Skill: `write-architecture`
  - Source of truth: repository code + `ARCHITECTURE.md`
  - Validate: `xxx validate ARCHITECTURE.md --json`

- Security work
  - Read: `docs/SECURITY.md`
  - Skill: `write-security`
  - Source of truth: security-relevant repository code + `docs/SECURITY.md`
  - Validate: `xxx validate docs/SECURITY.md --json`

- Reliability work
  - Read: `docs/RELIABILITY.md`
  - Skill: `write-reliability`
  - Source of truth: runtime, deployment, observability, and failure-handling code
  - Validate: `xxx validate docs/RELIABILITY.md --json`

- Repository documentation bootstrap
  - Skill: `bootstrap-docs`
  - Inspect: `xxx inspect`
  - Status: `xxx status`

- Behavioral change
  - Read: `openspec/specs/`
  - Skill: configured change workflow Skill
  - Work in: `openspec/changes/<change-name>/`

Examples illustrate structure only.
Use only Skills, paths, and commands that actually exist.

Constraints:
- Keep this section as routing only.
- Detailed step-by-step workflows belong in Skills.
- Do not duplicate domain documentation here.
-->


## Change Workflow

<!--
Purpose:
Define the repository-level contract for behavioral changes.

Include:
- Where current behavior is defined
- Where proposed changes live
- Required change artifacts
- Validation gates
- Verification requirements
- Completion and archive conditions

Typical structure:
- `openspec/specs/` — current effective behavior
- `openspec/changes/<change-name>/proposal.md`
- `openspec/changes/<change-name>/specs/`
- `openspec/changes/<change-name>/design.md`
- `openspec/changes/<change-name>/tasks.md`
- `openspec/changes/archive/`

Constraints:
- Do not duplicate detailed Skill instructions.
- Do not invent workflow stages that are not configured.
- Do not bypass validation or verification requirements.
- Refer to the relevant Skill for detailed execution steps.
-->


## Engineering Invariants

<!--
Purpose:
List durable engineering rules that must remain true across implementation changes.

Good invariants include:
- Source-of-truth boundaries
- Architecture boundaries
- Generated-file rules
- Security constraints
- Package-management rules
- Dependency direction
- State-management boundaries
- Forbidden shortcuts
- Repository governance rules

Prefer invariants that are:
- Testable
- Observable
- Actionable
- Stable over time

Example invariants:
- Avoid degradation handling, fallback, hacks, heuristics,local stabilizations, or post-processing bandages thatare not faithful general algorithms
- Use the configured package manager for dependency changes.
- Never expose secret values.
- Do not fabricate APIs, packages, paths, dependencies, or architectural facts.


Avoid:
- Temporary preferences
- Vague statements such as "write clean code"
- Generic best-practice slogans
- Highly specific implementation details that belong in domain documentation
-->


## Completion Criteria

<!--
Purpose:
Define repository-wide checks required before an agent may report work as complete.

Include when applicable:
- Relevant tests
- Type checks
- Lint
- Build
- Harness validation
- Change verification
- Documentation validation
- Generated-artifact checks
- Required status checks

Example for implementation work:
- Relevant tests pass.
- Type checking passes.
- Lint passes.
- Build succeeds when applicable.
- Modified managed documents pass `xxx validate`.
- Required change verification passes.
- No required deterministic check is failing.

Example for managed documentation work:
- Project facts have been inspected when needed.
- The document contains only verified repository facts.
- The document passes `xxx validate <file> --json`.
- Reported validation errors have been resolved.

Constraints:
- Task-specific completion requirements belong in the relevant Skill or change artifact.
- Do not report success while required deterministic checks are failing.
- Do not treat file existence as equivalent to completion.
- Do not bypass validation to satisfy completion criteria.
-->


## Commands

<!--
Purpose:
List stable, high-value commands agents are expected to use regularly.

For each command:
- Provide the command.
- Provide one short purpose statement.

Example format:
- `xxx inspect` — scan verified repository facts
- `xxx inspect --json` — return repository facts in machine-readable form
- `xxx context <domain>` — produce task-specific repository context
- `xxx context <domain> --json` — return task-specific context in machine-readable form
- `xxx validate [file]` — validate one or all managed artifacts
- `xxx validate [file] --json` — return structured validation results
- `xxx status` — show Harness state and documentation readiness
- `pnpm test` — run automated tests
- `pnpm lint` — run lint checks
- `pnpm typecheck` — run type checking
- `pnpm build` — build the project

Examples illustrate format only.
Only list commands that actually exist in this repository.

Constraints:
- Do not duplicate full CLI documentation here.
- Prefer commands that are stable and commonly required by agents.
- Exact flags and advanced usage should live in CLI help or dedicated documentation.
-->