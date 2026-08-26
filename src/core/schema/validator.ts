import { access } from "node:fs/promises";
import { join } from "node:path";
import type { DocumentModel } from "../markdown/document-model.js";
import type { DocumentSchema, Severity } from "./types.js";
import type { ValidationIssue } from "../../types.js";
// A marker is intentionally explicit: ordinary Markdown comments remain valid documentation.
const managedPlaceholder = (comment: string) => /harness:placeholder/i.test(comment);
const meaningful = (content: string) => {
  const value = content.replace(/<!--[\s\S]*?-->/g, "").replace(/[`*_>#-]/g, "").trim();
  return value.length > 0 && !/^(todo|tbd|coming soon)$/i.test(value);
};
const issue = (out: ValidationIssue[], path: string, severity: Severity, code: string, message: string, section?: string, line?: number, rule?: string) => out.push({ path, severity, code, message, ...(section ? { section } : {}), ...(line ? { line } : {}), ...(rule ? { rule } : {}) });
export async function validateModel(model: DocumentModel, schema: DocumentSchema, root: string): Promise<ValidationIssue[]> {
  const out: ValidationIssue[] = []; const byTitle = new Map(model.sections.map((section) => [section.text, section]));
  for (const expected of schema.sections) { const actual = byTitle.get(expected.title); if (expected.required && !actual) { issue(out, schema.path, "error", "REQUIRED_SECTION_MISSING", `Required section \"${expected.title}\" is missing.`, expected.title, undefined, "required-section"); continue; } if (!actual) continue; if (expected.level && actual.level !== expected.level) issue(out, schema.path, "error", "HEADING_LEVEL_INVALID", `Section \"${expected.title}\" must use heading level ${expected.level}.`, expected.title, actual.line, "heading-level"); if (expected.non_empty && !actual.comments.length && !meaningful(actual.content)) issue(out, schema.path, "error", "SECTION_EMPTY", `Section \"${expected.title}\" must contain meaningful content.`, expected.title, actual.line, "non-empty-section"); if (expected.placeholder_forbidden && actual.comments.some(managedPlaceholder)) issue(out, schema.path, "error", "PLACEHOLDER_REMAINING", "Initialization placeholder has not been replaced.", expected.title, actual.line, "placeholder"); for (const title of expected.required_subsections ?? []) if (!model.sections.some((section) => section.text === title && section.line > actual.line)) issue(out, schema.path, "error", "REQUIRED_SUBSECTION_MISSING", `Required subsection \"${title}\" is missing.`, expected.title, actual.line, "required-subsection"); }
  if (schema.rules?.section_order === "strict") { let last = -1; for (const section of schema.sections) { const current = model.sections.findIndex((item) => item.text === section.title); if (current >= 0 && current < last) issue(out, schema.path, "error", "SECTION_ORDER_INVALID", `Section \"${section.title}\" is out of schema order.`, section.title, model.sections[current]?.line, "section-order"); if (current >= 0) last = current; } }
  for (const kind of ["required_patterns", "forbidden_patterns"] as const) for (const rule of schema.rules?.[kind] ?? []) { const found = new RegExp(rule.pattern, rule.flags).test(model.text); if ((kind === "required_patterns" && !found) || (kind === "forbidden_patterns" && found)) issue(out, schema.path, rule.severity ?? "error", rule.code ?? (kind === "required_patterns" ? "REQUIRED_PATTERN_MISSING" : "FORBIDDEN_PATTERN_FOUND"), rule.message ?? `Pattern validation failed: ${rule.pattern}`, rule.section, undefined, kind.replace("_patterns", "-pattern")); }
  for (const rule of schema.rules?.references ?? []) try { await access(join(root, rule.path)); } catch { issue(out, schema.path, rule.severity ?? "error", rule.code ?? "REFERENCE_MISSING", rule.message ?? `Required repository reference \"${rule.path}\" does not exist.`, undefined, undefined, "reference-exists"); }
  return out;
}
