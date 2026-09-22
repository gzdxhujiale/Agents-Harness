import { access, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join, resolve } from "node:path";

export const HARNESS_DIR = ".aiharness";
export const LEGACY_HARNESS_DIR = ".xxx";

export async function exists(path: string): Promise<boolean> {
  try { await access(path, constants.F_OK); return true; } catch { return false; }
}

export async function isDirectory(path: string): Promise<boolean> {
  try { return (await stat(path)).isDirectory(); } catch { return false; }
}

/**
 * Keeps existing Harness repositories working while new projects use the
 * product-facing directory name. An initialized project never moves files as
 * a side effect of a read or update command.
 */
export async function resolveHarnessDirectory(root: string): Promise<string> {
  if (await isDirectory(join(root, HARNESS_DIR))) return HARNESS_DIR;
  if (await isDirectory(join(root, LEGACY_HARNESS_DIR))) return LEGACY_HARNESS_DIR;
  return HARNESS_DIR;
}

export async function findProjectRoot(from: string): Promise<string> {
  let current = resolve(from);
  if (!(await isDirectory(current))) current = dirname(current);
  while (true) {
    if (
      await exists(join(current, "AGENTS.md")) ||
      await exists(join(current, ".agents")) ||
      await exists(join(current, "package.json")) ||
      await exists(join(current, ".git")) ||
      await exists(join(current, HARNESS_DIR)) ||
      await exists(join(current, LEGACY_HARNESS_DIR))
    ) return current;
    const parent = dirname(current);
    if (parent === current) return resolve(from);
    current = parent;
  }
}
