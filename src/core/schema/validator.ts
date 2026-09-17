import { access } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";
import type { DocumentModel } from "../markdown/document-model.js";
import type { Capability, DocumentSchema, Severity } from "./types.js";
import type { ValidationIssue } from "../../types.js";
// A marker is intentionally explicit: ordinary Markdown comments remain valid documentation.
const managedPlaceholder = (comment: string) => /harness:placeholder/i.test(comment);
const meaningful = (content: string) => {
  const value = content.replace(/<!--[\s\S]*?-->/g, "").replace(/[`*_>#-]/g, "").trim();
  return value.length > 0 && !/^(todo|tbd|coming soon)$/i.test(value);
};
const issue = (out: ValidationIssue[], path: string, severity: Severity, code: string, message: string, section?: string, line?: number, rule?: string) => out.push({ path, severity, code, message, ...(section ? { section } : {}), ...(line ? { line } : {}), ...(rule ? { rule } : {}) });
const sectionEndLine = (model: DocumentModel, section: DocumentModel["sections"][number]) => model.headings.find((heading) => heading.level <= section.level && heading.line > section.line)?.line;
const nestedSections = (model: DocumentModel, parent: DocumentModel["sections"][number], title: string) => {
  const end = sectionEndLine(model, parent);
  return model.sections.filter((section) => section.text === title && section.line > parent.line && (!end || section.line < end));
};
const directContent = (model: DocumentModel, section: DocumentModel["sections"][number]) => {
  const lines = model.text.split(/\r?\n/);
  const end = sectionEndLine(model, section) ?? lines.length + 1;
  const child = model.headings.find((heading) => heading.level > section.level && heading.line > section.line && heading.line < end);
  return { text: lines.slice(section.line, (child?.line ?? end) - 1).join("\n"), startLine: section.line + 1 };
};
export async function validateModel(model: DocumentModel, schema: DocumentSchema, root: string, capabilities: Capability[] = []): Promise<ValidationIssue[]> {
  const out: ValidationIssue[] = [];
  for (const expected of schema.sections) {
    const sameTitle = model.sections.filter((section) => section.text === expected.title);
    const matches = expected.level ? sameTitle.filter((section) => section.level === expected.level) : sameTitle;
    const actual = matches[0] ?? sameTitle[0];
    if (expected.required && !actual) { issue(out, schema.path, "error", "REQUIRED_SECTION_MISSING", `Required section \"${expected.title}\" is missing.`, expected.title, undefined, "required-section"); continue; }
    if (!actual) continue;
    if (matches.length > 1) issue(out, schema.path, "error", "DUPLICATE_SECTION", `Section \"${expected.title}\" must appear only once.`, expected.title, actual.line, "unique-section");
    if (expected.level && actual.level !== expected.level) issue(out, schema.path, "error", "HEADING_LEVEL_INVALID", `Section \"${expected.title}\" must use heading level ${expected.level}.`, expected.title, actual.line, "heading-level");
    if (expected.non_empty && !meaningful(actual.content)) issue(out, schema.path, "error", "SECTION_EMPTY", `Section \"${expected.title}\" must contain meaningful content.`, expected.title, actual.line, "non-empty-section");
    if ((expected.placeholder_forbidden || schema.rules?.placeholder_forbidden) && actual.comments.some(managedPlaceholder)) issue(out, schema.path, "error", "PLACEHOLDER_REMAINING", "Initialization placeholder has not been replaced.", expected.title, actual.line, "placeholder");
    for (const title of expected.required_subsections ?? []) if (!model.sections.some((section) => section.text === title && section.line > actual.line)) issue(out, schema.path, "error", "REQUIRED_SUBSECTION_MISSING", `Required subsection \"${title}\" is missing.`, expected.title, actual.line, "required-subsection");
  }
  if (schema.rules?.section_order === "strict") { let last = -1; for (const section of schema.sections) { const current = model.sections.findIndex((item) => item.text === section.title && (!section.level || item.level === section.level)); if (current >= 0 && current < last) issue(out, schema.path, "error", "SECTION_ORDER_INVALID", `Section \"${section.title}\" is out of schema order.`, section.title, model.sections[current]?.line, "section-order"); if (current >= 0) last = current; } }
  for (const kind of ["required_patterns", "forbidden_patterns"] as const) for (const rule of schema.rules?.[kind] ?? []) { const found = new RegExp(rule.pattern, rule.flags).test(model.text); if ((kind === "required_patterns" && !found) || (kind === "forbidden_patterns" && found)) issue(out, schema.path, rule.severity ?? "error", rule.code ?? (kind === "required_patterns" ? "REQUIRED_PATTERN_MISSING" : "FORBIDDEN_PATTERN_FOUND"), rule.message ?? `Pattern validation failed: ${rule.pattern}`, rule.section, undefined, kind.replace("_patterns", "-pattern")); }
  const minimumContent = schema.rules?.minimum_meaningful_content;
  const documentContent = model.text.replace(/<!--[\s\S]*?-->/g, "").replace(/^\s*#{1,6}\s+.*$/gm, "").replace(/[`*_>#-]/g, "").trim();
  if (minimumContent !== undefined && documentContent.length < minimumContent) issue(out, schema.path, "error", "DOCUMENT_CONTENT_TOO_SHORT", `Document requires at least ${minimumContent} meaningful characters.`, undefined, undefined, "minimum-meaningful-content");
  for (const rule of schema.rules?.conditional_subsections ?? []) {
    if (!rule.when_any.some((capability) => capabilities.includes(capability))) continue;
    const parent = model.sections.find((section) => section.text === rule.parent);
    const matches = parent ? nestedSections(model, parent, rule.title) : [];
    const actual = matches[0];
    if (!actual) { issue(out, schema.path, "error", "CONDITIONAL_SUBSECTION_MISSING", `Section \"${rule.parent}\" must include \"${rule.title}\" when ${rule.when_any.join(", ")} is detected.`, rule.parent, parent?.line, "conditional-subsection"); continue; }
    if (matches.length > 1) issue(out, schema.path, "error", "DUPLICATE_SECTION", `Section \"${rule.title}\" must appear only once within \"${rule.parent}\".`, rule.parent, actual.line, "conditional-subsection");
    if (rule.level && actual.level !== rule.level) issue(out, schema.path, "error", "HEADING_LEVEL_INVALID", `Section \"${rule.title}\" must use heading level ${rule.level}.`, rule.parent, actual.line, "conditional-subsection");
    if (!meaningful(actual.content)) issue(out, schema.path, "error", "SECTION_EMPTY", `Section \"${rule.title}\" must contain meaningful content.`, rule.parent, actual.line, "conditional-subsection");
    for (const nestedRule of rule.required_subsections ?? []) {
      const nested = nestedSections(model, actual, nestedRule.title);
      const nestedActual = nested[0];
      if (!nestedActual) { issue(out, schema.path, "error", "CONDITIONAL_REQUIRED_SUBSECTION_MISSING", `Section \"${actual.text}\" must include \"${nestedRule.title}\".`, actual.text, actual.line, "conditional-required-subsection"); continue; }
      if (nested.length > 1) issue(out, schema.path, "error", "DUPLICATE_SECTION", `Section \"${nestedRule.title}\" must appear only once within \"${actual.text}\".`, actual.text, nestedActual.line, "conditional-required-subsection");
      if (nestedRule.level && nestedActual.level !== nestedRule.level) issue(out, schema.path, "error", "HEADING_LEVEL_INVALID", `Section \"${nestedRule.title}\" must use heading level ${nestedRule.level}.`, actual.text, nestedActual.line, "conditional-required-subsection");
      if (nestedRule.non_empty && !meaningful(nestedActual.content)) issue(out, schema.path, "error", "SECTION_EMPTY", `Section \"${nestedRule.title}\" must contain meaningful content.`, actual.text, nestedActual.line, "conditional-required-subsection");
    }
    if (rule.minimum_verified_path_entries !== undefined || rule.path_entries_require_responsibility) {
      const direct = directContent(model, actual);
      const entries = direct.text.split(/\r?\n/).flatMap((line, index) => {
        const match = /^\s*[-*+]\s+`([^`\r\n]+)`(?:\s+—\s*(.*))?\s*$/.exec(line);
        return match ? [{ path: match[1]?.trim() ?? "", responsibility: match[2]?.trim() ?? "", line: direct.startLine + index }] : [];
      });
      let verified = 0;
      for (const entry of entries) {
        const absolute = resolve(root, entry.path);
        const relativePath = relative(root, absolute);
        const insideRoot = relativePath !== "" && !relativePath.startsWith("..") && !isAbsolute(relativePath);
        if (!insideRoot || !(await existsAt(absolute))) issue(out, schema.path, "error", "BACKEND_PATH_UNVERIFIED", `Backend structure path \"${entry.path}\" does not exist within the repository.`, actual.text, entry.line, "verified-backend-path");
        else verified += 1;
        if (rule.path_entries_require_responsibility && !meaningful(entry.responsibility)) issue(out, schema.path, "error", "BACKEND_PATH_RESPONSIBILITY_MISSING", `Backend structure path \"${entry.path}\" must state its responsibility after an em dash.`, actual.text, entry.line, "backend-path-responsibility");
      }
      const minimum = rule.minimum_verified_path_entries ?? 0;
      if (verified < minimum) issue(out, schema.path, "error", "BACKEND_PATH_REFERENCE_MISSING", `Section \"${actual.text}\" requires at least ${minimum} verified backend path entr${minimum === 1 ? "y" : "ies"}.`, actual.text, actual.line, "verified-backend-path");
    }
  }
  for (const rule of schema.rules?.references ?? []) try { await access(join(root, rule.path)); } catch { issue(out, schema.path, rule.severity ?? "error", rule.code ?? "REFERENCE_MISSING", rule.message ?? `Required repository reference \"${rule.path}\" does not exist.`, undefined, undefined, "reference-exists"); }
  return out;
}

async function existsAt(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}
