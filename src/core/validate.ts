import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { ValidationIssue, ValidationResult } from "../types.js";
import { findProjectRoot, isDirectory } from "./paths.js";

const parser = unified().use(remarkParse);
type MarkdownNode = { type: string; depth?: number; value?: string };
type MarkdownRoot = { children: MarkdownNode[] };
function meaningful(node: MarkdownNode): boolean { return node.type !== "text" || (node.value?.trim().length ?? 0) > 0; }
export async function validateDocument(path: string): Promise<ValidationResult> {
  const text = await readFile(path, "utf8"); let tree: MarkdownRoot;
  try { tree = parser.parse(text); } catch (error) { return { path, valid: false, issues: [{ path, severity: "error", message: error instanceof Error ? error.message : "Unable to parse Markdown" }] }; }
  const issues: ValidationIssue[] = [];
  const headings = tree.children.filter((node): node is MarkdownNode & { depth: number } => node.type === "heading" && typeof node.depth === "number");
  if (!headings.length) issues.push({ path, severity: "error", message: "Document must contain at least one Markdown heading." });
  if (headings.length && headings[0]?.depth !== 1) issues.push({ path, severity: "error", message: "Document must begin with a level-1 heading." });
  for (let index = 1; index < headings.length; index++) if (headings[index]!.depth > headings[index - 1]!.depth + 1) issues.push({ path, severity: "error", message: "Heading levels cannot skip a level." });
  if (!tree.children.some(meaningful)) issues.push({ path, severity: "error", message: "Document must not be empty." });
  return { path, valid: !issues.some((issue) => issue.severity === "error"), issues };
}
async function markdownFiles(dir: string): Promise<string[]> { const entries = await readdir(dir, { withFileTypes: true }); const children = await Promise.all(entries.filter((entry) => entry.name !== "node_modules" && entry.name !== ".git").map((entry) => entry.isDirectory() ? markdownFiles(join(dir, entry.name)) : /\.md$/i.test(entry.name) ? [join(dir, entry.name)] : [])); return children.flat(); }
export async function validateAllDocuments(from = process.cwd()): Promise<ValidationResult[]> { const root = await findProjectRoot(from); return Promise.all((await markdownFiles(root)).map(validateDocument)); }
