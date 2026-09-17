import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { DocumentModel } from "./markdown/document-model.js";
import { parseMarkdown } from "./markdown/parser.js";
import { inspectProject } from "./inspect.js";
import { getHarnessStatus } from "./status.js";
import { findProjectRoot, exists, resolveHarnessDirectory } from "./paths.js";
import { loadBundledSchemas } from "./schema/loader.js";
import { validateDocument } from "./validate.js";
import type { ValidationIssue, ValidationResult } from "../types.js";

const proposalTemplatePath = resolve(fileURLToPath(new URL("../../templates/workflow/proposal.md", import.meta.url)));
const changeNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const proposalSections = ["Why", "Scope", "Evidence", "Document Updates", "Verification"] as const;

export interface ExploreResult {
  phase: "explore";
  root: string;
  initialized: boolean;
  inspection: Awaited<ReturnType<typeof inspectProject>>;
  capabilities: string[];
  documents: { path: string; applicability: string; readiness: string; reasons: string[] }[];
  suggestedDocuments: string[];
  questions: string[];
  next: string;
}

export interface ProposalValidation extends ValidationResult {
  targetDocuments: string[];
}

export interface ProposalResult {
  change: string;
  proposalPath: string;
  targetDocuments: string[];
  created: boolean;
  next: string;
}

export interface ApplyInstructions {
  phase: "apply";
  change: string;
  proposalPath: string;
  targetDocuments: string[];
  valid: boolean;
  issues: ValidationIssue[];
  instructions: string[];
}

export interface VerifyResult {
  phase: "verify";
  change: string;
  valid: boolean;
  proposal: ProposalValidation;
  documents: ValidationResult[];
  issues: ValidationIssue[];
}

