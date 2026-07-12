import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { CANONICAL_EXECUTION_ENTITIES } from "./entity-registry";
import { EXECUTION_STORE_KEYS } from "./data-model";
import { getStateMachineDefinition } from "./state-machines";
import { getVersioningRules } from "./versioning";
import { getValidationRules } from "./data-validation";
import { getTraceabilityProtocol } from "./traceability";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/02_CANONICAL_MODEL_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_CANONICAL_MODEL.md",
  "docs/phase-11/11.2-objectives/MISSION_CANONICAL_MODEL.md",
  "docs/phase-11/11.2-objectives/TASK_CANONICAL_MODEL.md",
  "docs/phase-11/11.2-objectives/EVIDENCE_MODEL.md",
  "docs/phase-11/11.2-objectives/OUTCOME_MODEL.md",
  "docs/phase-11/11.2-objectives/EXECUTION_RELATIONSHIP_MATRIX.md",
  "docs/phase-11/11.2-objectives/OBJECT_VERSIONING_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECT_PERMISSION_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECT_EVENT_STANDARD.md",
  "docs/phase-11/11.2-objectives/TRACEABILITY_STANDARD.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_2_CERTIFICATION.md",
];

const REQUIRED_CONTRACTS = [
  "data/phase-11/objective_database_contract.json",
  "data/phase-11/objective_entity_schema.json",
  "data/phase-11/objective_state_machines.json",
  "data/phase-11/objective_event_catalog.json",
  "data/phase-11/objective_relationship_matrix.json",
];

export interface Protocol2Certification {
  protocol_id: "11.2-W2";
  build: "11.2";
  protocol_name: "Objective Canonical Data Model Protocol";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  service_enforcement: "planned_w3";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

export function runObjW2Certification(): Protocol2Certification {
  const registry = loadRequirementsRegistry();
  const w2Reqs = registry.requirements.filter((r) => r.build === "11.2" && r.wave === "W2");

  const dbContract = existsSync(join(ROOT, "data/phase-11/objective_database_contract.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/objective_database_contract.json"), "utf8"))
    : { tables: [] };

  const stateMachines = existsSync(join(ROOT, "data/phase-11/objective_state_machines.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/objective_state_machines.json"), "utf8"))
    : { entities: {} };

  const gates = [
    { id: "CAE-11.2-W2-G01", name: "Protocol documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} documents` },
    { id: "CAE-11.2-W2-G02", name: "JSON contracts", passed: REQUIRED_CONTRACTS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CONTRACTS.length} contracts` },
    { id: "CAE-11.2-W2-G03", name: "Canonical entity registry", passed: CANONICAL_EXECUTION_ENTITIES.length === 14, detail: `${CANONICAL_EXECUTION_ENTITIES.length} entities` },
    { id: "CAE-11.2-W2-G04", name: "Database tables defined", passed: (dbContract.tables?.length ?? 0) >= 14, detail: `${dbContract.tables?.length ?? 0} tables` },
    { id: "CAE-11.2-W2-G05", name: "Lifecycle state machines", passed: Object.keys(stateMachines.entities ?? {}).length >= 3, detail: "Objective, Mission, Task" },
    { id: "CAE-11.2-W2-G06", name: "Parent-child constraints", passed: (stateMachines.illegal_child_parent?.length ?? 0) >= 3, detail: "child cannot exceed parent" },
    { id: "CAE-11.2-W2-G07", name: "W2 requirements documented", passed: w2Reqs.length >= 22 && w2Reqs.every((r) => r.status === "documented"), detail: `${w2Reqs.length} requirements` },
    { id: "CAE-11.2-W2-G08", name: "Store key registry", passed: Object.keys(EXECUTION_STORE_KEYS).length >= 14, detail: `${Object.keys(EXECUTION_STORE_KEYS).length} keys` },
    { id: "CAE-11.2-W2-G09", name: "Versioning rules", passed: getVersioningRules().triggers.length >= 7, detail: `${getVersioningRules().triggers.length} triggers` },
    { id: "CAE-11.2-W2-G10", name: "Orphan work prohibited", passed: getValidationRules().orphan_work === "prohibited", detail: "validation rules" },
    { id: "CAE-11.2-W2-G11", name: "Traceability protocol", passed: getTraceabilityProtocol().upward_chain.length === 6, detail: "Task → Institution" },
    { id: "CAE-11.2-W2-G12", name: "Protocol architecture doc", passed: existsSync(join(ROOT, "docs/phase-11/PROTOCOL_ARCHITECTURE.md")), detail: "waves → protocols" },
  ];

  const docComplete = gates.filter((g) => g.id.startsWith("CAE-11.2-W2-G")).every((g) => g.passed);
  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.2-W2",
    build: "11.2",
    protocol_name: "Objective Canonical Data Model Protocol",
    certified_at: docComplete ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: docComplete,
    service_enforcement: "planned_w3",
    gates,
  };
}

export function getObjW2Overview() {
  return {
    data_model: EXECUTION_STORE_KEYS,
    entity_registry: CANONICAL_EXECUTION_ENTITIES,
    state_machines: getStateMachineDefinition(),
    versioning: getVersioningRules(),
    validation: getValidationRules(),
    traceability: getTraceabilityProtocol(),
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.2" && r.wave === "W2"),
    certification: runObjW2Certification(),
  };
}

export function isObjW2Complete(): boolean {
  return runObjW2Certification().documentation_complete;
}
