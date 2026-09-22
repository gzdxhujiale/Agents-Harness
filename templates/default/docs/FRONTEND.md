# FRONTEND.md

## Frontend Overview

<!-- harness:placeholder
Purpose:
Provide a concise overview of how frontend code is implemented in this repository.

Include when detected:
- frontend framework
- build system
- component library
- styling system
- routing solution
- state-management approach
- server-state / data-fetching approach
- form solution
- testing approach

Evidence:
Use verified repository facts such as:
- package manifests
- source structure
- framework configuration
- shared providers
- routing configuration
- existing components

Constraints:
- Describe the actual frontend stack and conventions.
- Do not infer libraries or patterns that cannot be verified.
- Exact package versions remain authoritative in package manifests and lockfiles.
- System-wide architecture belongs in `ARCHITECTURE.md`.
-->


## Source Structure

<!-- harness:placeholder
Purpose:
Describe how frontend source code is organized and where different responsibilities belong.

Include major locations such as:
- `src/app/` — application bootstrap, router configuration, global providers, and shell composition
- `src/features/` — self-contained feature modules (each containing scoped `api/`, `components/`, `hooks/`, `stores/`, `types/` as needed)
- `src/components/` — business-independent, reusable UI presentation components
- `src/hooks/` — shared utility hooks
- `src/lib/` or `src/utils/` — shared utilities and configured library instances (e.g. API client)
- `src/types/` — application-wide shared types

Example format:
- `src/app/` — application shell, providers, and routes
- `src/features/<feature>/` — self-contained product functionality
  - `api/` — feature-specific API declarations (types, fetchers, query/mutation hooks)
  - `components/` — UI components used only within this feature
  - `hooks/` — custom hooks specific to this feature
  - `stores/` — client state specific to this feature
  - `types/` — domain models specific to this feature
- `src/components/` — reusable cross-feature UI components
- `src/lib/` / `src/utils/` — shared infrastructure and helpers

Examples illustrate structure only.
Do not include paths that do not exist.

Constraints:
- Describe ownership, not the entire directory tree.
- Code dependencies flow in one direction: `shared → features → app`.
- Do not build full 5-subfolder skeletons for simple features; start small (`api/` + `components/`) and scale as needed.
- Shared locations should contain genuinely reusable code.
-->


## Component Design

<!-- harness:placeholder
Purpose:
Define how React or equivalent UI components should be structured and composed.

Include:
- component responsibility
- component size and scope
- composition
- props
- reusable vs feature-specific components
- container / presentation separation when applicable
- component ownership

Example:
- Keep components focused on one coherent UI responsibility.
- Prefer composition over large configurable components with many unrelated modes.
- Keep feature-specific components inside the owning feature.
- Promote a component to shared code only when reuse is real and stable.

Constraints:
- Do not create abstractions only because two components look superficially similar.
- Do not place feature-specific business rules inside generic shared components.
- Avoid excessively large components that combine data access, business logic, and complex presentation.
-->


## Design System Usage

<!-- harness:placeholder
Purpose:
Define how the configured UI component system should be used in implementation.

Include when applicable:
- preferred component library
- shared wrappers
- theme usage
- tokens
- component customization
- custom component criteria

Example:
- Prefer existing design-system components before creating custom foundational controls.
- Use shared theme tokens instead of duplicating design values.
- Extend components through supported composition or theming APIs before forking behavior.

Constraints:
- Do not recreate components already provided by the configured design system without a clear reason.
- Do not bypass established design tokens with arbitrary styling.
- UI/UX rules belong in `docs/DESIGN.md`.
-->


## Styling

<!-- harness:placeholder
Purpose:
Define how styling should be implemented consistently.

Include when applicable:
- Tailwind or utility classes
- CSS modules
- global styles
- design tokens
- theme variables
- responsive utilities
- class composition helpers

Clarify:
- when utility classes are appropriate
- when reusable styles or components are appropriate
- where global styling is allowed

Example:
- Prefer existing spacing, typography, and color tokens.
- Use utility classes for local layout and presentation when that is the established pattern.
- Keep global CSS limited to true application-wide behavior.

Constraints:
- Avoid arbitrary values when an existing token satisfies the requirement.
- Do not introduce a second competing styling system without architectural justification.
- Do not encode business logic in styling rules.
-->


## State Management

<!-- harness:placeholder
Purpose:
Define where frontend state belongs and how ownership should be determined.

Classify state into the 5 core categories before introducing it:
- Component State: `useState`/`useReducer`, strictly isolated within individual components.
- Application State: client-only global state (e.g. theme, sidebar, session context) managed via lightweight stores (e.g. Zustand) or React Context.
- Server Cache State: remote asynchronous data managed via dedicated cache clients (e.g. TanStack Query / SWR).
- Form State: form inputs and validation managed locally (e.g. React Hook Form) to isolate re-renders.
- URL / Router State: filter criteria, pagination, search queries, and tabs using URL SearchParams as single source of truth.
- Derived State: calculated during render or with `useMemo`, never synced via `useEffect`.