const contentIsMeaningful = (value: string): boolean => value.replace(/<!--[\s\S]*?-->/g, "").replace(/[`*_>#-]/g, "").trim().length > 0;
const proposalIssue = (message: string, code: string, section?: string, line?: number): ValidationIssue => ({ path: "proposal.md", severity: "error", code, message, ...(section ? { section } : {}), ...(line ? { line } : {}) });

function normalizeDocuments(value: string[]): string[] {
  const documents = value.map((document) => document.trim().replace(/\\/g, "/")).filter(Boolean);
  if (documents.length === 0) throw new Error("At least one managed document is required. Pass --documents AGENTS.md,ARCHITECTURE.md.");
  if (new Set(documents).size !== documents.length) throw new Error("Each target document may be listed only once.");
  return documents;
}

function assertChangeName(change: string): void {
  if (!changeNamePattern.test(change)) throw new Error("Change name must be kebab-case, for example: refresh-architecture-guide.");
}

async function changeDirectory(root: string, change: string): Promise<string> {
  assertChangeName(change);
  const harnessDirectory = await resolveHarnessDirectory(root);
  return join(root, harnessDirectory, "changes", change);
}

function firstSection(model: DocumentModel, title: string) {
  return model.sections.find((section) => section.text === title);
}

function updateSections(model: DocumentModel) {
  const updates = firstSection(model, "Document Updates");
  if (!updates) return [];
  const nextTopLevel = model.headings.find((heading) => heading.level === 2 && heading.line > updates.line);
  return model.sections.filter((section) => section.level === 3 && section.line > updates.line && (!nextTopLevel || section.line < nextTopLevel.line));
}

function labelHasValue(content: string, label: string): boolean {
  const match = content.match(new RegExp(`^\\s*-\\s+${label}:\\s*(.+)$`, "mi"));
  return match !== null && contentIsMeaningful(match[1] ?? "");
}

async function parseAndValidateProposal(root: string, change: string): Promise<ProposalValidation> {
  const directory = await changeDirectory(root, change);
  const proposalPath = join(directory, "proposal.md");
  if (!await exists(proposalPath)) {
    const issue = proposalIssue("Proposal does not exist. Run AIharness propose <change> --documents <paths> first.", "PROPOSAL_MISSING");
    return { path: relative(root, proposalPath).replace(/\\/g, "/"), schema: "harness-proposal", valid: false, issues: [issue], errors: [issue], warnings: [], targetDocuments: [] };
  }

  const model = parseMarkdown(await readFile(proposalPath, "utf8"));
  const issues: ValidationIssue[] = [];
  let lastIndex = -1;
  for (const title of proposalSections) {
    const sections = model.sections.filter((section) => section.text === title);
    const section = sections[0];
    if (!section) {
      issues.push(proposalIssue(`Required section \"${title}\" is missing.`, "REQUIRED_SECTION_MISSING", title));
      continue;
    }
    if (sections.length > 1) issues.push(proposalIssue(`Section \"${title}\" must appear only once.`, "DUPLICATE_SECTION", title, section.line));
    if (section.level !== 2) issues.push(proposalIssue(`Section \"${title}\" must use heading level 2.`, "HEADING_LEVEL_INVALID", title, section.line));
    const index = model.sections.indexOf(section);
    if (index < lastIndex) issues.push(proposalIssue(`Section \"${title}\" is out of workflow order.`, "SECTION_ORDER_INVALID", title, section.line));
    lastIndex = Math.max(lastIndex, index);
    if (title !== "Document Updates" && !contentIsMeaningful(section.content)) issues.push(proposalIssue(`Section \"${title}\" must contain meaningful content.`, "SECTION_EMPTY", title, section.line));
  }
  for (const comment of model.comments) if (/harness:placeholder/i.test(comment)) issues.push(proposalIssue("Initialization placeholder has not been replaced.", "PLACEHOLDER_REMAINING"));

  const schemas = await loadBundledSchemas();
  const knownDocuments = new Set(schemas.map((schema) => schema.path));
  const targetDocuments: string[] = [];
  const seenTargets = new Set<string>();
  for (const section of updateSections(model)) {
    const match = section.text.match(/^Document:\s+(.+)$/);
    if (!match) {
      issues.push(proposalIssue("Each update must use the heading `### Document: <managed path>`.", "DOCUMENT_HEADING_INVALID", "Document Updates", section.line));
      continue;
    }
    const document = (match[1] ?? "").trim().replace(/\\/g, "/");
    if (!knownDocuments.has(document)) {
      issues.push(proposalIssue(`\"${document}\" is not a managed document.`, "UNKNOWN_DOCUMENT", "Document Updates", section.line));
      continue;
    }
    if (seenTargets.has(document)) {
      issues.push(proposalIssue(`\"${document}\" is listed more than once.`, "DUPLICATE_TARGET_DOCUMENT", "Document Updates", section.line));
      continue;
    }
    seenTargets.add(document);
    targetDocuments.push(document);
    for (const label of ["Change", "Evidence", "Validation"]) if (!labelHasValue(section.content, label)) issues.push(proposalIssue(`Document update for \"${document}\" requires a meaningful \"${label}\" entry.`, "DOCUMENT_UPDATE_INCOMPLETE", "Document Updates", section.line));
    if (!new RegExp(`^\\s*-\\s+Validation:\\s*` + "`?" + `AIharness validate ${document.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} --json` + "`?\\s*$", "mi").test(section.content)) issues.push(proposalIssue(`Document update for \"${document}\" must validate with \`AIharness validate ${document} --json\`.`, "DOCUMENT_VALIDATION_COMMAND_INVALID", "Document Updates", section.line));
  }
  if (targetDocuments.length === 0) issues.push(proposalIssue("Document Updates must declare at least one managed document.", "TARGET_DOCUMENTS_MISSING", "Document Updates"));
  const errors = issues.filter((item) => item.severity === "error");
  return { path: relative(root, proposalPath).replace(/\\/g, "/"), document: "proposal.md", schema: "harness-proposal", valid: errors.length === 0, issues, errors, warnings: [], targetDocuments };
}

