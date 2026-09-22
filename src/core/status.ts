import { join } from "node:path";
import type { DocumentReadiness, HarnessStatus } from "../types.js";
import { exists, findProjectRoot } from "./paths.js";
import { validateAllDocuments } from "./validate.js";
import { loadBundledSchemas } from "./schema/loader.js";
import { detectCapabilities } from "./applicability/detect.js";
import { resolveApplicability } from "./applicability/resolve.js";

export async function getHarnessStatus(from = process.cwd()): Promise<HarnessStatus> {
  const root = await findProjectRoot(from);
  const initialized = (await exists(join(root, "AGENTS.md"))) || (await exists(join(root, ".agents")));
  const [schemas, capabilities, validations] = await Promise.all([
    loadBundledSchemas(),
    detectCapabilities(root),
    validateAllDocuments(root),
  ]);
  const validationByPath = new Map(validations.map((result) => [result.path, result]));
  const documents = schemas.map((schema) => {
    const item = resolveApplicability(schema, capabilities);
    const validation = validationByPath.get(schema.path);
    const onlyInitializationIssues =
      validation &&
      validation.issues.length > 0 &&
      validation.issues.every((issue) => issue.code === "PLACEHOLDER_REMAINING" || issue.code === "SECTION_EMPTY");
    const missing = validation?.issues.some((issue) => issue.code === "DOCUMENT_MISSING") ?? false;
    const readiness: DocumentReadiness =
      item.state === "not_applicable"
        ? "not_applicable"
        : item.state === "optional"
        ? "optional"
        : !validation || onlyInitializationIssues || missing
        ? "pending"
        : validation.valid
        ? "valid"
        : "invalid";
    return {
      path: schema.path,
      applicability: item.state,
      reasons: item.reasons,
      readiness,
      ...(validation ? { valid: validation.valid } : {}),
    };
  });
  return {
    initialized,
    root,
    documentCount: validations.length,
    capabilities: capabilities.capabilities,
    documents,
  };
}
