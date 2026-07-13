/**
 * CAE-11.7-W2 — Communications Canonical Data Model certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { COMMUNICATION_STORE_KEYS } from "./data-model";
import {
  CONVERSATION_TRANSITIONS,
  DECISION_TRANSITIONS,
  DOCUMENT_TRANSITIONS,
  MEETING_TRANSITIONS,
} from "./state-machines";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-communications/02_CANONICAL_MODEL_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_STATE_MACHINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_EVENT_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_VERSIONING_GUIDE.md",
];

export interface Protocol2Certification {
  protocol_id: "11.7-W2";
  build: "11.7";
  subsystem: "COM-002";
  protocol_name: "Communications Canonical Data Model Protocol";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  service_enforcement: "planned_w3";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

export function runComW2Certification(): Protocol2Certification {
  const registry = loadRequirementsRegistry();
  const w2Reqs = registry.requirements.filter((r) => r.build === "11.7" && r.wave === "W2");

  const eventCatalog = existsSync(join(ROOT, "data/phase-11/communication_event_catalog.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/communication_event_catalog.json"), "utf8"))
    : { events: [] };

  const gates = [
    {
      id: "CAE-11.7-W2-G01",
      name: "Canonical model protocol",
      passed: existsSync(join(ROOT, "docs/phase-11/11.7-communications/02_CANONICAL_MODEL_PROTOCOL.md")),
      detail: "02_CANONICAL_MODEL_PROTOCOL.md",
    },
    {
      id: "CAE-11.7-W2-G02",
      name: "Model documentation spine",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} documents`,
    },
    {
      id: "CAE-11.7-W2-G03",
      name: "data-model.ts module",
      passed: existsSync(join(ROOT, "src/lib/civic-action/builds/11.7/data-model.ts")),
      detail: "TypeScript canonical model",
    },
    {
      id: "CAE-11.7-W2-G04",
      name: "Store key registry",
      passed: Object.keys(COMMUNICATION_STORE_KEYS).length >= 12,
      detail: `${Object.keys(COMMUNICATION_STORE_KEYS).length} keys`,
    },
    {
      id: "CAE-11.7-W2-G05",
      name: "Lifecycle state machines",
      passed:
        Object.keys(CONVERSATION_TRANSITIONS).length >= 5 &&
        Object.keys(DECISION_TRANSITIONS).length >= 4 &&
        Object.keys(MEETING_TRANSITIONS).length >= 6,
      detail: "Conversation, Decision, Document, Meeting",
    },
    {
      id: "CAE-11.7-W2-G06",
      name: "Document transitions",
      passed: Object.keys(DOCUMENT_TRANSITIONS).length >= 4,
      detail: "draft → published lifecycle",
    },
    {
      id: "CAE-11.7-W2-G07",
      name: "W2 requirements documented",
      passed: w2Reqs.length >= 10 && w2Reqs.every((r) => r.status === "documented"),
      detail: `${w2Reqs.length} requirements`,
    },
    {
      id: "CAE-11.7-W2-G08",
      name: "Event catalog",
      passed: (eventCatalog.events?.length ?? 0) >= 10,
      detail: `${eventCatalog.events?.length ?? 0} events`,
    },
    {
      id: "CAE-11.7-W2-G09",
      name: "state-machines.ts",
      passed: existsSync(join(ROOT, "src/lib/civic-action/builds/11.7/state-machines.ts")),
      detail: "transition registry",
    },
    {
      id: "CAE-11.7-W2-G10",
      name: "Version and history types",
      passed:
        existsSync(join(ROOT, "src/lib/civic-action/builds/11.7/data-model.ts")) &&
        readFileSync(join(ROOT, "src/lib/civic-action/builds/11.7/data-model.ts"), "utf8").includes(
          "CommunicationVersionRecord"
        ),
      detail: "audit/version records",
    },
    {
      id: "CAE-11.7-W2-G11",
      name: "Protocol architecture doc",
      passed: existsSync(join(ROOT, "docs/phase-11/PROTOCOL_ARCHITECTURE.md")),
      detail: "waves → protocols",
    },
    {
      id: "CAE-11.7-W2-G12",
      name: "Canonical identity principle",
      passed: readFileSync(join(ROOT, "docs/phase-11/11.7-communications/02_CANONICAL_MODEL_PROTOCOL.md"), "utf8")
        .toLowerCase()
        .includes("canonical identity"),
      detail: "permanent canonical IDs",
    },
  ];

  const docComplete = gates.every((g) => g.passed);
  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.7-W2",
    build: "11.7",
    subsystem: "COM-002",
    protocol_name: "Communications Canonical Data Model Protocol",
    certified_at: docComplete ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: docComplete,
    service_enforcement: "planned_w3",
    gates,
  };
}

export function isComW2Complete(): boolean {
  return runComW2Certification().documentation_complete;
}
