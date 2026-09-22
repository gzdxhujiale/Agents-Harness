import { afterEach, describe, expect, it } from "vitest";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { initializeHarness, validateDocument } from "../src/index.js";

const directories: string[] = [];
afterEach(async () => { await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))); });
describe("initializeHarness", () => {
  it("creates only applicable templates with explicit initialization markers", async () => {
    const root = await mkdtemp(join(tmpdir(), "aiharness-"));
    directories.push(root);
    const result = await initializeHarness(root);
    expect(result.files.filter((file) => file.status === "created")).not.toHaveLength(0);
    expect(await readFile(join(root, "AGENTS.md"), "utf8")).toMatch(/^# /);
    await expect(access(join(root, ".aiharness"))).rejects.toThrow();
    await expect(access(join(root, ".agents", "skills", "harness-propose", "SKILL.md"))).rejects.toThrow();
    await expect(access(join(root, "docs", "BACKEND.md"))).rejects.toThrow();
    await expect(access(join(root, ".agents", "skills", "write-backend", "SKILL.md"))).rejects.toThrow();
    await expect(validateDocument(join(root, "ARCHITECTURE.md"))).resolves.toMatchObject({
      valid: false,
      issues: expect.arrayContaining([expect.objectContaining({ code: "PLACEHOLDER_REMAINING" })]),
    });
    await expect(access(join(root, "openspec"))).rejects.toThrow();
  });
  it("creates backend documentation only when backend capabilities exist", async () => { const root = await mkdtemp(join(tmpdir(), "aiharness-")); directories.push(root); await mkdir(join(root, "src"), { recursive: true }); await writeFile(join(root, "src", "server.ts"), "import { createServer } from 'node:http'; createServer(() => undefined).listen(3000);"); await initializeHarness(root); await expect(access(join(root, "docs", "BACKEND.md"))).resolves.toBeUndefined(); await expect(access(join(root, ".agents", "skills", "write-backend", "SKILL.md"))).resolves.toBeUndefined(); });
  it("does not overwrite existing user content", async () => { const root = await mkdtemp(join(tmpdir(), "aiharness-")); directories.push(root); await initializeHarness(root); await writeFile(join(root, "AGENTS.md"), "user content"); const result = await initializeHarness(root); expect(await readFile(join(root, "AGENTS.md"), "utf8")).toBe("user content"); expect(result.files.find((file) => file.path === "AGENTS.md")).toMatchObject({ status: "skipped" }); });
});
