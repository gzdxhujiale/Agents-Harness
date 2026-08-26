export type FileAction = "created" | "existing" | "skipped";

export interface FileResult { path: string; status: FileAction; }
export interface InitializeResult { root: string; files: FileResult[]; }
export interface Inspection { root: string; inspectedAt: string; packageManager?: string; packageName?: string; scripts: string[]; sourceDirectories: string[]; }
export interface ValidationIssue { path: string; message: string; severity: "error" | "warning"; }
export interface ValidationResult { path: string; valid: boolean; issues: ValidationIssue[]; }
export interface HarnessStatus { initialized: boolean; root: string; state?: HarnessState; inspection?: Inspection; documentCount: number; }
export interface HarnessState { version: 1; initializedAt: string; lastInspectedAt?: string; }
