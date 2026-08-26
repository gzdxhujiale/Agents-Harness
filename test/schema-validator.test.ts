import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseMarkdown } from "../src/core/markdown/parser.js";
import { validateModel } from "../src/core/schema/validator.js";
import { loadSchemas } from "../src/core/schema/loader.js";
import { resolveSchema } from "../src/core/schema/resolver.js";
import type { DocumentSchema } from "../src/core/schema/types.js";

const schema: DocumentSchema = { id: "fixture", path: "fixture.md", applicability: "required", sections: [{ id: "one", title: "One", level: 2, required: true, non_empty: true, placeholder_forbidden: true }, { id: "two", title: "Two", level: 2, required: true, non_empty: true }], rules: { section_order: "strict", required_patterns: [{ pattern: "evidence" }], forbidden_patterns: [{ pattern: "forbidden" }], references: [{ path: "exists.txt" }] } };
describe("schema-driven Markdown validation", () => {
  it("normalizes AST content and links", () => { const model = parseMarkdown("# Title\n\n## One\nText [link](docs/a.md)\n\n```ts\nconst x = 1\n```"); expect(model.headings).toHaveLength(2); expect(model.sections[1]?.content).toContain("Text"); expect(model.links).toEqual(["docs/a.md"]); expect(model.codeBlocks).toHaveLength(1); });
  it("reports independent deterministic rule failures", async () => { const root = await mkdtemp(join(tmpdir(), "aiharness-")); try { await writeFile(join(root, "exists.txt"), ""); const issues = await validateModel(parseMarkdown("# Title\n\n## Two\nTODO\n\n## One\n<!-- harness:placeholder -->"), schema, root); expect(issues.map((item) => item.code)).toEqual(expect.arrayContaining(["SECTION_ORDER_INVALID", "PLACEHOLDER_REMAINING", "REQUIRED_PATTERN_MISSING", "SECTION_EMPTY"])); } finally { await rm(root, { recursive: true, force: true }); } });
  it("loads and resolves YAML schemas", async () => { const root = await mkdtemp(join(tmpdir(), "aiharness-")); try { await mkdir(join(root, "schemas")); await writeFile(join(root, "schemas", "x.yaml"), "id: x\npath: docs/X.md\nsections: []\n"); const schemas = await loadSchemas(join(root, "schemas")); expect(resolveSchema(schemas, join(root, "docs", "X.md"), root)?.id).toBe("x"); } finally { await rm(root, { recursive: true, force: true }); } });
});
