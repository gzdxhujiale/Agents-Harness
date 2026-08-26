export type Applicability = "required" | "recommended" | "optional" | "conditional" | "not_applicable";
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
  applicability?: Applicability;
  sections: SectionSchema[];
  rules?: { section_order?: "strict" | "none"; placeholder_forbidden?: boolean; minimum_meaningful_content?: number; required_patterns?: PatternRule[]; forbidden_patterns?: PatternRule[]; references?: ReferenceRule[] };
}
