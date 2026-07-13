/**
 * CAE-11.7-W6 — Conversation certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getConversationConstitution, LIX_CONVERSATION_PRINCIPLE, REQUIRED_CONVERSATION_SERVICES } from "./constitution";
import { checkLixW6Invariants, LIX_W6_INVARIANTS } from "./invariants";
import { allLixW6TestsPassed, runLixW6CertificationTests } from "./w6-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/06_AI_CONVERSATION_INTELLIGENCE_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/CONVERSATION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_6_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/conversation/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/conversation/w6.ts",
  "src/lib/civic-action/builds/11.7/living/conversation/services/conversation-service.ts",
  "src/app/api/v1/localbrain/conversations/route.ts",
];

export interface Wave6ConversationCertification {
  wave_id: "11.7-W6";
  build: "11.7";
  subsystem: "LIX-006";
  name: "AI Conversation Intelligence, Meeting Memory & Institutional Dialogue Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW6Certification(): Wave6ConversationCertification {
  const constitution = getConversationConstitution();
  const registry = loadRequirementsRegistry();
  const w6Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W6");
  const testResults = runLixW6CertificationTests();

  const gates = [
    { id: "CAE-11.7-W6-G01", name: "Conversation principle", passed: constitution.governing_principle === LIX_CONVERSATION_PRINCIPLE, detail: "humans authorize memory" },
    { id: "CAE-11.7-W6-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W6-G03", name: "W6 requirements", passed: w6Reqs.length >= 25, detail: `${w6Reqs.length} requirements` },
    { id: "CAE-11.7-W6-G04", name: "Conversation services", passed: REQUIRED_CONVERSATION_SERVICES.length === 13, detail: REQUIRED_CONVERSATION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W6-G05", name: "Conversation tests", passed: allLixW6TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W6-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW6Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W6_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW6TestsPassed();

  return {
    wave_id: "11.7-W6",
    build: "11.7",
    subsystem: "LIX-006",
    name: "AI Conversation Intelligence, Meeting Memory & Institutional Dialogue Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW6Complete(): boolean {
  return runLixW6Certification().all_passed;
}
