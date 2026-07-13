/**
 * CAE-11.12-W2 — Knowledge Canonical Data Model certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { CANONICAL_KNOWLEDGE_ENTITIES } from "./entity-registry";
import { KNOWLEDGE_STORE_KEYS } from "./data-model";
import { getStateMachineDefinition } from "./state-machines";
import { getVersioningRules } from "./versioning";
import { getValidationRules } from "./data-validation";
import { getTraceabilityProtocol } from "./traceability";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.12-adaptive-learning/02_CANONICAL_MODEL_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_ENTITY_REGISTRY.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_ARTIFACT_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/CLAIM_SOURCE_CITATION_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_VERSIONING_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/COURSE_AND_LEARNING_OBJECT_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/SKILL_AND_COMPETENCY_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/ASSESSMENT_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/CERTIFICATION_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVENT_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_OVERLAP_AUDIT.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_2_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/WAVE_2_VALIDATION_PLAN.md",
];

const REQUIRED_CONTRACTS = [
  "data/phase-11/knowledge_database_contract.json",
  "data/phase-11/knowledge_entity_schema.json",
  "data/phase-11/knowledge_state_machines.json",
  "data/phase-11/knowledge_event_catalog.json",
  "data/phase-11/knowledge_relationship_matrix.json",
];

export interface Protocol2Certification {
  protocol_id: "11.12-W2";
  build: "11.12";
  subsystem: "ADP-001";
  protocol_name: "Knowledge Canonical Data Model Protocol";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  service_enforcement: "planned_w3";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

export function runKnwW2Certification(): Protocol2Certification {
  const registry = loadRequirementsRegistry();
  const w2Reqs = registry.requirements.filter((r) => r.build === "11.12" && r.wave === "W2");

  const dbContract = existsSync(join(ROOT, "data/phase-11/knowledge_database_contract.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/knowledge_database_contract.json"), "utf8"))
    : { tables: [] };

  const stateMachines = existsSync(join(ROOT, "data/phase-11/knowledge_state_machines.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/knowledge_state_machines.json"), "utf8"))
    : { entities: {} };

  const eventCatalog = existsSync(join(ROOT, "data/phase-11/knowledge_event_catalog.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/knowledge_event_catalog.json"), "utf8"))
    : { events: [] };

  const gates = [
    {
      id: "CAE-11.12-W2-G01",
      name: "Protocol documentation spine",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} documents`,
    },
    {
      id: "CAE-11.12-W2-G02",
      name: "JSON contracts",
      passed: REQUIRED_CONTRACTS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CONTRACTS.length} contracts`,
    },
    {
      id: "CAE-11.12-W2-G03",
      name: "Canonical entity registry",
      passed: CANONICAL_KNOWLEDGE_ENTITIES.length >= 50,
      detail: `${CANONICAL_KNOWLEDGE_ENTITIES.length} entities`,
    },
    {
      id: "CAE-11.12-W2-G04",
      name: "Database tables defined",
      passed: (dbContract.tables?.length ?? 0) >= 30,
      detail: `${dbContract.tables?.length ?? 0} tables`,
    },
    {
      id: "CAE-11.12-W2-G05",
      name: "Lifecycle state machines",
      passed: Object.keys(stateMachines.entities ?? {}).length >= 5,
      detail: "Artifact, Course, Certification, Competency, Claim",
    },
    {
      id: "CAE-11.12-W2-G06",
      name: "Parent-child constraints",
      passed: (stateMachines.illegal_child_parent?.length ?? 0) >= 3,
      detail: "child cannot exceed parent",
    },
    {
      id: "CAE-11.12-W2-G07",
      name: "W2 requirements documented",
      passed: w2Reqs.length >= 24 && w2Reqs.every((r) => r.status === "documented"),
      detail: `${w2Reqs.length} requirements`,
    },
    {
      id: "CAE-11.12-W2-G08",
      name: "Store key registry",
      passed: Object.keys(KNOWLEDGE_STORE_KEYS).length >= 40,
      detail: `${Object.keys(KNOWLEDGE_STORE_KEYS).length} keys`,
    },
    {
      id: "CAE-11.12-W2-G09",
      name: "Versioning rules",
      passed: getVersioningRules().triggers.length >= 8,
      detail: `${getVersioningRules().triggers.length} triggers`,
    },
    {
      id: "CAE-11.12-W2-G10",
      name: "Orphan knowledge prohibited",
      passed: getValidationRules().orphan_knowledge === "prohibited",
      detail: "validation rules",
    },
    {
      id: "CAE-11.12-W2-G11",
      name: "Traceability protocol",
      passed: getTraceabilityProtocol().upward_chain.length === 6,
      detail: "LearningObject → Institution",
    },
    {
      id: "CAE-11.12-W2-G12",
      name: "Knowledge event catalog",
      passed: (eventCatalog.events?.length ?? 0) >= 15,
      detail: `${eventCatalog.events?.length ?? 0} events`,
    },
  ];

  const docComplete = gates.filter((g) => g.id.startsWith("CAE-11.12-W2-G")).every((g) => g.passed);
  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.12-W2",
    build: "11.12",
    subsystem: "ADP-001",
    protocol_name: "Knowledge Canonical Data Model Protocol",
    certified_at: docComplete ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: docComplete,
    service_enforcement: "planned_w3",
    gates,
  };
}

export function getKnwW2Overview() {
  return {
    data_model: KNOWLEDGE_STORE_KEYS,
    entity_registry: CANONICAL_KNOWLEDGE_ENTITIES,
    state_machines: getStateMachineDefinition(),
    versioning: getVersioningRules(),
    validation: getValidationRules(),
    traceability: getTraceabilityProtocol(),
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.12" && r.wave === "W2"),
    certification: runKnwW2Certification(),
  };
}

export function isKnwW2Complete(): boolean {
  return runKnwW2Certification().documentation_complete;
}
