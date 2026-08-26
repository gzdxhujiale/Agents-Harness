import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { findProjectRoot } from "./paths.js";

const domains = z.enum(["architecture", "frontend", "security", "reliability", "product"]);
export type ContextDomain = z.infer<typeof domains>;
const documentByDomain: Record<ContextDomain, string[]> = { architecture: ["ARCHITECTURE.md", "docs/DESIGN.md"], frontend: ["docs/FRONTEND.md"], security: ["docs/SECURITY.md"], reliability: ["docs/RELIABILITY.md"], product: ["docs/PRODUCT_SENSE.md"] };
export async function getProjectContext(domain: string, from = process.cwd()): Promise<{ domain: ContextDomain; root: string; documents: { path: string; content: string }[] }> {
  const parsed = domains.parse(domain.toLowerCase()); const root = await findProjectRoot(from);
  const documents = await Promise.all(documentByDomain[parsed].map(async (path) => ({ path, content: await readFile(join(root, path), "utf8") })));
  return { domain: parsed, root, documents };
}
