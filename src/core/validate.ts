import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import type { ValidationResult } from "../types.js";
import { findProjectRoot, exists } from "./paths.js";
import { parseMarkdown } from "./markdown/parser.js";
import { loadBundledSchemas } from "./schema/loader.js";
import { resolveSchema } from "./schema/resolver.js";
import { validateModel } from "./schema/validator.js";

export async function validateDocument(path: string, from = process.cwd()): Promise<ValidationResult> {
  const root = await findProjectRoot(isAbsolute(path) ? path : from); const absolute = resolve(root, path); const schemas = await loadBundledSchemas(); const schema = resolveSchema(schemas, absolute, root);
  if (!schema) { const item = { path, severity: "error" as const, code: "UNKNOWN_DOCUMENT", message: "This is not a managed document." }; return { path, valid: false, issues: [item], errors: [item], warnings: [] }; }
  if (!(await exists(absolute))) { const item = { path: schema.path, severity: schema.applicability === "required" ? "error" as const : "warning" as const, code: "DOCUMENT_MISSING", message: "Managed document does not exist." }; return { path: schema.path, document: schema.path, schema: schema.id, applicability: schema.applicability ?? "required", valid: item.severity !== "error", issues: [item], errors: item.severity === "error" ? [item] : [], warnings: item.severity === "warning" ? [item] : [] }; }
  const issues = await validateModel(parseMarkdown(await readFile(absolute, "utf8")), schema, root); const errors = issues.filter((item) => item.severity === "error");
  return { path: schema.path, document: schema.path, schema: schema.id, applicability: schema.applicability ?? "required", valid: errors.length === 0, issues, errors, warnings: issues.filter((item) => item.severity === "warning") };
}
export async function validateAllDocuments(from = process.cwd()): Promise<ValidationResult[]> { const root = await findProjectRoot(from); const schemas = await loadBundledSchemas(); return Promise.all(schemas.filter((schema) => schema.applicability !== "not_applicable").map((schema) => validateDocument(join(root, schema.path), root))); }
