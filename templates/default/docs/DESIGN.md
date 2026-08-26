# DESIGN.md

## Design Principles

<!-- harness:placeholder
Purpose:
Define the core UI/UX principles that should guide product and interface design decisions.

Include:
- visual consistency
- clarity
- hierarchy
- simplicity
- predictability
- usability
- accessibility
- appropriate use of progressive disclosure

Evidence:
Use verified product patterns, existing UI, design-system usage, and established interaction conventions in the repository.

Constraints:
- Keep principles durable and reusable.
- Avoid generic slogans that do not influence design decisions.
- Do not invent product goals that cannot be verified.
- Detailed implementation rules belong in `docs/FRONTEND.md`.
-->


## Visual Language

<!-- harness:placeholder
Purpose:
Describe the overall visual character of the product.

Include when identifiable:
- visual tone
- density
- shape language
- use of borders
- shadows
- elevation
- surfaces
- icon style
- visual emphasis patterns

Evidence:
Use existing screens, shared styles, design tokens, component-library configuration, and repeated UI patterns.

Example:
- Prefer restrained elevation over heavy shadows.
- Use borders and surface contrast to separate content regions.
- Keep visual emphasis focused on primary actions and important state.

Examples illustrate the type of guidance only.
Do not copy examples unless they match the actual product.

Constraints:
- Describe existing or intended reusable visual rules.
- Do not prescribe isolated pixel values unless they are part of the design system.
-->


## Layout and Spacing

<!-- harness:placeholder
Purpose:
Define how pages and components should organize space and visual hierarchy.

Include:
- page width and content containers
- section spacing
- component spacing
- alignment
- grid usage
- dense vs spacious layouts
- whitespace principles

Evidence:
Use existing page layouts, layout primitives, spacing tokens, and repeated component patterns.

Example:
- Keep related controls visually grouped.
- Use larger spacing between semantic sections than between items within a section.
- Align repeated controls and content consistently.

Constraints:
- Prefer spacing tokens or existing layout primitives over arbitrary values.
- Do not introduce a new spacing system when one already exists.
-->


## Typography

<!-- harness:placeholder
Purpose:
Define how typography communicates hierarchy and meaning.

Include:
- heading hierarchy
- body text
- labels
- helper text
- metadata
- emphasis
- text density
- line length when relevant

Evidence:
Use existing typography tokens, theme configuration, UI-library defaults, and repeated application patterns.

Constraints:
- Preserve a clear hierarchy.
- Avoid excessive font sizes, weights, or styles.
- Do not invent typography tokens that are not supported by the project.
- Exact implementation details belong in the frontend or theme configuration.
-->


## Color

<!-- harness:placeholder
Purpose:
Define how color should be used semantically and consistently.

Include:
- primary and accent usage
- text hierarchy
- surfaces
- borders
- success
- warning
- error
- informational states
- disabled states

Evidence:
Use design tokens, theme variables, component-library configuration, and existing semantic color usage.

Example:
- Use semantic colors for status meaning rather than decoration.
- Do not rely on color alone to communicate critical state.
- Reserve strong accent colors for actions or important information.

Constraints:
- Prefer existing semantic tokens.
- Do not introduce arbitrary colors without a design-system reason.
- Maintain accessible contrast.
-->


## Components

<!-- harness:placeholder
Purpose:
Define how reusable UI components should be selected, composed, and extended.

Include:
- preferred design-system components
- when composition is preferred over custom components
- when custom components are justified
- consistency expectations
- component variants
- shared interaction behavior

Evidence:
Use the configured component library, shared component directories, and existing reusable patterns.

Example:
- Prefer existing design-system components before introducing custom equivalents.
- Extend shared components when a pattern appears across multiple product areas.
- Avoid creating visually similar components with different behavior.

Constraints:
- Do not duplicate components already provided by the design system.
- Do not encode feature-specific business logic inside general-purpose visual components.
- Detailed React or implementation conventions belong in `docs/FRONTEND.md`.
-->


