# ARCHITECTURE.md

## System Overview

<!-- harness:placeholder
Purpose:
Provide a concise top-level architectural summary of the system.

Include:
- system type
- major architectural style
- primary runtime boundaries
- major client-side and server-side responsibilities
- external systems that are architecturally significant

Evidence:
Use verified repository facts such as:
- source layout
- package manifests
- framework configuration
- runtime configuration
- deployment configuration
- API or server entry points

Constraints:
- Describe architecture, not product marketing.
- Do not invent services, components, or deployment topology.
- Keep this section high-level.
- Detailed domain behavior belongs in specifications, not here.
-->


## Technology Architecture

<!-- harness:placeholder
Purpose:
Describe the major technologies that shape the architecture and explain their responsibilities.

Include when applicable:
- primary language
- application framework
- build tooling
- UI / component system
- styling system
- state or data-management libraries
- backend / runtime framework
- database / ORM
- package manager
- testing / linting / build infrastructure

Example format:
- TypeScript — primary implementation language
- React — frontend rendering and component model
- Vite — local development and production bundling
- Arco Design — primary UI component system
- Tailwind CSS — utility styling and layout support
- pnpm — dependency and workspace management

Constraints:
- Explain architectural responsibility instead of only listing package names.
- Treat package manifests and lockfiles as the source of truth for exact versions.
- Do not duplicate the complete dependency list.
-->


## Repository Structure

<!-- harness:placeholder
Purpose:
Describe how the source tree maps to architectural responsibilities.

Include the architectural locations that exist in the repository, such as:
- `src/features/` — domain-oriented feature modules and their owned UI, API contracts, and models
- `src/components/` — business-independent, stably reusable presentation components
- `src/shared/` — cross-domain infrastructure and transport mechanisms
- application entry points and routing
- tests and configuration, when present

Example format:

```text
src/
├─ shared/
│  └─ api/                 # Cross-domain transport mechanisms only; no domain URLs or DTOs
├─ components/             # Business-independent presentation components with stable reuse boundaries
│  └─ page-header/         # Shared page-frame elements, such as breadcrumbs and page titles
└─ features/
   └─ <feature>/
      ├─ <Feature>Page.tsx # Domain page composition
      ├─ api/              # Domain API contracts and calls
      ├─ model/            # Domain DTOs, state, and pure types
      ├─ components/       # UI used only by this feature
      └─ <feature>.css     # Complex styles needed by this feature
```

New functionality belongs under `src/features/<feature>/`. Do not place domain logic in root components or shared modules.

Examples illustrate structure only.
Do not include paths that do not exist.

Constraints:
- Do not enumerate the entire repository.
- Describe responsibilities and ownership boundaries.
- Avoid duplicating the general navigation map from `AGENTS.md`.
-->


## Major Components

<!-- harness:placeholder
Purpose:
Describe the major architectural components and what each component owns.

For each major component, capture:
- responsibility
- primary inputs
- primary outputs
- dependencies
- important boundaries

Example format:

### Application Shell

Responsibility:
- Own application bootstrap, routing, and global providers.

Depends on:
- UI system
- feature modules
- shared infrastructure

Must not:
- contain feature-specific business logic

Constraints:
- Prefer stable architectural components over individual files.
- Do not create components that cannot be verified from the repository.
-->


## Dependency Boundaries

<!-- harness:placeholder
Purpose:
Define allowed dependency directions between architectural layers, modules, or domains.

Include:
- which layers may depend on which
- forbidden reverse dependencies
- shared-module boundaries
- generated-code boundaries
- domain / infrastructure separation when applicable

Example:
- UI may depend on application or domain interfaces.
- Domain logic must not depend directly on UI components.
- Shared utilities must not depend on feature-specific modules.
- Generated code must not become the source of handwritten business rules.

Constraints:
- Document only boundaries the repository actually intends to preserve.
- Prefer rules that can later be checked mechanically.
- Avoid vague guidance such as "keep things modular".
-->


## Data Flow

<!-- harness:placeholder
Purpose:
Explain how important data moves through the system.

Include when applicable:
- user input
- frontend state
- API requests
- application or domain processing
- persistence
- external integrations
- response and rendering flow

Example:

User Interaction
→ UI
→ Application / Service Layer
→ API / Integration
→ Persistence or External System
→ Response
→ UI Update

Constraints:
- Focus on major flows rather than individual function calls.
- Distinguish synchronous and asynchronous flows when architecturally relevant.
- Do not invent queues, caches, or services that cannot be verified.
-->