export async function exploreHarness(from = process.cwd()): Promise<ExploreResult> {
  const root = await findProjectRoot(from);
  const [inspection, status] = await Promise.all([inspectProject(root, { persist: false }), getHarnessStatus(root)]);
  const documents = (status.documents ?? []).map((document) => ({ path: document.path, applicability: document.applicability, readiness: document.readiness, reasons: document.reasons }));
  const suggestedDocuments = documents.filter((document) => ["required", "recommended"].includes(document.applicability) && document.readiness !== "not_applicable").map((document) => document.path);
  const questions = [
    "What durable repository fact, working convention, or architecture boundary needs to change?",
    "Which managed documents are authoritative for that fact, and which source files or configuration prove it?",
    "Which proposed updates require a user decision because the repository does not provide sufficient evidence?",
    ...(!status.initialized ? ["Should this repository be initialized with AIharness before applying documentation updates?"] : []),
  ];
  return { phase: "explore", root, initialized: status.initialized, inspection, capabilities: status.capabilities ?? [], documents, suggestedDocuments, questions, next: "After resolving the questions, run AIharness propose <change-name> --documents <comma-separated managed paths>." };
}

export async function createProposal(change: string, documents: string[], from = process.cwd()): Promise<ProposalResult> {
  assertChangeName(change);
  const root = await findProjectRoot(from);
  const targets = normalizeDocuments(documents);
  const schemas = await loadBundledSchemas();
  const knownDocuments = new Set(schemas.map((schema) => schema.path));
  for (const target of targets) if (!knownDocuments.has(target)) throw new Error(`\"${target}\" is not a managed document.`);
  const directory = await changeDirectory(root, change);
  const proposalPath = join(directory, "proposal.md");
  if (await exists(proposalPath)) throw new Error(`Proposal already exists for \"${change}\". Refusing to overwrite it.`);
  const template = await readFile(proposalTemplatePath, "utf8");
  const updates = targets.map((target) => `### Document: ${target}\n\n- Change: <!-- harness:placeholder Describe the durable documentation update. -->\n- Evidence: <!-- harness:placeholder Cite source files, configuration, or an explicit user decision. -->\n- Validation: \`AIharness validate ${target} --json\``).join("\n\n");
  const content = template.replace("{{CHANGE_NAME}}", change).replace("{{DOCUMENT_UPDATES}}", updates);
  await mkdir(directory, { recursive: true });
  await writeFile(proposalPath, content, "utf8");
  return { change, proposalPath: relative(root, proposalPath).replace(/\\/g, "/"), targetDocuments: targets, created: true, next: "Fill proposal.md from verified exploration evidence, then run AIharness apply <change-name> --json for the implementation instructions." };
}

export async function getApplyInstructions(change: string, from = process.cwd()): Promise<ApplyInstructions> {
  const root = await findProjectRoot(from);
  const proposal = await parseAndValidateProposal(root, change);
  return {
    phase: "apply",
    change,
    proposalPath: proposal.path,
    targetDocuments: proposal.targetDocuments,
    valid: proposal.valid,
    issues: proposal.issues,
    instructions: proposal.valid
      ? ["Read the approved proposal and every target document before editing.", "Update only the planned managed documents with repository-backed facts; do not turn assumptions into documentation.", "For each target, preserve its schema headings and replace initialization placeholders.", "Run AIharness validate <document> --json after each update and repair every error.", `Finish with AIharness verify ${change} --json.`]
      : ["Repair proposal.md before updating managed documents.", "Run AIharness apply <change-name> --json again after the proposal is valid."],
  };
}

export async function verifyChange(change: string, from = process.cwd()): Promise<VerifyResult> {
  const root = await findProjectRoot(from);
  const proposal = await parseAndValidateProposal(root, change);
  const documents = await Promise.all(proposal.targetDocuments.map((document) => validateDocument(document, root)));
  const issues = [...proposal.issues];
  for (const document of documents) {
    if (document.issues.some((issue) => issue.code === "DOCUMENT_MISSING")) issues.push({ path: document.path, severity: "error", code: "TARGET_DOCUMENT_MISSING", message: `Planned target document \"${document.path}\" does not exist.` });
    issues.push(...document.issues.filter((issue) => issue.severity === "error"));
  }
  return { phase: "verify", change, valid: issues.every((issue) => issue.severity !== "error"), proposal, documents, issues };
}

export async function validateProposal(change: string, from = process.cwd()): Promise<ProposalValidation> {
  return parseAndValidateProposal(await findProjectRoot(from), change);
}
