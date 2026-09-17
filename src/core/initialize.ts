import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { FileResult, HarnessState, InitializeResult } from "../types.js";
import { exists, resolveHarnessDirectory } from "./paths.js";
import { detectCapabilities } from "./applicability/detect.js";
import { resolveApplicability } from "./applicability/resolve.js";
import { loadBundledSchemas } from "./schema/loader.js";

const templateRoot = resolve(fileURLToPath(new URL("../../templates/default", import.meta.url)));
const bundledSkillRoot = resolve(fileURLToPath(new URL("../../.agents/skills", import.meta.url)));
const directoryTemplates = [
  ".agents/skills/bootstrap-docs/SKILL.md",
  ".agents/skills/write-agents/SKILL.md",
  ".agents/skills/write-architecture/SKILL.md",
  ".agents/skills/write-design/SKILL.md",
  ".agents/skills/write-security/SKILL.md",
  ".agents/skills/write-reliability/SKILL.md",
  ".agents/skills/write-frontend/SKILL.md",
  ".agents/skills/write-product-sense/SKILL.md",
  ".agents/skills/assess-quality/SKILL.md",
  ".agents/skills/harness-explore/SKILL.md",
  ".agents/skills/harness-propose/SKILL.md",
  ".agents/skills/harness-apply/SKILL.md",
  ".agents/skills/harness-verify/SKILL.md",
  ".agents/skills/write-backend/SKILL.md",
];
const alwaysInstalledSkills = directoryTemplates.filter((path) => path !== ".agents/skills/write-backend/SKILL.md");

async function templateFor(path: string): Promise<string> {
  if (path.startsWith(".agents/skills/")) return readFile(join(bundledSkillRoot, path.slice(".agents/skills/".length)), "utf8");
  return readFile(join(templateRoot, path), "utf8");
}

async function addTemplate(root: string, path: string, results: FileResult[]): Promise<void> {
  const target = join(root, path);
  if (await exists(target)) { results.push({ path, status: "skipped" }); return; }
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, await templateFor(path), "utf8");
  results.push({ path, status: "created" });
}

export async function initializeHarness(target = process.cwd()): Promise<InitializeResult> {
  const root = resolve(target);
  await mkdir(root, { recursive: true });
  const results: FileResult[] = [];
  const [schemas, capabilities] = await Promise.all([loadBundledSchemas(), detectCapabilities(root)]);
  const applicableDocuments = schemas.filter((schema) => ["required", "recommended"].includes(resolveApplicability(schema, capabilities).state)).map((schema) => schema.path);
  const backendApplicable = applicableDocuments.includes("docs/BACKEND.md");
  const skills = backendApplicable ? directoryTemplates : alwaysInstalledSkills;
  for (const path of [...applicableDocuments, ...skills]) await addTemplate(root, path, results);
  const harnessDirectory = await resolveHarnessDirectory(root);
  const emptyDirectories = [`${harnessDirectory}/changes`, "docs/product-specs", "docs/references", "docs/generated"];
  for (const path of emptyDirectories) {
    const target = join(root, path);
    const present = await exists(target);
    await mkdir(target, { recursive: true });
    results.push({ path, status: present ? "existing" : "created" });
  }
  const statePath = join(root, harnessDirectory, "state.json");
  if (await exists(statePath)) results.push({ path: `${harnessDirectory}/state.json`, status: "skipped" });
  else { const state: HarnessState = { version: 1, initializedAt: new Date().toISOString() }; await mkdir(dirname(statePath), { recursive: true }); await writeFile(statePath, JSON.stringify(state, null, 2) + "\n"); results.push({ path: `${harnessDirectory}/state.json`, status: "created" }); }
  const inspectPath = join(root, harnessDirectory, "inspect.json");
  if (await exists(inspectPath)) results.push({ path: `${harnessDirectory}/inspect.json`, status: "skipped" });
  else { await writeFile(inspectPath, JSON.stringify({ status: "not_inspected" }, null, 2) + "\n"); results.push({ path: `${harnessDirectory}/inspect.json`, status: "created" }); }
  return { root, files: results.map((entry) => ({ ...entry, path: relative(root, join(root, entry.path)) || entry.path })) };
}