Guidance:
- Keep local UI state local; do not promote to a store unless multiple components genuinely require shared ownership.
- Server data belongs in the query cache; never duplicate server response state into client-side global stores (Zustand/Redux).
- Use URL state for any view configuration users should be able to bookmark, refresh, or share.
- Derive values during rendering instead of storing duplicate synchronized state.

Constraints:
- Avoid duplicating the same source of truth across multiple state systems.
- Never store remote server responses in general-purpose client stores.
- Do not make ephemeral UI state globally shared unnecessarily.
-->


## Data Fetching

<!-- harness:placeholder
Purpose:
Define how frontend code communicates with APIs and manages remote data.

Include:
- API client ownership and base configuration
- feature-scoped request declarations (`api/<endpoint>.ts` containing DTO types, fetcher function, and query/mutation hook)
- query / mutation conventions (TanStack Query / SWR)
- caching, stale-time, and garbage collection
- request lifecycle and error handling
- invalidation and optimistic updates
- cancellation support

Example:
- Centralize transport-level behavior, auth tokens, and interceptors in `src/lib/api-client` (or equivalent).
- Structure feature API calls under `features/<feature>/api/`: export request/response types, the fetcher function, and a `use<Endpoint>` query or mutation hook.
- Invalidate or update cached query keys after successful mutations according to the configured data layer.
- Avoid raw inline `fetch` or `axios` calls directly inside UI components.

Constraints:
- Do not duplicate authentication, headers, retries, or serialization logic across components.
- Do not silently ignore failed requests.
- Keep API error handling consistent through shared interceptors and error boundaries.
-->


## Routing and Navigation

<!-- harness:placeholder
Purpose:
Define how route-level frontend behavior should be implemented.

Include when applicable:
- route ownership
- route definitions
- nested layouts
- route parameters
- query parameters
- protected routes
- redirects
- navigation state

Guidance:
- Keep routing concerns at route or application boundaries.
- Use URL state for information users should be able to bookmark, refresh, or share when appropriate.
- Preserve predictable browser back / forward behavior.

Constraints:
- Do not hide important navigation state only in component memory.
- Do not introduce competing routing mechanisms.
- Product navigation behavior belongs in `docs/DESIGN.md`; this section describes implementation.
-->


## Forms and Validation

<!-- harness:placeholder
Purpose:
Define how forms, input state, and validation should be implemented.

Include:
- form state ownership
- schema validation when applicable
- client validation
- server validation
- submission lifecycle
- field errors
- form-level errors
- dirty state
- reset behavior

Guidance:
- Treat server-side validation as authoritative for server-owned constraints.
- Use client-side validation to provide timely user feedback.
- Preserve user-entered values after recoverable errors.
- Prevent accidental duplicate submissions.

Constraints:
- Do not duplicate validation rules unnecessarily across unrelated components.
- Do not rely only on placeholder text for field meaning.
- UI copy and interaction behavior belong in `docs/DESIGN.md`.
-->


## Loading, Empty, and Error States

<!-- harness:placeholder
Purpose:
Define the frontend implementation expectations for non-happy-path states.

Every significant asynchronous UI should consider:
- loading
- empty
- error
- success
- partial data
- retry
- stale or refreshing state when applicable

Guidance:
- Prefer localized loading states for localized operations.
- Preserve existing content during background refresh when appropriate.
- Provide retry or recovery behavior when the operation is recoverable.
- Distinguish empty data from request failure.

Constraints:
- Do not treat the happy path as complete implementation.
- Do not swallow operational errors.
- Do not replace meaningful errors with generic messages when useful information is available safely.
-->


## Effects and Side Effects

<!-- harness:placeholder
Purpose:
Define how frontend side effects should be handled.

Include:
- lifecycle effects
- subscriptions
- timers
- browser APIs
- external SDKs
- synchronization with non-React systems
- cleanup requirements

Guidance:
- Reserve `useEffect` strictly for synchronizing with external systems (DOM APIs, browser subscriptions, timers, WebSockets).
- Calculate derived state directly during rendering (or with `useMemo` for expensive computations) instead of syncing state in an effect.
- Handle user actions in event handlers (e.g. `onClick`, `onSubmit`), not by setting state to trigger a `useEffect`.
- Clean up subscriptions, timers, abort controllers, and event listeners in the effect cleanup function.

Constraints:
- Do not use `useEffect` to transform data, filter lists, or copy props into local state.
- Do not use `useEffect` to trigger side effects that originate from a direct user action.
- Avoid cascading multi-effect chains that make data flow unpredictable.
-->


## Hooks and Reusable Logic

<!-- harness:placeholder
Purpose:
Define how reusable frontend behavior should be extracted.

Include:
- custom hooks
- shared logic
- feature hooks
- ownership rules
- public API expectations

Guidance:
- Extract hooks when they represent coherent reusable behavior.
- Keep feature-specific hooks inside the owning feature.
- Keep hooks focused on logic and lifecycle rather than arbitrary code grouping.

