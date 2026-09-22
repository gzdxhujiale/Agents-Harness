import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import type { Inspection } from "../types.js";
import { exists, findProjectRoot, isDirectory } from "./paths.js";

const packageSchema = z.object({ name: z.string().optional(), packageManager: z.string().optional(), scripts: z.record(z.string(), z.string()).optional() });
const commonSourceDirs = ["src", "app", "apps", "packages", "lib"];

export async function inspectProject(from = process.cwd(), _options: { persist?: boolean } = {}): Promise<Inspection> {
  const root = await findProjectRoot(from);
  let packageName: string | undefined; let packageManager: string | undefined; let scripts: string[] = [];
  const pkgPath = join(root, "package.json");
  if (await exists(pkgPath)) { const pkg = packageSchema.parse(JSON.parse(await readFile(pkgPath, "utf8"))); packageName = pkg.name; packageManager = pkg.packageManager; scripts = Object.keys(pkg.scripts ?? {}); }
  const sourceDirectories: string[] = [];
  for (const name of commonSourceDirs) if (await isDirectory(join(root, name))) sourceDirectories.push(name);
  return { root, inspectedAt: new Date().toISOString(), ...(packageName ? { packageName } : {}), ...(packageManager ? { packageManager } : {}), scripts, sourceDirectories };
}
