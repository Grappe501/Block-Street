/**
 * CAE-11.6-W7 — Communications certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getCommunicationsConstitution, OPS_COMMUNICATIONS_PRINCIPLE, REQUIRED_COMMUNICATIONS_SERVICES } from "./constitution";
import { checkOpsW7Invariants, OPS_W7_INVARIANTS } from "./invariants";
import { allOpsW7TestsPassed, runOpsW7CommunicationsTests } from "./w7-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/07_COMMUNICATIONS_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/COMMUNICATIONS_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/CONVERSATION_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/DECISION_LEDGER.md",
  "docs/phase-11/11.6-institutional-operations/MEETING_WORKSPACE.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_7_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/communications_vocabulary.json",
  "data/phase-11/conversation_types.json",
  "data/phase-11/communication_channels.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/communications/constitution.ts",
  "src/lib/civic-action/builds/11.6/communications/w7.ts",
  "src/lib/civic-action/builds/11.6/communications/services/communications-service.ts",
  "src/app/api/v1/conversations/route.ts",
];

export interface Wave7Certification {
  wave_id: "11.6-W7";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Communications, Collaboration & Institutional Conversation Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW7Certification(): Wave7Certification {
  const constitution = getCommunicationsConstitution();
  const registry = loadRequirementsRegistry();
  const w7Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W7");
  const testResults = runOpsW7CommunicationsTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/communications_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/communications_vocabulary.json"), "utf8"))
    : { terms: [] };
  const types = existsSync(join(ROOT, "data/phase-11/conversation_types.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/conversation_types.json"), "utf8"))
    : { types: [] };
  const channels = existsSync(join(ROOT, "data/phase-11/communication_channels.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/communication_channels.json"), "utf8"))
    : { channels: [] };

  const gates = [
    { id: "CAE-11.6-W7-G01", name: "Communications principle", passed: constitution.governing_principle === OPS_COMMUNICATIONS_PRINCIPLE, detail: "conversations as assets" },
    { id: "CAE-11.6-W7-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W7-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + types + channels" },
    { id: "CAE-11.6-W7-G04", name: "Conversation types", passed: types.types?.length >= 15, detail: `${types.types?.length ?? 0} types` },
    { id: "CAE-11.6-W7-G05", name: "Communication channels", passed: channels.channels?.length >= 10, detail: `${channels.channels?.length ?? 0} channels` },
    { id: "CAE-11.6-W7-G06", name: "W7 requirements", passed: w7Reqs.length >= 30 && w7Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w7Reqs.length} requirements` },
    { id: "CAE-11.6-W7-G07", name: "Communications services", passed: REQUIRED_COMMUNICATIONS_SERVICES.length === 15, detail: REQUIRED_COMMUNICATIONS_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W7-G08", name: "Communications tests", passed: allOpsW7TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W7-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W7-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW7Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W7_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW7TestsPassed();

  return {
    wave_id: "11.6-W7",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Communications, Collaboration & Institutional Conversation Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW7Complete(): boolean {
  return runOpsW7Certification().all_passed;
}
