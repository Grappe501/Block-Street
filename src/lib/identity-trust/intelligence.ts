import {
  loadHumanIdentities,
  loadIntelligenceAlerts,
  loadSponsorRelationships,
  loadTrustInvitations,
  loadVerifications,
  persistIntelligenceAlerts,
} from "./data";
import type { IdentityIntelligenceAlert, IdentitySearchResult } from "./types";
import { itlId, nowIso } from "./utils";
import { assertWave1Foundation } from "./wave1/wave-prerequisite";
import { assertWave2Foundation } from "./wave2/engine";
import { assertWave3Foundation } from "./wave3/engine";
import { assertWave4Foundation, isWave4FoundationComplete } from "./wave4/engine";
import { searchFederationDirectory } from "./wave4/directory";
import { runIdentityIntelligenceScan } from "./wave5/detection";
import { listSignals, toLegacyAlert } from "./wave5/signals";
import { getAiIdentityRecommendation as wave5AiRecommendation } from "./wave5/ai-boundary";

function legacyGenerateIntelligence(): IdentityIntelligenceAlert[] {
  const alerts: IdentityIntelligenceAlert[] = [];
  const identities = loadHumanIdentities();
  const invitations = loadTrustInvitations();
  const verifications = loadVerifications();

  const nameMap = new Map<string, string[]>();
  for (const i of identities) {
    const key = i.public_name.toLowerCase().replace(/\s+/g, " ").trim();
    const list = nameMap.get(key) ?? [];
    list.push(i.user_id);
    nameMap.set(key, list);
  }
  for (const [name, userIds] of nameMap) {
    if (userIds.length > 1) {
      alerts.push({
        id: itlId("ialert"),
        alert_type: "duplicate_identity",
        severity: "warning",
        subject_user_ids: userIds,
        explanation: `Multiple identities share public name "${name}"`,
        ai_recommendation: "Open identity review for duplicate investigation. Human board must decide.",
        requires_human_action: true,
        created_at: nowIso(),
        status: "open",
      });
    }
  }

  const sponsorCounts = new Map<string, number>();
  for (const inv of invitations) {
    sponsorCounts.set(inv.sponsor_id, (sponsorCounts.get(inv.sponsor_id) ?? 0) + 1);
  }
  for (const [sponsorId, count] of sponsorCounts) {
    if (count >= 10) {
      alerts.push({
        id: itlId("ialert"),
        alert_type: "mass_invitation",
        severity: "critical",
        subject_user_ids: [sponsorId],
        explanation: `Sponsor ${sponsorId} sent ${count} invitations`,
        ai_recommendation: "Pause invite privileges and investigate invitation abuse pattern.",
        requires_human_action: true,
        created_at: nowIso(),
        status: "open",
      });
    }
  }

  const sponsorChains = loadSponsorRelationships();
  const sponsorGroups = new Map<string, string[]>();
  for (const rel of sponsorChains) {
    const list = sponsorGroups.get(rel.sponsor_id) ?? [];
    list.push(rel.sponsored_user_id);
    sponsorGroups.set(rel.sponsor_id, list);
  }
  for (const [sponsorId, sponsored] of sponsorGroups) {
    const unverified = sponsored.filter((uid) => {
      const v = verifications.filter((vr) => vr.subject_user_id === uid && vr.independent);
      return v.length === 0;
    });
    if (unverified.length >= 3) {
      alerts.push({
        id: itlId("ialert"),
        alert_type: "fraud_ring",
        severity: "warning",
        subject_user_ids: [sponsorId, ...unverified],
        explanation: `${unverified.length} unverified accounts from sponsor ${sponsorId}`,
        ai_recommendation: "Recommend identity review board investigation. Do not auto-restrict.",
        requires_human_action: true,
        created_at: nowIso(),
        status: "open",
      });
    }
  }

  for (const i of identities) {
    if (i.trust_label === "verified" || i.trust_label === "trusted") {
      const indep = verifications.filter((v) => v.subject_user_id === i.user_id && v.independent);
      if (indep.length === 0) {
        alerts.push({
          id: itlId("ialert"),
          alert_type: "trust_anomaly",
          severity: "info",
          subject_user_ids: [i.user_id],
          explanation: `${i.public_name} has trust level ${i.trust_label} without independent verification`,
          ai_recommendation: "Recalculate trust level or request verification.",
          requires_human_action: true,
          created_at: nowIso(),
          status: "open",
        });
      }
    }
  }

  const existing = loadIntelligenceAlerts();
  const merged = [...existing, ...alerts];
  persistIntelligenceAlerts(merged);
  return alerts;
}

/** AI may recommend — never approve or remove identities */
export function generateIdentityIntelligence(): IdentityIntelligenceAlert[] {
  assertWave1Foundation("Identity Intelligence (Wave 5)");
  assertWave2Foundation("Identity Intelligence (Wave 5)");
  assertWave3Foundation("Identity Intelligence (Wave 5)");
  if (isWave4FoundationComplete()) {
    assertWave4Foundation("Identity Intelligence (Wave 5)");
    const signals = runIdentityIntelligenceScan();
    return signals.map(toLegacyAlert);
  }
  return legacyGenerateIntelligence();
}

export function listIntelligenceAlerts(status?: IdentityIntelligenceAlert["status"]) {
  if (isWave4FoundationComplete()) {
    const signals = listSignals();
    const alerts = signals.map(toLegacyAlert);
    return status ? alerts.filter((a) => a.status === status) : alerts;
  }
  const all = loadIntelligenceAlerts();
  return status ? all.filter((a) => a.status === status) : all;
}

export function searchIdentities(query: string, options?: { purpose?: string; institution_id?: string; searcher_id?: string }): IdentitySearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  if (isWave4FoundationComplete() && options?.purpose) {
    return searchFederationDirectory({
      query: q,
      purpose: options.purpose,
      searching_human_id: options.searcher_id ?? "system",
      institution_id: options.institution_id ?? "default",
    }).map((r) => ({
      global_human_id: r.global_human_id,
      user_id: r.global_human_id,
      public_name: r.public_name,
      public_badge: r.public_badge,
      identity_status: "active" as const,
      institution_id: options.institution_id ?? null,
    }));
  }

  return loadHumanIdentities()
    .filter(
      (i) =>
        i.public_name.toLowerCase().includes(q) ||
        i.global_human_id.toLowerCase().includes(q) ||
        i.user_id.toLowerCase().includes(q) ||
        (i.preferred_name?.toLowerCase().includes(q) ?? false)
    )
    .map((i) => ({
      global_human_id: i.global_human_id,
      user_id: i.user_id,
      public_name: i.public_name,
      public_badge: i.public_badge,
      identity_status: i.identity_status,
      institution_id: i.institution_id,
    }));
}

export function getAiIdentityRecommendation(question: string): {
  answer: string;
  advisory_only: true;
  cannot_approve: true;
  cannot_remove: true;
} {
  return wave5AiRecommendation(question);
}

export { listSignals, runIdentityIntelligenceScan };