## State Management

<!-- harness:placeholder
Purpose:
Describe where application state lives and which layer owns each type of state.

Include when applicable:
- local UI state
- shared client state
- server state
- persisted state
- URL / router state
- cache state

Clarify:
- source of truth
- ownership
- synchronization rules
- persistence boundaries

Constraints:
- Do not describe state-management libraries that are not present.
- Detailed frontend state conventions belong in `docs/FRONTEND.md`.
- Keep this section at the architectural level.
-->


## Interfaces and Integrations

<!-- harness:placeholder
Purpose:
Describe important architectural boundaries between this system and external systems.

Include when applicable:
- HTTP APIs
- SDKs
- databases
- authentication providers
- message queues
- webhooks
- third-party services
- file or object storage

For each significant integration, capture:
- purpose
- communication direction
- ownership boundary
- failure considerations when architecturally relevant

Constraints:
- Do not expose secret values.
- Do not duplicate full API specifications.
- Detailed API behavior belongs in specifications or reference documentation.
-->


## Runtime and Deployment

<!-- harness:placeholder
Purpose:
Describe the architecture as it exists at runtime.

Include only when verified:
- browser / server / worker boundaries
- build artifacts
- deployment targets
- containers
- edge / serverless runtime environments
- static hosting
- environment-specific topology

Constraints:
- Document only deployment facts that can be verified from the repository.
- Do not infer production infrastructure from local development configuration.
- Detailed operational procedures belong in reliability or deployment documentation.
-->


## Cross-Cutting Concerns

<!-- harness:placeholder
Purpose:
Identify architectural concerns that affect multiple parts of the system.

Include only architecturally significant concerns such as:
- authentication and authorization
- error handling
- logging / observability
- configuration
- internationalization
- caching
- accessibility
- feature flags

Route detailed rules to the appropriate domain document.

Example:
- Security requirements → `docs/SECURITY.md`
- Reliability requirements → `docs/RELIABILITY.md`
- Frontend conventions → `docs/FRONTEND.md`
- UI/UX design rules → `docs/DESIGN.md`

Constraints:
- Keep this section architectural.
- Do not duplicate full domain policies.
-->


## Architectural Invariants

<!-- harness:placeholder
Purpose:
Capture architecture-specific rules that must remain true as the system evolves.

Good examples:
- Feature modules must not depend on the internal implementation of other features.
- Domain logic must remain independent from presentation components.
- Generated artifacts must not be manually edited.
- External integrations must be accessed through defined adapters.
- Shared modules must not import feature-specific code.

Prefer invariants that are:
- durable
- observable
- enforceable
- mechanically testable where possible

Constraints:
- Do not repeat generic repository-wide invariants from `AGENTS.md` unless they have architectural meaning here.
- Avoid temporary implementation preferences.
-->


## Architectural Decisions

<!-- harness:placeholder
Purpose:
Record important architecture decisions that affect future implementation choices.

For each significant decision, capture:
- decision
- rationale
- major trade-offs
- consequences

Example:

### Use a feature-oriented module structure

Decision:
Organize feature-specific application code around stable product or domain boundaries.

Rationale:
Keep related behavior together and reduce coupling between unrelated features.

Consequences:
Shared code should move into common infrastructure only when it is genuinely reusable across multiple features.

Constraints:
- Record durable architectural decisions, not every implementation choice.
- Detailed historical decisions may live in ADRs if the repository adopts them.
-->


## Known Constraints

<!-- harness:placeholder
Purpose:
Document constraints that materially limit architecture or implementation choices.

Examples:
- browser / runtime compatibility
- legacy API dependencies
- deployment restrictions
- data residency requirements
- third-party platform limitations
- performance constraints
- migration constraints

Constraints:
- Include verified constraints only.
- Distinguish current constraints from future goals.
-->


## Evolution Guidance

<!-- harness:placeholder
Purpose:
Describe how the architecture should evolve without prescribing every future implementation.

Include:
- stable extension points
- areas expected to change
- areas that should remain isolated
- migration expectations
- when architecture documentation must be updated
- when a change must enter the OpenSpec change workflow

Example:
- New behavioral changes should be managed through `openspec/changes/`.
- Changes that introduce or modify architectural boundaries should update this document.
- Domain-specific implementation details should remain outside this top-level architecture map.

Constraints:
- Do not speculate about unsupported future architecture.
- Keep evolution guidance aligned with the current repository structure and governance model.
-->
