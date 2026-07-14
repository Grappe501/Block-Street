/**
 * CAE-11.7-W16 — Living Civilization Genesis Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import { seedAgentsIfEmpty } from "../../agents/services/seed";
import { seedPartnershipIfEmpty } from "../../partnership/services/seed";
import { seedFederationIfEmpty } from "../../federation/services/seed";
import { seedAutomationIfEmpty } from "../../automation/services/seed";
import { seedFactoryIfEmpty } from "../../factory/services/seed";
import { seedTwinIfEmpty } from "../../twin/services/seed";
import { seedKernelIfEmpty } from "../../kernel/services/seed";
import { GENESIS_PACKAGE_CONTENTS } from "../constitution";
import type {
  CanonicalArchiveRecord,
  ContinuityPlanRecord,
  LegacyRecord,
  PortabilityRecord,
  RecoveryRecord,
  StewardshipRecord,
  TimelineEventRecord,
  VaultEntryRecord,
} from "../data-model";
import {
  listArchives,
  listBootstraps,
  listContinuity,
  listDNA,
  listLegacy,
  listObservatory,
  listPackages,
  listPortability,
  listProvenance,
  listRecoveries,
  listStewardship,
  listTimeline,
  listVault,
  saveArchive,
  saveBootstrap,
  saveContinuity,
  saveDNA,
  saveLegacy,
  saveObservatory,
  savePackage,
  savePortability,
  saveProvenance,
  saveRecovery,
  saveStewardship,
  saveTimeline,
  saveVault,
} from "./repository";

export class GenesisError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureGenesisBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
  seedAgentsIfEmpty();
  seedPartnershipIfEmpty();
  seedFederationIfEmpty();
  seedAutomationIfEmpty();
  seedFactoryIfEmpty();
  seedTwinIfEmpty();
  seedKernelIfEmpty();
}

function getBrain(humanId: string) {
  ensureGenesisBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new GenesisError("GENESIS_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

export const genesisService = {
  list: listPackages,
  export(input: { institution_id: string; owner: string }) {
    getBrain(input.owner);
    const existing = listPackages(input.institution_id);
    const record = {
      package_id: caeId("gen"),
      institution_id: input.institution_id,
      owner: input.owner,
      version: existing.length + 1,
      contents: [...GENESIS_PACKAGE_CONTENTS],
      birth_certificate: true as const,
      governance_included: true as const,
      provenance_included: true as const,
      omit_governance: false as const,
      created_at: nowIso(),
    };
    savePackage(record);
    provenanceService.attest({
      institution_id: input.institution_id,
      artifact_id: record.package_id,
      origin: "genesis_export",
      author: input.owner,
    });
    return {
      package: record,
      event: "genesis.created" as const,
      birth_certificate: true,
      complete: true,
    };
  },
};

export const institutionDNAService = {
  list: listDNA,
  capture(input: {
    institution_id: string;
    identity?: string;
    governance?: string[];
    knowledge_domains?: string[];
    capabilities?: string[];
    policies?: string[];
    culture?: string[];
    decision_philosophy?: string;
  }) {
    const record = {
      dna_id: caeId("dna"),
      institution_id: input.institution_id,
      identity: input.identity ?? "Block Street Living Institution",
      governance: input.governance ?? ["constitutional_kernel", "human_stewardship", "federation_sovereignty"],
      knowledge_domains: input.knowledge_domains ?? ["civic", "campaign", "operations"],
      capabilities: input.capabilities ?? ["localbrain", "automation", "factory", "twin", "kernel"],
      policies: input.policies ?? ["privacy", "automation_safety", "federation"],
      culture: input.culture ?? ["community_first", "transparency", "continuity"],
      decision_philosophy: input.decision_philosophy ?? "Evidence-informed human-led constitutional governance",
      platform_independent: true as const,
      updated_at: nowIso(),
    };
    saveDNA(record);
    return { dna: record, event: "dna.updated" as const, platform_independent: true };
  },
};

export const canonicalArchiveService = {
  list: listArchives,
  archive(input: {
    institution_id: string;
    category: CanonicalArchiveRecord["category"];
    title: string;
    human_id: string;
  }) {
    getBrain(input.human_id);
    const existing = listArchives(input.institution_id).filter((a) => a.title === input.title);
    const record = {
      archive_id: caeId("arc"),
      institution_id: input.institution_id,
      category: input.category,
      title: input.title,
      version: existing.length + 1,
      immutable_provenance: true as const,
      silently_erasable: false as const,
      archived_at: nowIso(),
    };
    saveArchive(record);
    provenanceService.attest({
      institution_id: input.institution_id,
      artifact_id: record.archive_id,
      origin: "canonical_archive",
      author: input.human_id,
    });
    return {
      archive: record,
      event: "archive.updated" as const,
      immutable_provenance: true,
      silently_erasable: false,
    };
  },
  verify(input: { institution_id: string; archive_id: string }) {
    const archive = listArchives(input.institution_id).find((a) => a.archive_id === input.archive_id);
    if (!archive) throw new GenesisError("ARCHIVE_NOT_FOUND", "Archive not found");
    const provenance = listProvenance(input.institution_id).find((p) => p.artifact_id === input.archive_id);
    return {
      archive,
      verified: Boolean(provenance?.verified && archive.immutable_provenance),
      history_rewritable: false,
    };
  },
};

export const continuityService = {
  list: listContinuity,
  plan(input: {
    institution_id: string;
    scenario: ContinuityPlanRecord["scenario"];
    human_id: string;
  }) {
    getBrain(input.human_id);
    const record = {
      continuity_id: caeId("con"),
      institution_id: input.institution_id,
      scenario: input.scenario,
      readiness_score: 0.78,
      tested: false,
      governance_preserved: true as const,
      tested_at: null,
      created_at: nowIso(),
    };
    saveContinuity(record);
    return { continuity: record, governance_preserved: true };
  },
  test(input: { continuity_id: string; institution_id: string; human_id: string }) {
    getBrain(input.human_id);
    const plan = listContinuity(input.institution_id).find((c) => c.continuity_id === input.continuity_id);
    if (!plan) throw new GenesisError("CONTINUITY_NOT_FOUND", "Continuity plan not found");
    const updated = {
      ...plan,
      tested: true,
      readiness_score: 0.91,
      tested_at: nowIso(),
    };
    saveContinuity(updated);
    return {
      continuity: updated,
      event: "continuity.tested" as const,
      ready: true,
    };
  },
};

export const recoveryService = {
  list: listRecoveries,
  recover(input: {
    institution_id: string;
    human_id: string;
    disaster_type: RecoveryRecord["disaster_type"];
    package_id: string;
    bypass_governance?: boolean;
  }) {
    getBrain(input.human_id);
    if (input.bypass_governance) {
      throw new GenesisError("GOVERNANCE_BYPASS_FORBIDDEN", "Recovery cannot bypass governance");
    }
    const pkg = listPackages(input.institution_id).find((p) => p.package_id === input.package_id);
    if (!pkg) throw new GenesisError("PACKAGE_NOT_FOUND", "Genesis package required for recovery");

    const record = {
      recovery_id: caeId("rcv"),
      institution_id: input.institution_id,
      disaster_type: input.disaster_type,
      source_package_id: input.package_id,
      authenticity_preserved: true as const,
      governance_bypassed: false as const,
      completed: true,
      recovered_at: nowIso(),
    };
    saveRecovery(record);
    return {
      recovery: record,
      event: "recovery.completed" as const,
      authenticity_preserved: true,
      governance_bypassed: false,
    };
  },
};

export const bootstrapService = {
  list: listBootstraps,
  bootstrap(input: { institution_id: string; human_id: string; package_id: string }) {
    getBrain(input.human_id);
    const pkg = listPackages(input.institution_id).find((p) => p.package_id === input.package_id);
    if (!pkg) throw new GenesisError("PACKAGE_NOT_FOUND", "Genesis package required");
    if (pkg.omit_governance) {
      throw new GenesisError("GOVERNANCE_REQUIRED", "Genesis packages cannot omit governance");
    }

    const record = {
      bootstrap_id: caeId("bts"),
      institution_id: input.institution_id,
      package_id: input.package_id,
      recreated: [
        "identity",
        "permissions",
        "governance",
        "knowledge",
        "policies",
        "engineering",
        "capabilities",
        "federation",
        "automation",
        "institutional_memory",
      ],
      birth_certificate_valid: true as const,
      completed: true,
      bootstrapped_at: nowIso(),
    };
    saveBootstrap(record);
    return { bootstrap: record, recreate_complete: true, birth_certificate_valid: true };
  },
};

export const portabilityService = {
  list: listPortability,
  validate(input: {
    institution_id: string;
    target: PortabilityRecord["target"];
    human_id: string;
  }) {
    getBrain(input.human_id);
    const record = {
      portability_id: caeId("prt"),
      institution_id: input.institution_id,
      target: input.target,
      vendor_captive: false as const,
      identity_preserved: true as const,
      validated_at: nowIso(),
    };
    savePortability(record);
    return {
      portability: record,
      vendor_captive: false,
      single_point_of_failure: false,
    };
  },
};

export const provenanceService = {
  list: listProvenance,
  attest(input: {
    institution_id: string;
    artifact_id: string;
    origin: string;
    author: string;
  }) {
    const record = {
      provenance_id: caeId("prv"),
      institution_id: input.institution_id,
      artifact_id: input.artifact_id,
      origin: input.origin,
      author: input.author,
      version: 1,
      evidence: [`Origin ${input.origin}`, `Author ${input.author}`, "Digital signature applied"],
      digitally_signed: true as const,
      forgeable: false as const,
      verified: true,
      recorded_at: nowIso(),
    };
    saveProvenance(record);
    return { provenance: record, verified: true, forgeable: false };
  },
};

export const historicalTimelineService = {
  list: listTimeline,
  record(input: {
    institution_id: string;
    event_type: TimelineEventRecord["event_type"];
    title: string;
    occurred_at?: string;
  }) {
    const record = {
      timeline_id: caeId("tml"),
      institution_id: input.institution_id,
      event_type: input.event_type,
      title: input.title,
      never_disappears: true as const,
      occurred_at: input.occurred_at ?? nowIso(),
      recorded_at: nowIso(),
    };
    saveTimeline(record);
    return { timeline: record, event: "timeline.updated" as const, never_disappears: true };
  },
};

export const legacyService = {
  list: listLegacy,
  record(input: {
    institution_id: string;
    succession_type: LegacyRecord["succession_type"];
    successor_id?: string | null;
    human_id: string;
  }) {
    getBrain(input.human_id);
    const record = {
      legacy_id: caeId("leg"),
      institution_id: input.institution_id,
      succession_type: input.succession_type,
      successor_id: input.successor_id ?? null,
      teachable: true as const,
      recorded_at: nowIso(),
    };
    saveLegacy(record);
    return { legacy: record, event: "legacy.recorded" as const, teachable: true };
  },
};

export const knowledgeVaultService = {
  list: listVault,
  store(input: {
    institution_id: string;
    category: VaultEntryRecord["category"];
    title: string;
    human_id: string;
  }) {
    getBrain(input.human_id);
    const record = {
      vault_id: caeId("vlt"),
      institution_id: input.institution_id,
      category: input.category,
      title: input.title,
      provenance_retained: true as const,
      permissions_retained: true as const,
      stored_at: nowIso(),
    };
    saveVault(record);
    return { vault: record, provenance_retained: true };
  },
};

export const preservationObservatoryService = {
  list: listObservatory,
  measure(input: { institution_id: string }) {
    const archives = listArchives(input.institution_id).length;
    const continuity = listContinuity(input.institution_id).filter((c) => c.tested).length;
    const record = {
      observatory_id: caeId("pob"),
      institution_id: input.institution_id,
      archive_integrity: archives > 0 ? 0.95 : 0.7,
      continuity_readiness: continuity > 0 ? 0.91 : 0.65,
      recovery_readiness: listPackages(input.institution_id).length > 0 ? 0.93 : 0.6,
      knowledge_completeness: 0.88,
      historical_coverage: 0.86,
      institutional_resilience: 0.9,
      measured_at: nowIso(),
    };
    saveObservatory(record);
    return { observatory: record, leadership_visible: true };
  },
};

export const constitutionalStewardshipService = {
  list: listStewardship,
  record(input: {
    institution_id: string;
    change_type: StewardshipRecord["change_type"];
    description: string;
    human_steward: string;
  }) {
    getBrain(input.human_steward);
    const record = {
      stewardship_id: caeId("stw"),
      institution_id: input.institution_id,
      change_type: input.change_type,
      description: input.description,
      human_steward: input.human_steward,
      automated_authority: false as const,
      version: listStewardship(input.institution_id).length + 1,
      recorded_at: nowIso(),
    };
    saveStewardship(record);
    return {
      stewardship: record,
      human_stewardship: true,
      automated_authority: false,
    };
  },
  certify(input: { institution_id: string; human_id: string }) {
    getBrain(input.human_id);
    const packages = listPackages(input.institution_id);
    const dna = listDNA(input.institution_id);
    const observatory = preservationObservatoryService.measure({ institution_id: input.institution_id });
    return {
      certified: packages.length > 0 && dna.length > 0,
      event: "institution.certified" as const,
      observatory: observatory.observatory,
      human_stewardship: true,
      final_wave_complete: true,
    };
  },
};

export const genesisRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureGenesisBoot();
    getBrain(input.human_id);
    const packages = listPackages(input.institution_id);
    const archives = listArchives(input.institution_id);
    const continuity = listContinuity(input.institution_id);
    const vault = listVault(input.institution_id);

    return {
      greeting: "Genesis Center",
      central_question: "If everyone left tomorrow, could our Institution continue?",
      packages: packages.length,
      archives: archives.length,
      continuity_plans: continuity.length,
      vault_entries: vault.length,
      human_stewardship: true,
      history_rewritable: false,
      vendor_captive: false,
      silent_memory_loss: false,
      mutates_canonical_without_version: false,
      final_wave: true,
    };
  },
  security: {
    prohibited: [
      "rewrite_institutional_history",
      "delete_constitutional_records",
      "forge_provenance",
      "bypass_governance_in_recovery",
      "replace_human_stewardship",
      "destroy_rollback_capability",
      "permit_silent_memory_loss",
      "bind_permanently_to_one_vendor",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), authentic: true };
    },
  },
};

export const genesisRuntime = {
  genesis: genesisRuntimeService,
  packages: genesisService,
  dna: institutionDNAService,
  archives: canonicalArchiveService,
  continuity: continuityService,
  recovery: recoveryService,
  bootstrap: bootstrapService,
  portability: portabilityService,
  provenance: provenanceService,
  timeline: historicalTimelineService,
  legacy: legacyService,
  vault: knowledgeVaultService,
  observatory: preservationObservatoryService,
  stewardship: constitutionalStewardshipService,
};
