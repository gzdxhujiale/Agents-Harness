import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { HarnessStatus, HarnessState, Inspection } from "../types.js";
import { exists, findProjectRoot } from "./paths.js";
import { validateAllDocuments } from "./validate.js";
export async function getHarnessStatus(from = process.cwd()): Promise<HarnessStatus> { const root = await findProjectRoot(from); const initialized = await exists(join(root, ".xxx/state.json")); if (!initialized) return { initialized, root, documentCount: 0 }; const state = JSON.parse(await readFile(join(root, ".xxx/state.json"), "utf8")) as HarnessState; const inspection = await exists(join(root, ".xxx/inspect.json")) ? JSON.parse(await readFile(join(root, ".xxx/inspect.json"), "utf8")) as Inspection : undefined; return { initialized, root, state, ...(inspection ? { inspection } : {}), documentCount: (await validateAllDocuments(root)).length }; }
