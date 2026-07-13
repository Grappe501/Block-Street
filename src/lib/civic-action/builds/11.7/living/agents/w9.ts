/**
 * CAE-11.7-W9 — Multi-Agent certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getAgentConstitution, LIX_AGENT_PRINCIPLE, REQUIRED_AGENT_SERVICES } from "./constitution";
import { checkLixW9Invariants, LIX_W9_INVARIANTS } from "./invariants";
import { allLixW9TestsPassed, runLixW9CertificationTests } from "./w9-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/09_AI_MULTI_AGENT_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/AGENT_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_9_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/agents/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/agents/w9.ts",
  "src/lib/civic-action/builds/11.7/living/agents/services/agent-service.ts",
  "src/app/api/v1/localbrain/agents/route.ts",
];

export interface Wave9AgentCertification {
  wave_id: "11.7-W9";
  build: "11.7";
  subsystem: "LIX-009";
  name: "AI Multi-Agent Collaboration, Specialized Intelligence & Orchestration Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW9Certification(): Wave9AgentCertification {
  const constitution = getAgentConstitution();
  const registry = loadRequirementsRegistry();
  const w9Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W9");
  const testResults = runLixW9CertificationTests();

  const gates = [
    { id: "CAE-11.7-W9-G01", name: "Agent principle", passed: constitution.governing_principle === LIX_AGENT_PRINCIPLE, detail: "one coordinated answer" },
    { id: "CAE-11.7-W9-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W9-G03", name: "W9 requirements", passed: w9Reqs.length >= 25, detail: `${w9Reqs.length} requirements` },
    { id: "CAE-11.7-W9-G04", name: "Agent services", passed: REQUIRED_AGENT_SERVICES.length === 12, detail: REQUIRED_AGENT_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W9-G05", name: "Agent tests", passed: allLixW9TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W9-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW9Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W9_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW9TestsPassed();

  return {
    wave_id: "11.7-W9",
    build: "11.7",
    subsystem: "LIX-009",
    name: "AI Multi-Agent Collaboration, Specialized Intelligence & Orchestration Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW9Complete(): boolean {
  return runLixW9Certification().all_passed;
}
