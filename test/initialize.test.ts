import { afterEach, describe, expect, it } from "vitest";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { initializeHarness, validateDocument } from "../src/index.js";

const directories: string[] = [];
afterEach(async () => { await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))); });
describe("initializeHarness", () => {
  it("creates the required non-empty templates without OpenSpec files", async () => { const root = await mkdtemp(join(tmpdir(), "aiharness-")); directories.push(root); const result = await initializeHarness(root); expect(result.files.filter((file) => file.status === "created")).not.toHaveLength(0); expect(await readFile(join(root, "AGENTS.md"), "utf8")).toMatch(/^# /); expect(await validateDocument(join(root, "ARCHITECTURE.md"))).toMatchObject({ valid: true }); await expect(access(join(root, "openspec"))).rejects.toThrow(); });
  it("does not overwrite existing user content", async () => { const root = await mkdtemp(join(tmpdir(), "aiharness-")); directories.push(root); await initializeHarness(root); await writeFile(join(root, "AGENTS.md"), "user content"); const result = await initializeHarness(root); expect(await readFile(join(root, "AGENTS.md"), "utf8")).toBe("user content"); expect(result.files.find((file) => file.path === "AGENTS.md")).toMatchObject({ status: "skipped" }); });
});
