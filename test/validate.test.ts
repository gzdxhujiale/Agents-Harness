import { describe, expect, it } from "vitest";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateDocument } from "../src/index.js";
describe("validateDocument", () => { it("uses Markdown structure to reject skipped heading levels", async () => { const dir = await mkdtemp(join(tmpdir(), "aiharness-")); const file = join(dir, "doc.md"); await writeFile(file, "# Title\n\n### Skipped"); await expect(validateDocument(file)).resolves.toMatchObject({ valid: false }); await rm(dir, { recursive: true, force: true }); }); });
