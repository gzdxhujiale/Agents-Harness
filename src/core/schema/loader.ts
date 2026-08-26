import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import type { DocumentSchema } from "./types.js";

export async function loadSchemas(directory = resolve(process.cwd(), "schemas")): Promise<DocumentSchema[]> {
  const names = (await readdir(directory)).filter((name) => /\.ya?ml$/i.test(name));
  return Promise.all(names.map(async (name) => parse(await readFile(join(directory, name), "utf8")) as DocumentSchema));
}
export async function loadBundledSchemas(): Promise<DocumentSchema[]> {
  const moduleDirectory = dirname(fileURLToPath(import.meta.url));
  for (const directory of [resolve(process.cwd(), "schemas"), resolve(moduleDirectory, "../../../schemas")]) {
    try { return await loadSchemas(directory); } catch { /* try next location */ }
  }
  throw new Error("Unable to locate bundled document schemas.");
}
