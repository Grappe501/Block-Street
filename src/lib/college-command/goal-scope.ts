import type { CommunityKind } from "@/lib/community-workspace";

/** Trade and technical post-secondary — visible but not College Leader goal targets. */
export const BONUS_INSTITUTION_TYPES = new Set(["trade_school", "technical_college"]);

export type EducationGoalTier = "required" | "bonus";

export function educationGoalTier(input: {
  kind: CommunityKind;
  institutionType?: string | null;
}): EducationGoalTier {
  if (input.kind === "high_school" || input.kind === "private_charter") return "bonus";
  if (
    input.kind === "institution" &&
    input.institutionType &&
    BONUS_INSTITUTION_TYPES.has(input.institutionType)
  ) {
    return "bonus";
  }
  return "required";
}

export function isEducationGoalAccountable(input: {
  kind: CommunityKind;
  institutionType?: string | null;
}): boolean {
  return educationGoalTier(input) === "required";
}

export const EDUCATION_GOAL_DOCTRINE =
  "College Leader goals cover post-secondary colleges we can realistically staff. High schools, trade schools, technical colleges, and private/charter schools are bonus coverage — welcome when leaders step up, not held against the College Leader.";
