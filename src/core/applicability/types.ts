import type { Applicability, Capability } from "../schema/types.js";
export interface CapabilityReport { capabilities: Capability[]; reasons: Partial<Record<Capability, string[]>>; }
export interface DocumentApplicability { document: string; state: Exclude<Applicability, "conditional">; reasons: string[]; }
