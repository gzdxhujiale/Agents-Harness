---
name: harness-verify
description: Verify the structure and target coverage of a Harness documentation change.
---
# Harness Verify

## Workflow

1. Run `AIharness verify <change-name> --json`.
2. Treat every error as a blocking failure. Proposal errors belong in `.aiharness/changes/<change-name>/proposal.md`; document errors belong in the named managed document.
3. Re-run the relevant proposal or apply workflow after repair.

## Scope

Verification proves proposal structure, target-document coverage, and managed-document schema conformance. It does not prove undocumented product or runtime claims; those must remain backed by the proposal's cited evidence.
