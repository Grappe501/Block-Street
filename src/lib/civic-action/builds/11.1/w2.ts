import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { listInitiatives } from "../../initiatives";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { validateAggregateIntegrity } from "./data-validation";
import { getStateMachineDefinition } from "./state-machine";
import { getVersioningRules } from "./versioning";
import { getValidationRules } from "./data-validation";
import { INITIATIVE_STORE_KEYS } from "./data-model";
import { projectLegacyInitiatives } from "./legacy-adapter";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/02_DATA_MODEL.md",
  "docs/phase-11/11.1-initiatives/ENTITY_RELATIONSHIP_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_DATABASE_CONTRACT.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_STATE_MACHINE.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_VERSIONING.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_AUDIT_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_DEPENDENCY_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_RETENTION_POLICY.md",
];

const REQUIRED_CONTRACTS = [
  "data/phase-11/initiative_database_contract.json",
  "data/phase-11/initiative_state_machine.json",
  "data/phase-11/initiative_entity_schema.json",
];

export interface Wave2Certification {
  wave_id: "11.1-W2";
  build: "11.1";
  name: "Initiative Canonical Data Model and Lifecycle Architecture";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  service_enforcement: "planned_w3";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

export function runIniW2Certification(): Wave2Certification {
  const registry = loadRequirementsRegistry();
  const w2Reqs = registry.requirements.filter((r) => r.build === "11.1" && r.wave === "W2");

  const stateMachine = JSON.parse(
    readFileSync(join(ROOT, "data/phase-11/initiative_state_machine.json"), "utf8")
  );
  const dbContract = JSON.parse(
    readFileSync(join(ROOT, "data/phase-11/initiative_database_contract.json"), "utf8")
  );

  const legacy = listInitiatives();
  const projected = projectLegacyInitiatives(legacy);
  const projectionValid = projected.every((a) => validateAggregateIntegrity(a).length === 0);

  const gates = [
    {
      id: "CAE-11.1-W2-G01",
      name: "W2 documentation spine",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} documents`,
    },
    {
      id: "CAE-11.1-W2-G02",
      name: "Database and entity contracts",
      passed: REQUIRED_CONTRACTS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CONTRACTS.length} JSON contracts`,
    },
    {
      id: "CAE-11.1-W2-G03",
      name: "Canonical entity tables defined",
      passed: (dbContract.tables?.length ?? 0) >= 10,
      detail: `${dbContract.tables?.length ?? 0} tables`,
    },
    {
      id: "CAE-11.1-W2-G04",
      name: "Lifecycle state machine",
      passed: (stateMachine.states?.length ?? 0) >= 13,
      detail: `${stateMachine.states?.length ?? 0} states`,
    },
    {
      id: "CAE-11.1-W2-G05",
      name: "Illegal transitions documented",
      passed: (stateMachine.illegal_transitions?.length ?? 0) >= 4,
      detail: `${stateMachine.illegal_transitions?.length ?? 0} illegal paths`,
    },
    {
      id: "CAE-11.1-W2-G06",
      name: "W2 requirements documented",
      passed: w2Reqs.length >= 20 && w2Reqs.every((r) => r.status === "documented"),
      detail: `${w2Reqs.length} requirements`,
    },
    {
      id: "CAE-11.1-W2-G07",
      name: "Store key registry",
      passed: Object.keys(INITIATIVE_STORE_KEYS).length >= 10,
      detail: `${Object.keys(INITIATIVE_STORE_KEYS).length} store keys`,
    },
    {
      id: "CAE-11.1-W2-G08",
      name: "Legacy projection validates",
      passed: legacy.length === 0 || projectionValid,
      detail: `${legacy.length} legacy → canonical projections`,
    },
    {
      id: "CAE-11.1-W2-G09",
      name: "Versioning rules",
      passed: getVersioningRules().triggers.length >= 7,
      detail: `${getVersioningRules().triggers.length} triggers`,
    },
    {
      id: "CAE-11.1-W2-G10",
      name: "Soft-delete policy",
      passed: getValidationRules().deletion === "soft_archive_only",
      detail: "no hard delete",
    },
  ];

  const docComplete = gates.filter((g) => g.id.startsWith("CAE-11.1-W2-G0")).every((g) => g.passed);
  const allPassed = gates.every((g) => g.passed);

  return {
    wave_id: "11.1-W2",
    build: "11.1",
    name: "Initiative Canonical Data Model and Lifecycle Architecture",
    certified_at: docComplete ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: docComplete,
    service_enforcement: "planned_w3",
    gates,
  };
}

export function getIniW2Overview() {
  return {
    data_model: INITIATIVE_STORE_KEYS,
    state_machine: getStateMachineDefinition(),
    versioning: getVersioningRules(),
    validation: getValidationRules(),
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.1" && r.wave === "W2"),
    certification: runIniW2Certification(),
    legacy_projection_count: listInitiatives().length,
  };
}

export function isIniW2Complete(): boolean {
  return runIniW2Certification().documentation_complete;
}
