## Project
<!--
Summarize the repository using verified project facts.

Include only when detected:
- primary purpose
- main language(s)
- primary framework(s)
- package/build system
- major runtime or deployment model

Do not infer technologies that cannot be verified from the repository.
-->

## Repository Map
<!--
Describe only the major repository locations an agent needs for navigation.

Focus on:
- application source
- tests
- configuration
- long-lived documentation
- current specifications
- active changes
- generated artifacts
- agent skills

Example:
- `src/` — application source
- `docs/` — long-lived engineering documentation
- `openspec/specs/` — current system behavior
- `openspec/changes/` — active changes
- `.agents/skills/` — task-specific agent workflows
Examples illustrate format only.
Do not copy paths that do not exist in the repository.
Do not enumerate every directory.
-->

## Task Routing
<!--
Route common task types to the correct source of truth and Skill.

For each supported task type, specify:
- what to read first
- which Skill to use
- which document/spec is authoritative
- which validation command must be run

Keep this section as routing only.
Detailed workflows belong in Skills.
-->

## Change Workflow
<!--
Describe the repository's change-management contract.

Include:
- where current behavior lives
- where proposed changes live
- required change artifacts
- when validation is required
- when a change can be considered complete or archived

Do not duplicate the full change workflow.
Refer to the relevant Skill for detailed steps.
-->


## Engineering Invariants

<!--
List only durable rules that must remain true across implementation changes.

Good invariants include:
- source-of-truth boundaries
- architecture boundaries
- generated-file rules
- security constraints
- package-management rules
- dependency direction
- forbidden shortcuts

Avoid temporary preferences or highly specific implementation details.
-->


## Completion Criteria

<!--
Define the checks required before an agent may report a task as complete.

Include applicable:
- tests
- type checks
- lint
- builds
- Harness validation
- change verification
- documentation validation

Example:
Before completing implementation work:
- relevant tests pass
- type checking passes
- lint passes
- build succeeds when applicable
- modified managed documents pass `xxx validate`
- required change verification passes

Do not report completion while required deterministic checks are failing.
-->


## Commands

<!--
List the repository commands agents are expected to use regularly.

Include only stable, high-value commands.

For each command, briefly state its purpose.
Do not duplicate full CLI documentation here.
-->
