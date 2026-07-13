/**
 * CAE-11.12-W8 — Gate evaluation helpers
 */
import type { CertificationGateResult } from "./contracts";
import type { CertificationGateDefinition } from "./certification-registry";
import type { KnowledgeCertificationSuiteResult } from "./certification-suite";
import type { TraceabilityCertificationResult } from "./traceability-certification";

type GateContext = {
  suite: KnowledgeCertificationSuiteResult;
  trace: TraceabilityCertificationResult;
  configOk: boolean;
  bootstrapOk: boolean;
  opsOk: boolean;
};

export function evaluateKnowledgeGateResults(
  gate: CertificationGateDefinition,
  ctx: GateContext
): CertificationGateResult {
  const evidence: string[] = [];
  let status: CertificationGateResult["status"] = "pass";
  let detail = "Gate passed";

  switch (gate.gate_id) {
    case "W8-G01": {
      const w1 = ctx.suite.waves.find((w) => w.wave === "W1");
      const ok = !!w1?.all_passed && ctx.suite.constitutional_checks.filter((c) => c.blocking).every((c) => c.status === "pass");
      status = ok ? "pass" : "fail";
      detail = ok ? "W1 certified; constitutional checks pass" : "Constitutional completeness incomplete";
      if (w1?.all_passed) evidence.push("W1 certification gates passed");
      break;
    }
    case "W8-G02": {
      const w2 = ctx.suite.waves.find((w) => w.wave === "W2");
      const ok = !!w2?.all_passed && ctx.bootstrapOk;
      status = ok ? "pass" : "fail";
      detail = ok ? "Canonical model and bootstrap ready" : "Canonical or migration integrity gaps";
      if (w2?.all_passed) evidence.push("W2 certification gates passed");
      if (ctx.bootstrapOk) evidence.push("Bootstrap artifacts validated");
      break;
    }
    case "W8-G03": {
      const w3 = ctx.suite.waves.find((w) => w.wave === "W3");
      const ok = !!w3?.all_passed;
      status = ok ? "pass" : "fail";
      detail = ok ? "Domain services certified" : "Domain workflow certification incomplete";
      if (ok) evidence.push("W3 domain command tests passed");
      break;
    }
    case "W8-G04": {
      const w5 = ctx.suite.waves.find((w) => w.wave === "W5");
      const ok = !!w5?.all_passed;
      status = ok ? "pass" : "fail";
      detail = ok ? "Authorization and API enforcement verified" : "Identity or isolation certification incomplete";
      if (w5?.all_passed) evidence.push("W5 API permission enforcement certified");
      break;
    }
    case "W8-G05": {
      const w4 = ctx.suite.waves.find((w) => w.wave === "W4");
      const ok = !!w4?.all_passed;
      status = ok ? "pass" : w4 ? "attention" : "fail";
      detail = ok ? "Human experience layer certified" : "UX, accessibility, or Spanish gaps remain";
      if (ok) evidence.push("W4 experience tests passed");
      break;
    }
    case "W8-G06": {
      const w5 = ctx.suite.waves.find((w) => w.wave === "W5");
      const ok = !!w5?.all_passed;
      status = ok ? "pass" : "fail";
      detail = ok ? "API and event integration certified" : "Integration certification incomplete";
      if (ok) evidence.push("W5 events and integrations certified");
      break;
    }
    case "W8-G07": {
      const w6 = ctx.suite.waves.find((w) => w.wave === "W6");
      const ok = !!w6?.all_passed;
      status = ok ? "pass" : "fail";
      detail = ok ? "AI intelligence remains advisory and grounded" : "AI or search safety gaps";
      if (ok) evidence.push("W6 intelligence governance certified");
      break;
    }
    case "W8-G08": {
      const w3 = ctx.suite.waves.find((w) => w.wave === "W3");
      const ok = !!w3?.all_passed;
      status = ok ? "pass" : "fail";
      detail = ok ? "Credential integrity boundaries verified" : "Assessment or certification integrity gaps";
      if (ok) evidence.push("Completion ≠ competency ≠ certification enforced");
      break;
    }
    case "W8-G09": {
      const ok = ctx.configOk && ctx.opsOk;
      status = ok ? "pass" : "fail";
      detail = ok ? "Security and privacy operations configured" : "Security or privacy configuration incomplete";
      if (ctx.configOk) evidence.push("Production configuration validated");
      if (ctx.opsOk) evidence.push("Backup, audit, and health checks configured");
      break;
    }
    case "W8-G10": {
      const w7 = ctx.suite.waves.find((w) => w.wave === "W7");
      const ok = !!w7?.all_passed && ctx.opsOk && ctx.suite.suite_passed;
      status = ok ? "pass" : ctx.suite.suite_passed ? "attention" : "fail";
      detail = ok ? "Recovery and launch readiness verified" : "Resilience or wave suite gaps remain";
      if (w7?.all_passed) evidence.push("W7 evolution governance certified");
      if (ctx.opsOk) evidence.push("Recovery rehearsal documented");
      break;
    }
    default:
      status = "attention";
      detail = "Unknown gate";
  }

  return {
    gate_id: gate.gate_id,
    domain: gate.domain,
    title: gate.title,
    status,
    severity: gate.severity,
    blocking: gate.severity === "critical" && status === "fail",
    evidence,
    detail,
  };
}
