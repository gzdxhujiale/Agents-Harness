import { access, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join, resolve } from "node:path";

export const HARNESS_DIR = ".xxx";

export async function exists(path: string): Promise<boolean> {
  try { await access(path, constants.F_OK); return true; } catch { return false; }
}

export async function isDirectory(path: string): Promise<boolean> {
  try { return (await stat(path)).isDirectory(); } catch { return false; }
}

export async function findProjectRoot(from: string): Promise<string> {
  let current = resolve(from);
  if (!(await isDirectory(current))) current = dirname(current);
  while (true) {
    if (await exists(join(current, HARNESS_DIR)) || await exists(join(current, "package.json"))) return current;
    const parent = dirname(current);
    if (parent === current) return resolve(from);
    current = parent;
  }
}
