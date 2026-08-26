import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { initializeHarness, getHarnessStatus, validateAllDocuments } from "../src/index.js";
import { detectCapabilities } from "../src/core/applicability/detect.js";

const roots: string[] = [];
async function project(files: Record<string, string> = {}): Promise<string> { const root = await mkdtemp(join(tmpdir(), "aiharness-applicability-")); roots.push(root); await initializeHarness(root); for (const [path, content] of Object.entries(files)) { const target = join(root, path); await mkdir(join(target, ".."), { recursive: true }); await writeFile(target, content); } return root; }
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe("document applicability", () => {
  it("marks core templates pending in an empty initialized repository", async () => { const root = await project(); const results = await validateAllDocuments(root); const status = await getHarnessStatus(root); expect(results.map((result) => result.path)).toEqual(["AGENTS.md", "ARCHITECTURE.md"]); expect(status.documents?.find((item) => item.path === "AGENTS.md")?.readiness).toBe("pending"); expect(status.documents?.find((item) => item.path === "docs/FRONTEND.md")?.readiness).toBe("not_applicable"); });
  it("requires design and frontend documents when frontend source is detected", async () => { const root = await project({ "src/App.tsx": "import React from 'react'; export const App = () => <main />;" }); const status = await getHarnessStatus(root); expect(status.documents?.find((item) => item.path === "docs/DESIGN.md")?.applicability).toBe("required"); expect(status.documents?.find((item) => item.path === "docs/FRONTEND.md")?.applicability).toBe("required"); });
  it("recommends security and reliability documents for an API with environment configuration", async () => { const root = await project({ "src/server.ts": "import { createServer } from 'node:http'; const key = process.env.API_KEY; createServer((req) => req.url).listen(3000);" }); const status = await getHarnessStatus(root); expect(status.documents?.find((item) => item.path === "docs/SECURITY.md")?.applicability).toBe("recommended"); expect(status.documents?.find((item) => item.path === "docs/RELIABILITY.md")?.applicability).toBe("recommended"); });
  it("does not read .env content while detecting environment references", async () => { const root = await project({ ".env": "TOP_SECRET_VALUE=do-not-expose", "src/config.ts": "export const key = process.env.API_KEY;" }); const report = await detectCapabilities(root); expect(report.capabilities).toContain("secrets_configuration"); expect(JSON.stringify(report)).not.toContain("do-not-expose"); });
  it("reports stable capability reasons without forcing optional documents", async () => { const root = await project({ "src/jobs.ts": "export const worker = () => queue.add('task');" }); const status = await getHarnessStatus(root); expect(status.capabilities).toEqual(expect.arrayContaining(["background_jobs", "queue"])); expect(status.documents?.find((item) => item.path === "docs/RELIABILITY.md")?.reasons.length).toBeGreaterThan(0); expect(status.documents?.find((item) => item.path === "docs/QUALITY_SCORE.md")?.applicability).toBe("optional"); });
});