## Interaction Patterns

<!-- harness:placeholder
Purpose:
Define reusable interaction behavior across the product.

Include when applicable:
- click and tap behavior
- selection
- hover
- focus
- inline editing
- confirmation
- destructive actions
- progressive disclosure
- drag and drop
- keyboard interaction

Evidence:
Use existing interaction patterns and component behavior.

Example:
- Require confirmation only for actions with meaningful irreversible consequences.
- Keep common actions immediately accessible.
- Hide advanced or infrequent options behind progressive disclosure when appropriate.

Constraints:
- Similar actions should behave consistently across the product.
- Avoid surprising interaction patterns without a strong usability reason.
-->


## Navigation

<!-- harness:placeholder
Purpose:
Define how users move through the product and understand their current location.

Include when applicable:
- primary navigation
- secondary navigation
- tabs
- breadcrumbs
- back behavior
- deep linking
- page hierarchy
- navigation persistence

Evidence:
Use existing routing, navigation components, information architecture, and product flows.

Constraints:
- Preserve predictable navigation behavior.
- Do not create multiple competing navigation patterns for the same hierarchy.
- Navigation structure should reflect product information architecture rather than implementation structure.
-->


## Forms and Input

<!-- harness:placeholder
Purpose:
Define consistent form and input behavior.

Include:
- labels
- placeholders
- required fields
- validation
- helper text
- error placement
- grouping
- defaults
- submit behavior
- disabled states

Evidence:
Use existing form patterns, validation behavior, and design-system form components.

Example:
- Use labels for persistent field meaning.
- Use placeholders as examples or hints, not as replacements for labels.
- Show validation errors close to the relevant field.
- Preserve user input when recoverable validation errors occur.

Constraints:
- Avoid unnecessary fields.
- Avoid ambiguous validation messages.
- Do not use disabled controls where an explanation of unavailable behavior is needed.
-->


## Feedback and Status

<!-- harness:placeholder
Purpose:
Define how the interface communicates the result and state of user actions.

Include:
- success feedback
- warnings
- informational feedback
- destructive action feedback
- background operation status
- progress
- saved / unsaved state

Evidence:
Use existing notification, message, toast, banner, badge, and inline-status patterns.

Constraints:
- Match feedback prominence to the importance of the event.
- Do not use global notifications for every minor interaction.
- Ensure important state is visible without relying on transient messages alone.
-->


## Loading States

<!-- harness:placeholder
Purpose:
Define how the interface behaves while data or actions are in progress.

Include when applicable:
- initial loading
- local component loading
- background refresh
- action loading
- skeletons
- spinners
- optimistic updates

Example:
- Prefer local loading states when only part of the page is updating.
- Avoid blocking the entire interface for isolated operations.
- Prevent duplicate submissions while an action is in progress.

Constraints:
- Loading behavior should preserve context where practical.
- Do not show misleading progress indicators.
-->


## Empty States

<!-- harness:placeholder
Purpose:
Define how the product communicates the absence of content or data.

Include:
- explanation of the empty state
- expected next action
- onboarding guidance when applicable
- permission-related empty states
- filtered empty results

Example:
- Explain why the state is empty.
- Provide a meaningful next action when one exists.
- Distinguish "no data exists" from "no results match the current filter."

Constraints:
- Avoid decorative empty states with no guidance.
- Do not treat system errors as empty states.
-->


## Error States

<!-- harness:placeholder
Purpose:
Define how user-facing errors should be presented.

Include:
- validation errors
- request failures
- permission failures
- unavailable services
- partial failures
- recovery actions

Example:
- Explain what failed in user-understandable language.
- Provide a recovery action when one is available.
- Preserve user work when possible.

