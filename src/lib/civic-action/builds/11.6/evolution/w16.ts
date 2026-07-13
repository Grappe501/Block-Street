/**
 * CAE-11.6-W16 — Evolution certification module
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getEvolutionConstitution, OPS_EVOLUTION_PRINCIPLE, REQUIRED_EVOLUTION_SERVICES } from "./constitution";
import { checkOpsW16Invariants, OPS_W16_INVARIANTS } from "./invariants";
import { allOpsW16TestsPassed, runOpsW16CertificationTests } from "./w16-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/16_EVOLUTION_CANONFORGE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/EVOLUTION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/CANONFORGE_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/CONSTITUTION_LAYERS.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_16_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/evolution_vocabulary.json",
  "data/phase-11/canon_registry.json",
  "data/phase-11/build_genome_layers.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/evolution/constitution.ts",
  "src/lib/civic-action/builds/11.6/evolution/w16.ts",
  "src/lib/civic-action/builds/11.6/evolution/services/evolution-service.ts",
  "src/app/api/v1/evolution/route.ts",
];

export interface Wave16Certification {
  wave_id: "11.6-W16";
  build: "11.6";
  subsystem: "OPS-002";
  name: "Institutional Evolution, Self-Build, CanonForge & Next-Generation Operating System Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW16Certification(): Wave16Certification {
  const constitution = getEvolutionConstitution();
  const registry = loadRequirementsRegistry();
  const w16Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W16");
  const testResults = runOpsW16CertificationTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/evolution_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/evolution_vocabulary.json"), "utf8"))
    : { terms: [] };
  const canonRegistry = existsSync(join(ROOT, "data/phase-11/canon_registry.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/canon_registry.json"), "utf8"))
    : { objects: [] };
  const genomeLayers = existsSync(join(ROOT, "data/phase-11/build_genome_layers.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/build_genome_layers.json"), "utf8"))
    : { layers: [] };

  const gates = [
    { id: "CAE-11.6-W16-G01", name: "Evolution principle", passed: constitution.governing_principle === OPS_EVOLUTION_PRINCIPLE, detail: "constitutional identity preserved" },
    { id: "CAE-11.6-W16-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W16-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + registry + genome" },
    { id: "CAE-11.6-W16-G04", name: "Canon registry", passed: canonRegistry.objects?.length >= 14, detail: `${canonRegistry.objects?.length ?? 0} objects` },
    { id: "CAE-11.6-W16-G05", name: "Constitution layers", passed: genomeLayers.layers?.length >= 6, detail: `${genomeLayers.layers?.length ?? 0} layers` },
    { id: "CAE-11.6-W16-G06", name: "W16 requirements", passed: w16Reqs.length >= 30 && w16Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w16Reqs.length} requirements` },
    { id: "CAE-11.6-W16-G07", name: "Evolution services", passed: REQUIRED_EVOLUTION_SERVICES.length === 15, detail: REQUIRED_EVOLUTION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W16-G08", name: "Evolution tests", passed: allOpsW16TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W16-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W16-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW16Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W16_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW16TestsPassed();

  return {
    wave_id: "11.6-W16",
    build: "11.6",
    subsystem: "OPS-002",
    name: "Institutional Evolution, Self-Build, CanonForge & Next-Generation Operating System Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW16Complete(): boolean {
  return runOpsW16Certification().all_passed;
}
