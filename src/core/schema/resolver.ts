import { relative, resolve } from "node:path";
import type { DocumentSchema } from "./types.js";
export function resolveSchema(schemas: DocumentSchema[], file: string, root = process.cwd()): DocumentSchema | undefined {
  const normalized = relative(resolve(root), resolve(file)).replace(/\\/g, "/");
  return schemas.find((schema) => schema.path === normalized || schema.path === file.replace(/\\/g, "/"));
}
