#!/usr/bin/env node
import { Command } from "commander";
import { initializeHarness, inspectProject, getProjectContext, validateAllDocuments, validateDocument, getHarnessStatus } from "./index.js";

const program = new Command().name("AIharness").description("Repository-level AI development harness").version("1.0.1");
program.command("init [directory]").description("Initialize a harness in a project directory").action(async (directory: string | undefined) => { const result = await initializeHarness(directory); for (const file of result.files) console.log(`${file.status.padEnd(8)} ${file.path}`); });
program.command("inspect [directory]").description("Inspect a project and persist its facts").action(async (directory: string | undefined) => { console.log(JSON.stringify(await inspectProject(directory), null, 2)); });
program.command("context <domain> [directory]").description("Read documents for a project domain").action(async (domain: string, directory: string | undefined) => { const result = await getProjectContext(domain, directory); console.log(result.documents.map((document) => `# ${document.path}\n\n${document.content}`).join("\n\n")); });
program.command("validate [file]").description("Validate one managed document or all applicable managed documents").option("--json", "Write structured JSON to stdout").action(async (file: string | undefined, options: { json?: boolean }) => { const result = file ? [await validateDocument(file)] : await validateAllDocuments(); if (options.json) console.log(JSON.stringify(file ? result[0] : result, null, 2)); else for (const item of result) { console.log(`${item.valid ? "valid" : "invalid"} ${item.path}`); for (const issue of item.issues) console.log(`  ${issue.severity} ${issue.code ?? "VALIDATION"}: ${issue.message}`); } if (result.some((item) => !item.valid)) process.exitCode = 1; });
program.command("status [directory]").description("Show harness status").action(async (directory: string | undefined) => { console.log(JSON.stringify(await getHarnessStatus(directory), null, 2)); });
program.parseAsync().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
