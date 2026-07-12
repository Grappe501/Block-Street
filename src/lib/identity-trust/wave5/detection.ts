import {
  loadHumanIdentities,
  loadSponsorRelationships,
  loadTrustInvitations,
  loadVerifications,
} from "../data";
import { ingestIntelligenceEvent } from "./events";
import { createSignal } from "./signals";
import { routeSignalReferral } from "./referrals";
import { ensureDefaultRules } from "./rules";
import type { IdentityIntelligenceSignal } from "./types";
import { loadWave5Flags } from "./data";

export function runIdentityIntelligenceScan(): IdentityIntelligenceSignal[] {
  const flags = loadWave5Flags();
  if (!flags.IDENTITY_INTELLIGENCE_ENABLED) return [];

  ensureDefaultRules();
  const generated: IdentityIntelligenceSignal[] = [];
  const identities = loadHumanIdentities();
  const invitations = loadTrustInvitations();
  const verifications = loadVerifications();
  const sponsors = loadSponsorRelationships();

  // Duplicate name detection — weak signal only
  if (flags.IDENTITY_DUPLICATE_DETECTION_ENABLED) {
    const nameMap = new Map<string, string[]>();
    for (const i of identities) {
      const key = i.public_name.toLowerCase().replace(/\s+/g, " ").trim();
      const list = nameMap.get(key) ?? [];
      list.push(i.user_id);
      nameMap.set(key, list);
    }
    for (const [name, userIds] of nameMap) {
      if (userIds.length > 1) {
        ingestIntelligenceEvent({
          event_type: "duplicate_candidate",
          related_human_ids: userIds,
          source_system: "identity_trust",
          event_features: { public_name: name, count: userIds.length },
        });
        const signal = createSignal({
          signal_code: "DUP-POSSIBLE-MATCH",
          signal_type: "human_uniqueness",
          subject_human_ids: userIds,
          severity: "SI-2",
          confidence: "low",
          summary: `Multiple identities share public name "${name}"`,
          supporting_features: [`${userIds.length} Humans with matching public name`],
          countervailing_features: ["Common names may be legitimately shared", "Name alone cannot establish duplicate"],
          known_limitations: ["Signal does not establish that accounts are controlled by one person"],
          rule_code: "DUP-POSSIBLE-MATCH",
        });
        generated.push(signal);
        if (flags.IDENTITY_SIGNAL_REFERRALS_ENABLED) routeSignalReferral(signal);
      }
    }
  }

  // Invitation velocity
  if (flags.IDENTITY_INVITATION_INTEGRITY_DETECTION_ENABLED || flags.IDENTITY_SPONSOR_INTEGRITY_DETECTION_ENABLED) {
    const sponsorCounts = new Map<string, number>();
    for (const inv of invitations) {
      sponsorCounts.set(inv.sponsor_id, (sponsorCounts.get(inv.sponsor_id) ?? 0) + 1);
    }
    for (const [sponsorId, count] of sponsorCounts) {
      if (count >= 10) {
        ingestIntelligenceEvent({
          event_type: "invitation_velocity",
          human_id: sponsorId,
          source_system: "identity_trust",
          event_features: { invitation_count: count },
        });
        const signal = createSignal({
          signal_code: "SPN-VELOCITY",
          signal_type: "sponsor_integrity",
          subject_human_ids: [sponsorId],
          severity: "SI-3",
          confidence: "moderate",
          summary: `Sponsor sent ${count} invitations`,
          supporting_features: [`${count} invitations from sponsor ${sponsorId}`],
          countervailing_features: ["May reflect approved onboarding event or institution launch"],
          rule_code: "SPN-VELOCITY",
        });
        generated.push(signal);
        if (flags.IDENTITY_SIGNAL_REFERRALS_ENABLED) routeSignalReferral(signal);
      }
    }
  }

  // Reciprocal verification pairs
  if (flags.IDENTITY_VERIFICATION_NETWORK_DETECTION_ENABLED) {
    const active = verifications.filter((v) => v.independent);
    for (const a of active) {
      const reciprocal = active.find(
        (b) =>
          b.subject_user_id === a.verifier_user_id &&
          b.verifier_user_id === a.subject_user_id &&
          b.id !== a.id
      );
      if (reciprocal) {
        const pair = [a.subject_user_id, a.verifier_user_id].sort().join(":");
        ingestIntelligenceEvent({
          event_type: "reciprocal_verification",
          related_human_ids: [a.subject_user_id, a.verifier_user_id],
          source_system: "identity_trust",
          source_event_id: pair,
        });
        const signal = createSignal({
          signal_code: "VER-RECIPROCAL-PAIR",
          signal_type: "verification_integrity",
          subject_human_ids: [a.subject_user_id, a.verifier_user_id],
          severity: "SI-2",
          confidence: "high",
          summary: "Reciprocal verification pair detected",
          supporting_features: [`Human ${a.subject_user_id} verified ${a.verifier_user_id} and vice versa`],
          countervailing_features: ["Families, small businesses, and campus teams may legitimately verify each other"],
          rule_code: "VER-RECIPROCAL-PAIR",
        });
        generated.push(signal);
      }
    }
  }

  // Unverified sponsor clusters
  if (flags.IDENTITY_SPONSOR_INTEGRITY_DETECTION_ENABLED) {
    const sponsorGroups = new Map<string, string[]>();
    for (const rel of sponsors) {
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
        const signal = createSignal({
          signal_code: "INV-PROVISIONAL-CLUSTER",
          signal_type: "invitation_integrity",
          subject_human_ids: [sponsorId, ...unverified],
          severity: "SI-3",
          confidence: "moderate",
          summary: `${unverified.length} unverified accounts from sponsor ${sponsorId}`,
          supporting_features: [`${unverified.length} sponsored Humans without independent verification`],
          countervailing_features: ["New institution launch may have provisional cohort"],
          rule_code: "INV-VELOCITY",
        });
        generated.push(signal);
        if (flags.IDENTITY_SIGNAL_REFERRALS_ENABLED) routeSignalReferral(signal);
      }
    }
  }

  // Trust anomaly — informational
  for (const i of identities) {
    if (i.trust_label === "verified" || i.trust_label === "trusted") {
      const indep = verifications.filter((v) => v.subject_user_id === i.user_id && v.independent);
      if (indep.length === 0) {
        const signal = createSignal({
          signal_code: "VER-DISPUTE-RATE",
          signal_type: "verification_integrity",
          subject_human_ids: [i.user_id],
          severity: "SI-1",
          confidence: "moderate",
          summary: `${i.public_name} has trust level ${i.trust_label} without independent verification`,
          supporting_features: ["Trust label inconsistent with verification records"],
          countervailing_features: ["May reflect migration or institutional verification path"],
          rule_code: "VER-RECIPROCAL-PAIR",
        });
        generated.push(signal);
      }
    }
  }

  return generated;
}

export function getIntelligenceQualityMetrics() {
  const { loadIntelligenceSignals, loadSignalFalsePositives } = require("./data") as typeof import("./data");
  const signals = loadIntelligenceSignals();
  const falsePositives = loadSignalFalsePositives();
  const benign = signals.filter((s) => s.status === "benign" || s.status === "explained").length;
  return {
    total_signals: signals.length,
    pending_triage: signals.filter((s) => s.status === "generated" || s.status === "pending_triage").length,
    benign_or_explained: benign,
    false_positives: falsePositives.length,
    false_positive_rate: signals.length ? falsePositives.length / signals.length : 0,
    urgent: signals.filter((s) => s.severity === "SI-4" || s.severity === "SI-5").length,
  };
}
