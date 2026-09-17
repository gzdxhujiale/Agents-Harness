---
name: harness-apply
description: Apply an approved Harness documentation proposal and keep every target document structurally valid.
---
# Harness Apply

## Workflow

1. Run `AIharness apply <change-name> --json`. Stop if it reports proposal errors.
2. Read the approved proposal and every target document before editing.
3. If a planned document is missing, run `AIharness init` to add only newly applicable templates; it does not overwrite existing content. Stop if the target remains inapplicable rather than creating a speculative document.
4. Update only the proposed managed documents. Preserve their schema headings and record repository-backed facts, limitations, and unknowns rather than guesses.
5. After each edit, run `AIharness validate <document> --json`; repair all errors before moving to the next document.
6. Finish with `AIharness verify <change-name> --json`.

## Completion

Do not report the documentation update complete while proposal or target-document verification is failing.
