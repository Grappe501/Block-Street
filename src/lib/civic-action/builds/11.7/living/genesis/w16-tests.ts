/**
 * CAE-11.7-W16 — Genesis tests
 */
import { genesisRuntime } from "./services/genesis-service";
import { seedGenesisIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import {
  GENESIS_PACKAGE_CONTENTS,
  getGenesisConstitution,
  LIX_GENESIS_PRINCIPLE,
  REQUIRED_GENESIS_SERVICES,
} from "./constitution";
import { checkLixW16Invariants } from "./invariants";
import { explainGenesisAction } from "./traceability";
import { GENESIS_EVENT_CATALOG } from "./events/catalog";

export type LixW16TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW16CertificationTests(): LixW16TestResult[] {
  seedGenesisIfEmpty();
  const results: LixW16TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getGenesisConstitution();
  results.push({ name: "genesis_principle", passed: constitution.governing_principle === LIX_GENESIS_PRINCIPLE });
  results.push({
    name: "genesis_package_contents",
    passed: GENESIS_PACKAGE_CONTENTS.length >= 10,
    detail: `${GENESIS_PACKAGE_CONTENTS.length} contents`,
  });
  results.push({
    name: "required_genesis_services",
    passed: REQUIRED_GENESIS_SERVICES.length === 13,
    detail: `${REQUIRED_GENESIS_SERVICES.length} services`,
  });
  results.push({ name: "w16_invariants", passed: checkLixW16Invariants().every((i) => i.passed) });
  results.push({
    name: "genesis_event_catalog",
    passed: GENESIS_EVENT_CATALOG.length >= 8,
    detail: `${GENESIS_EVENT_CATALOG.length} events`,
  });

  const dashboard = genesisRuntime.genesis.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "genesis_dashboard",
    passed: dashboard.human_stewardship === true && dashboard.final_wave === true,
    detail: dashboard.central_question,
  });

  const dna = genesisRuntime.dna.capture({
    institution_id: institutionId,
    identity: "Block Street Continuity DNA",
  });
  results.push({
    name: "institutional_dna",
    passed: dna.platform_independent === true && dna.event === "dna.updated",
    detail: dna.dna.dna_id,
  });

  const pkg = genesisRuntime.packages.export({
    institution_id: institutionId,
    owner: humanId,
  });
  results.push({
    name: "genesis_export",
    passed: pkg.birth_certificate === true && pkg.package.governance_included === true && pkg.package.omit_governance === false,
    detail: pkg.package.package_id,
  });

  const archive = genesisRuntime.archives.archive({
    institution_id: institutionId,
    category: "engineering",
    title: "Kernel Runtime Architecture",
    human_id: humanId,
  });
  results.push({
    name: "canonical_archive",
    passed: archive.immutable_provenance === true && archive.silently_erasable === false,
    detail: archive.archive.archive_id,
  });

  const verified = genesisRuntime.archives.verify({
    institution_id: institutionId,
    archive_id: archive.archive.archive_id,
  });
  results.push({
    name: "archive_verify",
    passed: verified.verified === true && verified.history_rewritable === false,
    detail: "verified",
  });

  const plan = genesisRuntime.continuity.plan({
    institution_id: institutionId,
    scenario: "cloud_migration",
    human_id: humanId,
  });
  results.push({
    name: "continuity_plan",
    passed: plan.governance_preserved === true,
    detail: plan.continuity.continuity_id,
  });

  const continuityTest = genesisRuntime.continuity.test({
    continuity_id: plan.continuity.continuity_id,
    institution_id: institutionId,
    human_id: humanId,
  });
  results.push({
    name: "continuity_test",
    passed: continuityTest.ready === true && continuityTest.event === "continuity.tested",
    detail: "tested",
  });

  let recoveryBypassBlocked = false;
  try {
    genesisRuntime.recovery.recover({
      institution_id: institutionId,
      human_id: humanId,
      disaster_type: "cloud_failure",
      package_id: pkg.package.package_id,
      bypass_governance: true,
    });
  } catch {
    recoveryBypassBlocked = true;
  }
  results.push({ name: "recovery_governance", passed: recoveryBypassBlocked, detail: "bypass blocked" });

  const recovery = genesisRuntime.recovery.recover({
    institution_id: institutionId,
    human_id: humanId,
    disaster_type: "infrastructure_loss",
    package_id: pkg.package.package_id,
  });
  results.push({
    name: "disaster_recovery",
    passed: recovery.authenticity_preserved === true && recovery.governance_bypassed === false,
    detail: recovery.recovery.recovery_id,
  });

  const bootstrap = genesisRuntime.bootstrap.bootstrap({
    institution_id: institutionId,
    human_id: humanId,
    package_id: pkg.package.package_id,
  });
  results.push({
    name: "institutional_bootstrap",
    passed: bootstrap.recreate_complete === true && bootstrap.birth_certificate_valid === true,
    detail: bootstrap.bootstrap.bootstrap_id,
  });

  const portability = genesisRuntime.portability.validate({
    institution_id: institutionId,
    target: "vendor_independent",
    human_id: humanId,
  });
  results.push({
    name: "portability",
    passed: portability.vendor_captive === false && portability.single_point_of_failure === false,
    detail: portability.portability.portability_id,
  });

  const provenance = genesisRuntime.provenance.attest({
    institution_id: institutionId,
    artifact_id: "artifact-demo-001",
    origin: "research",
    author: humanId,
  });
  results.push({
    name: "provenance",
    passed: provenance.verified === true && provenance.forgeable === false,
    detail: provenance.provenance.provenance_id,
  });

  const timeline = genesisRuntime.timeline.record({
    institution_id: institutionId,
    event_type: "capability",
    title: "Wave 16 Living Civilization Runtime completed",
  });
  results.push({
    name: "historical_timeline",
    passed: timeline.never_disappears === true,
    detail: timeline.timeline.timeline_id,
  });

  const legacy = genesisRuntime.legacy.record({
    institution_id: institutionId,
    succession_type: "succession_planning",
    successor_id: "usr-003",
    human_id: humanId,
  });
  results.push({
    name: "legacy_succession",
    passed: legacy.teachable === true && legacy.event === "legacy.recorded",
    detail: legacy.legacy.legacy_id,
  });

  const vault = genesisRuntime.vault.store({
    institution_id: institutionId,
    category: "operational_wisdom",
    title: "County immersion lessons learned",
    human_id: humanId,
  });
  results.push({
    name: "knowledge_vault",
    passed: vault.provenance_retained === true,
    detail: vault.vault.vault_id,
  });

  const observatory = genesisRuntime.observatory.measure({ institution_id: institutionId });
  results.push({
    name: "preservation_observatory",
    passed: observatory.leadership_visible === true && observatory.observatory.institutional_resilience > 0,
    detail: `${observatory.observatory.institutional_resilience}`,
  });

  const stewardship = genesisRuntime.stewardship.record({
    institution_id: institutionId,
    change_type: "reason",
    description: "Preserve continuity for generational stewardship",
    human_steward: humanId,
  });
  results.push({
    name: "constitutional_stewardship",
    passed: stewardship.human_stewardship === true && stewardship.automated_authority === false,
    detail: stewardship.stewardship.stewardship_id,
  });

  const certified = genesisRuntime.stewardship.certify({
    institution_id: institutionId,
    human_id: humanId,
  });
  results.push({
    name: "institution_certified",
    passed: certified.certified === true && certified.final_wave_complete === true,
    detail: certified.event,
  });

  const security = genesisRuntime.genesis.security.check("rewrite_institutional_history");
  results.push({ name: "preservation_security", passed: security.allowed === false, detail: "history protected" });

  const trace = explainGenesisAction({
    human_id: humanId,
    action_type: "genesis_export",
    package_id: pkg.package.package_id,
    institution_id: institutionId,
  });
  results.push({
    name: "genesis_traceability",
    passed: trace.includes("survive") || trace.includes("Continuity"),
    detail: "explainable",
  });

  results.push({
    name: "no_silent_memory_loss",
    passed: dashboard.silent_memory_loss === false && dashboard.history_rewritable === false,
    detail: "preserved",
  });

  return results;
}

export function allLixW16TestsPassed(): boolean {
  return runLixW16CertificationTests().every((t) => t.passed);
}