Constraints:
- Do not expose internal stack traces or sensitive implementation details.
- Avoid generic messages such as "Something went wrong" when a more useful explanation is available.
- Reliability behavior belongs in `docs/RELIABILITY.md`.
-->


## Responsive Design

<!-- harness:placeholder
Purpose:
Define how layouts and interactions adapt across supported viewport sizes and devices.

Include when applicable:
- layout adaptation
- navigation changes
- content priority
- touch targets
- table behavior
- overflow
- responsive component behavior

Evidence:
Use existing breakpoints, responsive utilities, layout components, and supported device targets.

Constraints:
- Preserve task completion across supported viewport sizes.
- Do not simply shrink desktop layouts when restructuring is more appropriate.
- Use existing breakpoint and responsive systems.
-->


## Accessibility

<!-- harness:placeholder
Purpose:
Define UI/UX requirements that make the product usable by people with different abilities and input methods.

Include:
- keyboard access
- focus behavior
- semantic structure
- accessible names
- color contrast
- status communication
- form labeling
- screen-reader considerations

Example:
- Interactive elements must be keyboard reachable.
- Focus must remain visible.
- Critical meaning must not depend on color alone.
- Form controls must have accessible labels.

Constraints:
- Prefer semantic elements and design-system accessibility behavior.
- Do not remove accessibility behavior for visual convenience.
- Detailed technical implementation may live in `docs/FRONTEND.md`.
-->


## Motion and Animation

<!-- harness:placeholder
Purpose:
Define when motion should be used and what purpose it should serve.

Include when applicable:
- transitions
- entering and exiting content
- state changes
- loading feedback
- reduced-motion behavior

Constraints:
- Motion should communicate hierarchy, continuity, or feedback.
- Avoid animation that exists only for decoration when it slows interaction.
- Respect reduced-motion preferences.
- Keep common interaction transitions consistent.
-->


## Content and Microcopy

<!-- harness:placeholder
Purpose:
Define how interface text should communicate actions, state, and guidance.

Include:
- button labels
- headings
- field labels
- helper text
- validation messages
- confirmations
- empty-state copy

Example:
- Prefer action-oriented button labels such as "Create project" over vague labels such as "OK".
- Keep error messages specific and actionable.
- Use consistent terminology for the same product concept.

Constraints:
- Avoid unnecessary jargon.
- Do not introduce competing names for the same concept.
- Product positioning and broader product strategy belong in `docs/PRODUCT_SENSE.md`.
-->


## Design Consistency

<!-- harness:placeholder
Purpose:
Define how new work should preserve consistency with existing product patterns.

Include:
- reuse of existing components
- reuse of established interaction patterns
- semantic consistency
- terminology consistency
- when introducing a new pattern is justified

Example:
Before introducing a new UI pattern:
- check whether an existing component can satisfy the need
- check whether a similar interaction already exists
- prefer extending an established pattern when appropriate

Constraints:
- Consistency should not preserve a clearly harmful pattern indefinitely.
- Significant departures from established patterns should have an explicit reason.
-->


## Design Review Criteria

<!-- harness:placeholder
Purpose:
Define the checks required before significant UI/UX work may be considered complete.

Review when applicable:
- visual hierarchy is clear
- layout and spacing are consistent
- existing design-system components are reused where appropriate
- interaction behavior is predictable
- loading, empty, error, and success states are handled
- responsive behavior is verified
- keyboard and accessibility behavior are verified
- terminology and microcopy are consistent
- no unsupported design-system pattern was introduced

Example:
Before completing UI work:
- verify primary and secondary actions are visually distinct
- verify all major states have been designed
- verify responsive behavior at supported breakpoints
- verify interactive controls have appropriate focus behavior
- verify new patterns do not unnecessarily duplicate existing components

Constraints:
- Do not consider the happy path alone sufficient.
- Do not report design completion while required states or accessibility behavior are missing.
- Implementation-specific verification belongs in `docs/FRONTEND.md` and repository test commands.
-->