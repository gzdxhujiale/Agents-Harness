export type FileAction = "created" | "existing" | "skipped";

export interface FileResult { path: string; status: FileAction; }
export interface InitializeResult { root: string; files: FileResult[]; }
export interface Inspection { root: string; inspectedAt: string; packageManager?: string; packageName?: string; scripts: string[]; sourceDirectories: string[]; }
export interface ValidationIssue { path: string; message: string; severity: "error" | "warning"; code?: string; section?: string; line?: number; rule?: string; }
export interface ValidationResult { path: string; document?: string; schema?: string; valid: boolean; issues: ValidationIssue[]; errors?: ValidationIssue[]; warnings?: ValidationIssue[]; applicability?: "required" | "recommended" | "optional" | "conditional" | "not_applicable"; }
export type DocumentReadiness = "pending" | "invalid" | "valid" | "optional" | "not_applicable";
export interface HarnessStatus { initialized: boolean; root: string; state?: HarnessState; inspection?: Inspection; documentCount: number; capabilities?: string[]; documents?: { path: string; applicability: string; reasons: string[]; readiness: DocumentReadiness; valid?: boolean }[]; }
export interface HarnessState { version: 1; initializedAt: string; lastInspectedAt?: string; }