Constraints:
- Do not create hooks solely to reduce line count.
- Do not hide unrelated side effects behind generic reusable hooks.
- Avoid overly configurable hooks with unclear ownership.
-->


## TypeScript

<!-- harness:placeholder
Purpose:
Define frontend TypeScript expectations.

Include:
- component prop types
- API types
- domain types
- narrowing
- nullability
- generated types
- type ownership

Guidance:
- Prefer explicit domain types at architectural boundaries.
- Narrow unknown external data before use.
- Reuse generated API types when they are authoritative.
- Keep component props focused and intentional.

Constraints:
- Avoid `any` unless there is a documented boundary that cannot reasonably be typed.
- Do not duplicate authoritative generated types manually.
- Do not use type assertions merely to suppress legitimate type errors.
-->


## Performance

<!-- harness:placeholder
Purpose:
Define frontend performance practices that should influence implementation.

Include when applicable:
- render cost
- code splitting
- lazy loading
- list rendering
- image / asset loading
- expensive computation
- network waterfalls
- bundle impact

Guidance:
- Optimize demonstrated or reasonably predictable bottlenecks.
- Keep route or feature boundaries suitable for code splitting when supported.
- Avoid unnecessary rerenders caused by unstable ownership or duplicated state.
- Consider network cost when adding new requests.

Constraints:
- Do not add memoization everywhere by default.
- Do not trade significant maintainability for speculative micro-optimizations.
- Measure when performance decisions are non-trivial.
-->


## Accessibility Implementation

<!-- harness:placeholder
Purpose:
Define technical frontend requirements for implementing accessible UI.

Include:
- semantic HTML
- keyboard behavior
- focus management
- accessible names
- ARIA usage
- form association
- dynamic announcements
- reduced-motion support when applicable

Guidance:
- Prefer native semantic elements before custom ARIA-based equivalents.
- Preserve visible keyboard focus.
- Ensure interactive elements remain operable without a pointer.
- Use design-system accessibility behavior when available.

Constraints:
- Do not use ARIA to compensate for avoidable incorrect semantics.
- Do not remove focus outlines without an accessible replacement.
- UI/UX accessibility principles belong in `docs/DESIGN.md`.
-->


## Testing

<!-- harness:placeholder
Purpose:
Define frontend testing expectations and where different types of tests provide value.

Include when applicable:
- unit tests
- component tests
- integration tests
- end-to-end tests
- accessibility tests
- visual tests

Guidance:
- Test user-visible behavior rather than implementation details.
- Prioritize critical workflows, state transitions, and regression-prone behavior.
- Add regression coverage when fixing meaningful bugs.
- Use the repository's established testing tools.

Constraints:
- Do not write brittle tests that depend unnecessarily on internal component structure.
- Do not remove tests simply to make a change pass.
- Exact commands belong in `AGENTS.md` or project tooling documentation.
-->


## Frontend Invariants

<!-- harness:placeholder
Purpose:
Capture durable frontend implementation rules that should remain true as the codebase evolves.

Good examples:
- No cross-feature imports: `src/features/A` must never directly import from `src/features/B` (promote to shared code).
- Dependencies flow strictly one direction: `shared → features → app`.
- Server cache data is managed by dedicated cache clients and never stored in client-side global stores.
- `useEffect` is reserved exclusively for external system synchronization, never for derived state or user event handling.
- Avoid root barrel files (`index.ts` re-exporting everything) inside features to preserve Vite tree-shaking performance.
- Feature-specific code remains owned by its feature.
- Shared components do not import feature-specific modules.
- Existing design-system components are preferred over duplicate foundational controls.
- Network transport behavior is centralized in the established API layer.
- Generated types are not manually duplicated.

Prefer invariants that are:
- durable
- observable
- enforceable
- mechanically testable where practical

Constraints:
- Keep this section frontend-specific.
- Repository-wide invariants belong in `AGENTS.md`.
- System-wide architectural boundaries belong in `ARCHITECTURE.md`.
-->


## Frontend Review Criteria

<!-- harness:placeholder
Purpose:
Define the implementation checks required before significant frontend work may be considered complete.

Review when applicable:
- code follows established source ownership
- existing design-system components are reused appropriately
- state has the correct owner
- loading, empty, error, and success states are handled
- form validation and submission behavior are correct
- responsive behavior is implemented
- keyboard and accessibility behavior are preserved
- TypeScript checks pass
- relevant frontend tests pass
- lint passes
- build succeeds when applicable
- affected managed documentation remains valid

Example:
Before completing frontend work:
- verify the implementation matches `docs/DESIGN.md`
- verify no unnecessary shared abstraction was introduced
- verify no duplicate source of truth was introduced
- verify asynchronous failure states are handled
- run the required repository checks

Constraints:
- Do not report frontend work complete based only on visual appearance.
- Do not bypass deterministic checks to satisfy completion criteria.
-->