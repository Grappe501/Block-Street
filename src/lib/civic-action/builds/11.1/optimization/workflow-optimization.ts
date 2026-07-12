/**
 * CAE-11.1-W7 — Proven workflow patterns
 */
export type WorkflowPattern = {
  pattern_id: string;
  name: string;
  steps: string[];
  confidence: "emerging" | "strong_pattern" | "institution_standard";
  use_cases: string[];
};

export const COUNTY_LAUNCH_WORKFLOW: WorkflowPattern = {
  pattern_id: "county-launch-v1",
  name: "County launch sequence",
  steps: [
    "Listening session",
    "Volunteer recruitment",
    "Training",
    "Community meeting",
    "Media outreach",
    "Launch",
    "Follow-up",
  ],
  confidence: "strong_pattern",
  use_cases: ["county", "community", "registration"],
};

export function getRecommendedWorkflows(initiativeType?: string): WorkflowPattern[] {
  const patterns = [COUNTY_LAUNCH_WORKFLOW];
  if (!initiativeType) return patterns;
  return patterns.filter((p) => p.use_cases.some((u) => initiativeType.includes(u) || u === "community"));
}
