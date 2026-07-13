/**
 * CAE-11.12-W8 — Machine-readable certification gate registry
 */
import type { CertificationGateResult } from "./contracts";
import { runKnowledgeCertificationSuite } from "./certification-suite";
import { runKnowledgeTraceabilityCertification } from "./traceability-certification";
import { knowledgeConfigurationReady } from "./config-validation";
import { knowledgeBootstrapReady } from "./migration-bootstrap";
import { knowledgeOperationsReady } from "./operational-readiness";
import { evaluateKnowledgeGateResults } from "./gate-evaluators";

export type CertificationGateDefinition = {
  gate_id: string;
  domain: string;
  title: string;
  requirement_ids: string[];
  test_commands: string[];
  severity: "critical" | "high" | "medium" | "low";
  waiver_policy: "none" | "executive_approved" | "pilot_scope_only";
  recertification_trigger: string;
};

export const KNOWLEDGE_CERTIFICATION_GATE_REGISTRY: CertificationGateDefinition[] = [
  {
    gate_id: "W8-G01",
    domain: "constitutional",
    title: "Constitutional completeness",
    requirement_ids: ["CAE-11.12-W1-*"],
    test_commands: ["npm run phase11:11.12:w1"],
    severity: "critical",
    waiver_policy: "none",
    recertification_trigger: "constitutional_change",
  },
  {
    gate_id: "W8-G02",
    domain: "canonical_data",
    title: "Canonical and migration integrity",
    requirement_ids: ["CAE-11.12-W2-*", "CAE-11.12-W8-DAT-*"],
    test_commands: ["npm run phase11:11.12:w2", "knowledge:data:certify"],
    severity: "critical",
    waiver_policy: "none",
    recertification_trigger: "schema_migration",
  },
  {
    gate_id: "W8-G03",
    domain: "domain_authority",
    title: "Domain authority and workflows",
    requirement_ids: ["CAE-11.12-W3-*"],
    test_commands: ["npm run phase11:11.12:w3"],
    severity: "critical",
    waiver_policy: "none",
    recertification_trigger: "domain_command_change",
  },
  {
    gate_id: "W8-G04",
    domain: "identity_isolation",
    title: "Identity, invitation, and institution isolation",
    requirement_ids: ["CAE-11.12-W8-IDN-*"],
    test_commands: ["knowledge:identity:certify", "knowledge:institution-isolation:certify"],
    severity: "critical",
    waiver_policy: "none",
    recertification_trigger: "authorization_change",
  },
  {
    gate_id: "W8-G05",
    domain: "human_experience",
    title: "Human experience, accessibility, mobile, Spanish",
    requirement_ids: ["CAE-11.12-W4-*", "CAE-11.12-W8-UX-*"],
    test_commands: ["npm run phase11:11.12:w4", "knowledge:accessibility:certify", "knowledge:spanish:certify"],
    severity: "high",
    waiver_policy: "pilot_scope_only",
    recertification_trigger: "ux_change",
  },
  {
    gate_id: "W8-G06",
    domain: "integrations",
    title: "API, events, and integrations",
    requirement_ids: ["CAE-11.12-W5-*"],
    test_commands: ["npm run phase11:11.12:w5", "knowledge:integrations:certify"],
    severity: "critical",
    waiver_policy: "executive_approved",
    recertification_trigger: "contract_change",
  },
  {
    gate_id: "W8-G07",
    domain: "intelligence",
    title: "Search, retrieval, and AI safety",
    requirement_ids: ["CAE-11.12-W6-*", "CAE-11.12-W8-AI-*"],
    test_commands: ["npm run phase11:11.12:w6", "knowledge:ai:certify", "knowledge:search:certify"],
    severity: "critical",
    waiver_policy: "none",
    recertification_trigger: "ai_model_change",
  },
  {
    gate_id: "W8-G08",
    domain: "credentials",
    title: "Assessment, competency, and credential integrity",
    requirement_ids: ["CAE-11.12-W8-CRT-*"],
    test_commands: ["knowledge:credentials:certify"],
    severity: "critical",
    waiver_policy: "none",
    recertification_trigger: "credential_policy_change",
  },
  {
    gate_id: "W8-G09",
    domain: "security_privacy",
    title: "Security, privacy, retention, legal hold",
    requirement_ids: ["CAE-11.12-W8-SEC-*"],
    test_commands: ["knowledge:security:certify", "knowledge:privacy:certify"],
    severity: "critical",
    waiver_policy: "none",
    recertification_trigger: "security_incident",
  },
  {
    gate_id: "W8-G10",
    domain: "resilience",
    title: "Performance, recovery, and launch readiness",
    requirement_ids: ["CAE-11.12-W7-*", "CAE-11.12-W8-OPS-*"],
    test_commands: ["npm run phase11:11.12:w7", "knowledge:recovery:certify", "knowledge:performance:certify"],
    severity: "critical",
    waiver_policy: "executive_approved",
    recertification_trigger: "infrastructure_change",
  },
];

export function runKnowledgeCertificationGates(): CertificationGateResult[] {
  const suite = runKnowledgeCertificationSuite();
  const trace = runKnowledgeTraceabilityCertification();

  return KNOWLEDGE_CERTIFICATION_GATE_REGISTRY.map((gate) =>
    evaluateKnowledgeGateResults(gate, { suite, trace, configOk: knowledgeConfigurationReady(), bootstrapOk: knowledgeBootstrapReady(), opsOk: knowledgeOperationsReady() })
  );
}

export function criticalGatesPassed(): boolean {
  return runKnowledgeCertificationGates()
    .filter((g) => g.severity === "critical")
    .every((g) => g.status === "pass");
}
