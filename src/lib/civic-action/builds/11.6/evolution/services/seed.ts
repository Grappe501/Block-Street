/**
 * CAE-11.6-W16 — Seed evolution defaults
 */
import { nowIso } from "../../../../utils";
import { seedCertificationIfEmpty } from "../../certification/services/seed";
import { readStoreSlice } from "./repository";
import { EVOLUTION_STORE_KEYS } from "../data-model";
import { saveBuildGenome, saveCanon, saveEvolutionProposal, saveFutureBuild } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";

export function seedEvolutionIfEmpty() {
  seedCertificationIfEmpty();
  if (readStoreSlice(EVOLUTION_STORE_KEYS.proposals).length > 0) return false;

  saveEvolutionProposal({
    evolution_id: "evo-block-street-001",
    institution_id: INSTITUTION,
    proposal: "Extend CanonForge documentation sync to cover W16 APIs",
    reason: "Living documentation must include evolution endpoints",
    supporting_evidence: ["evd-block-street-001"],
    constitutional_impact: "none",
    affected_systems: ["documentation", "canonforge"],
    approval_status: "approved",
    reviewers: ["usr-001"],
    implementation_plan: "Add documentation sync service and API routes",
    created_at: NOW,
    approved_at: NOW,
  });

  saveCanon({
    canon_id: "canon-block-street-001",
    institution_id: INSTITUTION,
    version: "11.6-w16.1",
    version_type: "minor",
    layer: "constitution",
    subject: "Institutional Evolution Principle",
    content_ref: "evolution/constitution.ts",
    status: "published",
    traceability_refs: ["evo-block-street-001"],
    published_at: NOW,
    created_at: NOW,
    updated_at: NOW,
  });

  saveBuildGenome({
    genome_id: "genome-block-street-001",
    institution_id: INSTITUTION,
    architecture: ["W1-W16 operational waves", "CanonForge engine", "Four Brains"],
    schemas: ["evolution/data-model.ts", "certification/data-model.ts"],
    apis: ["/api/v1/canon", "/api/v1/evolution", "/api/v1/build-genome"],
    services: ["CanonForgeService", "EvolutionService", "DriftDetectionService"],
    events: ["canon.updated", "evolution.proposed", "drift.detected"],
    validation_rules: ["OPS-W16-INV-001", "OPS-W16-INV-003"],
    ui_contracts: ["Executive Evolution Dashboard"],
    integration_contracts: ["W1-W15 integration"],
    build_history: ["11.6-W1 through 11.6-W16"],
    platform_dna: {
      purpose: "Institutional Operating System for civic action",
      serves: "Campaigns, nonprofits, governments, schools, and federations",
      principles: ["Constitutional identity preserved", "Human governance over AI"],
      philosophy: "Self-improving, self-documenting, self-explaining",
      trust_model: "Evidence-based verification with explainable traceability",
    },
    updated_at: NOW,
  });

  saveFutureBuild({
    build_id: "fb-block-street-001",
    institution_id: INSTITUTION,
    category: "innovation",
    title: "Federation Evolution Standards",
    description: "Shared architecture evolution across federated institutions",
    priority: "high",
    status: "queued",
    queued_at: NOW,
  });

  return true;
}
