export type Applicability = "required" | "recommended" | "optional" | "conditional" | "not_applicable";
export type Capability = "frontend" | "server_api" | "authentication" | "external_input" | "secrets_configuration" | "sensitive_data" | "production_runtime" | "background_jobs" | "queue" | "external_dependency";
export interface ApplicabilityPolicy { when_any?: Capability[]; present: Exclude<Applicability, "conditional">; absent: Exclude<Applicability, "conditional">; }
export type Severity = "error" | "warning";

export interface SectionSchema {
  id: string;
  title: string;
  level?: number;
  required?: boolean;
  non_empty?: boolean;
  placeholder_forbidden?: boolean;
  required_subsections?: string[];
}
export interface PatternRule { pattern: string; flags?: string; message?: string; code?: string; severity?: Severity; section?: string; }
export interface ReferenceRule { path: string; message?: string; code?: string; severity?: Severity; }
export interface DocumentSchema {
  id: string;
  path: string;
  applicability?: Applicability | ApplicabilityPolicy;
  sections: SectionSchema[];
  rules?: { section_order?: "strict" | "none"; placeholder_forbidden?: boolean; minimum_meaningful_content?: number; required_patterns?: PatternRule[]; forbidden_patterns?: PatternRule[]; references?: ReferenceRule[] };
}
