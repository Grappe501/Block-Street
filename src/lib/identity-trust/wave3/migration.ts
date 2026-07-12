import { loadIdentityChallenges } from "../wave2/data";
import { loadHumanIdentities } from "../data";
import { isWave2FoundationComplete } from "../wave2/engine";
import { openIdentityCase } from "./cases";
import { reconcileWave1DuplicateCandidates } from "./duplicates";
import { loadIdentityCases } from "./data";

export function reconcileWave2ToWave3(actorId: string) {
  if (!isWave2FoundationComplete()) {
    throw new Error("Wave 2 must be certified before Wave 3 reconciliation.");
  }

  const opened: string[] = [];
  const challenges = loadIdentityChallenges();

  for (const ch of challenges) {
    if (["open", "under_review", "contained"].includes(ch.status)) {
      const existing = loadIdentityCases().find((c) => c.originating_event_id === ch.id);
      if (existing) continue;

      const caseType =
        ch.challenge_type === "duplicate_human"
          ? "duplicate_human"
          : ch.challenge_type === "impersonation"
            ? "impersonation"
            : ch.challenge_type === "alias_conflict"
              ? "alias_dispute"
              : "other_identity_matter";

      const c = openIdentityCase({
        case_type: caseType as Parameters<typeof openIdentityCase>[0]["case_type"],
        subject_human_id: ch.subject_human_id,
        institution_id: ch.institution_id,
        reporting_human_id: ch.reported_by_human_id,
        originating_event_id: ch.id,
        summary: ch.description,
        severity: ch.severity === "critical" ? "IG-4" : ch.severity === "high" ? "IG-3" : "IG-2",
      });
      opened.push(c.id);
    }
  }

  for (const human of loadHumanIdentities()) {
    if (human.identity_status === "restricted" && human.review_required) {
      const existing = loadIdentityCases().find(
        (c) => c.subject_human_id === human.user_id && !["closed", "dismissed", "resolved"].includes(c.status)
      );
      if (!existing) {
        const c = openIdentityCase({
          case_type: "verification_insufficiency",
          subject_human_id: human.user_id,
          institution_id: human.institution_id,
          scope: "institution_membership",
          summary: "Legacy restricted identity — Wave 3 case opened during reconciliation",
          severity: "IG-2",
        });
        opened.push(c.id);
      }
    }
  }

  const dupOpened = reconcileWave1DuplicateCandidates(actorId);
  return { cases_opened: opened.length, duplicate_cases: dupOpened, actor_id: actorId };
}
