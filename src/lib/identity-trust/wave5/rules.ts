import { itlId, nowIso } from "../utils";
import { loadDetectionRules, persistDetectionRules } from "./data";
import type { IdentityDetectionRule, SignalSeverity } from "./types";

const DEFAULT_RULES: Omit<IdentityDetectionRule, "id" | "effective_at">[] = [
  {
    rule_code: "INV-NO-LINEAGE",
    name: "Invitationless Human creation",
    description: "Human created without accepted invitation lineage",
    threat_type: "entry_integrity",
    default_severity: "SI-5",
    status: "active",
    version: "1.0",
  },
  {
    rule_code: "INV-VELOCITY",
    name: "Invitation velocity",
    description: "Sponsor exceeds expected invitation rate",
    threat_type: "invitation_integrity",
    default_severity: "SI-3",
    status: "active",
    version: "1.0",
  },
  {
    rule_code: "VER-RECIPROCAL-PAIR",
    name: "Reciprocal verification pair",
    description: "Two Humans verified each other",
    threat_type: "verification_integrity",
    default_severity: "SI-2",
    status: "active",
    version: "1.0",
  },
  {
    rule_code: "DUP-AUTH-PROVIDER",
    name: "Duplicate authentication provider",
    description: "Same auth provider subject linked to multiple Humans",
    threat_type: "human_uniqueness",
    default_severity: "SI-4",
    status: "active",
    version: "1.0",
  },
  {
    rule_code: "AUTH-TAKEOVER-POSSIBLE",
    name: "Possible account takeover",
    description: "Dormant account with sudden credential or invitation burst",
    threat_type: "authentication_integrity",
    default_severity: "SI-5",
    status: "active",
    version: "1.0",
  },
  {
    rule_code: "CTX-INSTITUTION-MISMATCH",
    name: "Institution context mismatch",
    description: "Action attempted outside active institution context",
    threat_type: "institution_context_integrity",
    default_severity: "SI-4",
    status: "active",
    version: "1.0",
  },
  {
    rule_code: "DUP-POSSIBLE-MATCH",
    name: "Possible duplicate Human",
    description: "Multiple identities share public name",
    threat_type: "human_uniqueness",
    default_severity: "SI-2",
    status: "active",
    version: "1.0",
  },
  {
    rule_code: "SPN-VELOCITY",
    name: "Sponsor velocity anomaly",
    description: "Sponsor sent unusually many invitations",
    threat_type: "sponsor_integrity",
    default_severity: "SI-3",
    status: "active",
    version: "1.0",
  },
];

export function ensureDefaultRules(): IdentityDetectionRule[] {
  const existing = loadDetectionRules();
  if (existing.length > 0) return existing;
  const rules = DEFAULT_RULES.map((r) => ({
    ...r,
    id: itlId("idr"),
    effective_at: nowIso(),
  }));
  persistDetectionRules(rules);
  return rules;
}

export function getRuleByCode(code: string): IdentityDetectionRule | undefined {
  return ensureDefaultRules().find((r) => r.rule_code === code);
}

export function listDetectionRules() {
  return ensureDefaultRules();
}

export function pauseDetectionRule(ruleId: string): IdentityDetectionRule {
  const rules = loadDetectionRules();
  const idx = rules.findIndex((r) => r.id === ruleId);
  if (idx < 0) throw new Error("Rule not found");
  rules[idx] = { ...rules[idx], status: "paused" };
  persistDetectionRules(rules);
  return rules[idx];
}

export function activateDetectionRule(ruleId: string): IdentityDetectionRule {
  const rules = loadDetectionRules();
  const idx = rules.findIndex((r) => r.id === ruleId);
  if (idx < 0) throw new Error("Rule not found");
  rules[idx] = { ...rules[idx], status: "active" };
  persistDetectionRules(rules);
  return rules[idx];
}

export const PROHIBITED_AUTOMATIC_ACTIONS = [
  "Do not restrict membership based solely on this signal.",
  "Do not merge Humans based solely on this signal.",
  "Do not revoke sponsor or verifier privileges based solely on this signal.",
  "Do not characterize this signal as confirmed fraud.",
  "Do not change identity assurance or trust state automatically.",
];

export function defaultSeverityPriority(severity: SignalSeverity): number {
  const map: Record<SignalSeverity, number> = { "SI-1": 1, "SI-2": 2, "SI-3": 3, "SI-4": 4, "SI-5": 5 };
  return map[severity];
}
