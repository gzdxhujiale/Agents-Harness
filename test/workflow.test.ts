import { afterEach, describe, expect, it } from "vitest";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  getHarnessStatus,
  initializeHarness,
  inspectProject,
  validateAllDocuments,
  validateDocument,
} from "../src/index.js";

const roots: string[] = [];
const backendSections = [
  "Backend Overview",
  "Module Boundaries",
  "API and Input Handling",
  "Data and External Dependencies",
  "Background Processing",
  "Error Handling and Observability",
  "Security Boundaries",
  "Testing",
  "Backend Invariants",
];
const validBackend = `# Backend Guide\n\n${backendSections
  .map((section) => `## ${section}\n\nVerified backend documentation for ${section}.`)
  .join("\n\n")}`;

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("simplified documentation workflow", () => {
  it("inspects dynamically without creating .aiharness or persisting inspection files", async () => {
    const root = await mkdtemp(join(tmpdir(), "aiharness-workflow-"));
    roots.push(root);
    await initializeHarness(root);

    const inspection = await inspectProject(root);
    expect(inspection.root).toBe(root);
    expect(inspection.scripts).toEqual([]);
    await expect(access(join(root, ".aiharness"))).rejects.toThrow();
  });

  it("supports direct document modification and schema validation without proposals", async () => {
    const root = await mkdtemp(join(tmpdir(), "aiharness-workflow-"));
    roots.push(root);
    await initializeHarness(root);

    const status = await getHarnessStatus(root);
    expect(status.initialized).toBe(true);

    // Provide server implementation so backend capability is detected
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "src", "server.ts"),
      "import { createServer } from 'node:http'; createServer(() => undefined).listen(3000);"
    );

    const backendPath = join(root, "docs", "BACKEND.md");
    await mkdir(join(root, "docs"), { recursive: true });
    await writeFile(backendPath, validBackend, "utf8");

    const validation = await validateDocument(backendPath, root);
    expect(validation.valid).toBe(true);
    expect(validation.issues.filter((issue) => issue.severity === "error")).toHaveLength(0);

    const allValidations = await validateAllDocuments(root);
    const backendResult = allValidations.find((v) => v.path === "docs/BACKEND.md");
    expect(backendResult?.valid).toBe(true);
  });
});
