import { recordIdentityTrustAudit } from "./audit";
import {
  loadAppeals,
  loadHumanIdentities,
  loadIdentityReviews,
  loadTrustDemotions,
  loadTrustPolicy,
  loadTrustPromotions,
  persistAppeals,
  persistHumanIdentities,
  persistIdentityReviews,
  persistTrustDemotions,
  persistTrustPromotions,
} from "./data";
import { appendIdentityHistory } from "./history";
import type { Appeal, IdentityReview, TrustDemotion, TrustLevelLabel, TrustPromotion } from "./types";
import { itlId, nowIso } from "./utils";

export function recordTrustPromotion(input: {
  user_id: string;
  global_human_id: string;
  from_level: TrustLevelLabel;
  to_level: TrustLevelLabel;
  reason: string;
  automatic: boolean;
  promoted_by: string | null;
}): TrustPromotion {
  const promotion: TrustPromotion = {
    id: itlId("tpro"),
    user_id: input.user_id,
    from_level: input.from_level,
    to_level: input.to_level,
    reason: input.reason,
    automatic: input.automatic,
    promoted_by: input.promoted_by,
    promoted_at: nowIso(),
  };
  const promotions = loadTrustPromotions();
  promotions.push(promotion);
  persistTrustPromotions(promotions);

  appendIdentityHistory({
    global_human_id: input.global_human_id,
    user_id: input.user_id,
    event_type: "trust_promoted",
    actor_id: input.promoted_by ?? "system",
    summary: `Trust promoted: ${input.from_level} → ${input.to_level}`,
    details: { reason: input.reason, automatic: input.automatic },
  });

  recordIdentityTrustAudit({
    actor_id: input.promoted_by ?? "system",
    global_human_id: input.global_human_id,
    action: "trust_promoted",
    target_user_id: input.user_id,
    target_invitation_id: null,
    organization_id: null,
    institution_id: null,
    result: "success",
    metadata: { from: input.from_level, to: input.to_level },
  });

  return promotion;
}

export function recordTrustDemotion(input: {
  user_id: string;
  global_human_id: string;
  from_level: TrustLevelLabel;
  to_level: TrustLevelLabel;
  reason: string;
  demoted_by: string;
}): TrustDemotion {
  const demotion: TrustDemotion = {
    id: itlId("tdem"),
    user_id: input.user_id,
    from_level: input.from_level,
    to_level: input.to_level,
    reason: input.reason,
    demoted_by: input.demoted_by,
    demoted_at: nowIso(),
  };
  const demotions = loadTrustDemotions();
  demotions.push(demotion);
  persistTrustDemotions(demotions);

  appendIdentityHistory({
    global_human_id: input.global_human_id,
    user_id: input.user_id,
    event_type: "trust_demoted",
    actor_id: input.demoted_by,
    summary: `Trust demoted: ${input.from_level} → ${input.to_level}`,
    details: { reason: input.reason },
  });

  return demotion;
}

export function detectDormantIdentities(): string[] {
  const policy = loadTrustPolicy();
  const dormancyDays = policy.dormancy_days ?? 180;
  const cutoff = Date.now() - dormancyDays * 86400000;
  const dormant: string[] = [];

  for (const identity of loadHumanIdentities()) {
    if (identity.identity_status === "archived") continue;
    const lastActive = identity.last_active_at ?? identity.updated_at;
    if (new Date(lastActive).getTime() < cutoff) {
      dormant.push(identity.user_id);
      appendIdentityHistory({
        global_human_id: identity.global_human_id,
        user_id: identity.user_id,
        event_type: "dormancy_detected",
        actor_id: "system",
        summary: `Identity dormant for ${dormancyDays}+ days`,
      });
    }
  }
  return dormant;
}

export function archiveIdentity(userId: string, actorId: string, reason: string) {
  const identities = loadHumanIdentities();
  const idx = identities.findIndex((i) => i.user_id === userId);
  if (idx < 0) throw new Error("Identity not found");

  identities[idx] = {
    ...identities[idx],
    identity_status: "archived",
    archived_at: nowIso(),
    updated_at: nowIso(),
  };
  persistHumanIdentities(identities);

  appendIdentityHistory({
    global_human_id: identities[idx].global_human_id,
    user_id: userId,
    event_type: "identity_archived",
    actor_id: actorId,
    summary: reason,
  });
}

export function listTrustPromotions(userId?: string) {
  const all = loadTrustPromotions();
  return userId ? all.filter((p) => p.user_id === userId) : all;
}

export function listTrustDemotions(userId?: string) {
  const all = loadTrustDemotions();
  return userId ? all.filter((d) => d.user_id === userId) : all;
}

export function submitAppeal(input: {
  review_id: string;
  subject_user_id: string;
  submitted_by: string;
  reason: string;
}): Appeal {
  const appeal: Appeal = {
    id: itlId("appeal"),
    review_id: input.review_id,
    subject_user_id: input.subject_user_id,
    submitted_by: input.submitted_by,
    reason: input.reason,
    status: "submitted",
    resolution: null,
    resolved_by: null,
    created_at: nowIso(),
    resolved_at: null,
  };
  const appeals = loadAppeals();
  appeals.push(appeal);
  persistAppeals(appeals);

  const identity = loadHumanIdentities().find((i) => i.user_id === input.subject_user_id);
  if (identity) {
    appendIdentityHistory({
      global_human_id: identity.global_human_id,
      user_id: input.subject_user_id,
      event_type: "appeal_submitted",
      actor_id: input.submitted_by,
      summary: input.reason,
    });
  }

  return appeal;
}

export function resolveAppeal(input: {
  appeal_id: string;
  resolver_id: string;
  status: "upheld" | "denied";
  resolution: string;
}): Appeal {
  const appeals = loadAppeals();
  const idx = appeals.findIndex((a) => a.id === input.appeal_id);
  if (idx < 0) throw new Error("Appeal not found");

  appeals[idx] = {
    ...appeals[idx],
    status: input.status,
    resolution: input.resolution,
    resolved_by: input.resolver_id,
    resolved_at: nowIso(),
  };
  persistAppeals(appeals);

  const identity = loadHumanIdentities().find((i) => i.user_id === appeals[idx].subject_user_id);
  if (identity) {
    appendIdentityHistory({
      global_human_id: identity.global_human_id,
      user_id: appeals[idx].subject_user_id,
      event_type: "appeal_resolved",
      actor_id: input.resolver_id,
      summary: `${input.status}: ${input.resolution}`,
    });
  }

  if (input.status === "upheld") {
    const reviews = loadIdentityReviews();
    const rIdx = reviews.findIndex((r) => r.id === appeals[idx].review_id);
    if (rIdx >= 0) {
      reviews[rIdx] = {
        ...reviews[rIdx],
        status: "resolved",
        outcome: "verified",
        resolved_at: nowIso(),
        resolution_notes: `Appeal upheld: ${input.resolution}`,
      };
      persistIdentityReviews(reviews);
    }
  }

  return appeals[idx];
}

export function listAppeals(status?: Appeal["status"]) {
  const all = loadAppeals();
  return status ? all.filter((a) => a.status === status) : all;
}

export function setAiReviewRecommendation(reviewId: string, recommendation: string): IdentityReview {
  const reviews = loadIdentityReviews();
  const idx = reviews.findIndex((r) => r.id === reviewId);
  if (idx < 0) throw new Error("Review not found");
  reviews[idx] = { ...reviews[idx], ai_recommendation: recommendation };
  persistIdentityReviews(reviews);
  return reviews[idx];
}
