import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createProposal, exploreHarness, getApplyInstructions, initializeHarness, verifyChange } from "../src/index.js";

const roots: string[] = [];
const backendSections = ["Backend Overview", "Module Boundaries", "API and Input Handling", "Data and External Dependencies", "Background Processing", "Error Handling and Observability", "Security Boundaries", "Testing", "Backend Invariants"];
const validBackend = `# Backend Guide\n\n${backendSections.map((section) => `## ${section}\n\nVerified backend documentation for ${section}.`).join("\n\n")}`;
const validProposal = `# Documentation Change: refresh-backend-guide\n\n## Why\n\nThe backend guide needs to reflect verified runtime boundaries.\n\n## Scope\n\nDocument the stable backend architecture without changing application behavior.\n\n## Evidence\n\nThe repository source and package scripts establish the documented boundaries.\n\n## Document Updates\n\n### Document: docs/BACKEND.md\n\n- Change: Record the verified backend ownership and operational boundaries.\n- Evidence: Source modules and package configuration were inspected.\n- Validation: \`AIharness validate docs/BACKEND.md --json\`\n\n## Verification\n\nRun the Harness verifier after the document-level validation succeeds.\n`;

afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe("documentation change workflow", () => {
  it("explores without persisting inspection or editing documents", async () => {
    const root = await mkdtemp(join(tmpdir(), "aiharness-workflow-")); roots.push(root); await initializeHarness(root);
    const inspectionPath = join(root, ".aiharness", "inspect.json"); const before = await readFile(inspectionPath, "utf8");
    const result = await exploreHarness(root);
    expect(result.phase).toBe("explore"); expect(result.questions.length).toBeGreaterThan(0); expect(await readFile(inspectionPath, "utf8")).toBe(before);
  });

  it("blocks apply until a proposal is complete, then verifies every planned document", async () => {
    const root = await mkdtemp(join(tmpdir(), "aiharness-workflow-")); roots.push(root); await initializeHarness(root);
    await createProposal("refresh-backend-guide", ["docs/BACKEND.md"], root);
    await expect(getApplyInstructions("refresh-backend-guide", root)).resolves.toMatchObject({ valid: false, issues: expect.arrayContaining([expect.objectContaining({ code: "PLACEHOLDER_REMAINING" })]) });
    const changeRoot = join(root, ".aiharness", "changes", "refresh-backend-guide");
    await writeFile(join(changeRoot, "proposal.md"), validProposal, "utf8");
    await writeFile(join(root, "docs", "BACKEND.md"), validBackend, "utf8");
    await expect(getApplyInstructions("refresh-backend-guide", root)).resolves.toMatchObject({ valid: true, targetDocuments: ["docs/BACKEND.md"] });
    await expect(verifyChange("refresh-backend-guide", root)).resolves.toMatchObject({ valid: true, documents: [expect.objectContaining({ path: "docs/BACKEND.md", valid: true })] });
  });
});
