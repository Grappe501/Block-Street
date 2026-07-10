import campuses from "../../data/campuses.json";
import counties from "../../data/counties.json";
import buildProgress from "../../data/build-progress.json";

export type Campus = (typeof campuses)[number];
export type County = (typeof counties)[number];
export type BuildProgress = typeof buildProgress;
export type Phase = BuildProgress["phases"][number];
export type Step = Phase["steps"][number];
export type StepStatus = "done" | "in_progress" | "pending";

export function getCampuses(): Campus[] {
  return campuses;
}

export function getCampusBySlug(slug: string): Campus | undefined {
  return campuses.find((c) => c.slug === slug);
}

export function getCounties(): County[] {
  return counties;
}

export function getCountyBySlug(slug: string): County | undefined {
  return counties.find((c) => c.slug === slug);
}

export function getBuildProgress(): BuildProgress {
  return buildProgress;
}

export function getPhaseById(id: number): Phase | undefined {
  return buildProgress.phases.find((p) => p.id === id);
}

export function getStepStats() {
  const allSteps = buildProgress.phases.flatMap((p) => p.steps);
  return {
    total: allSteps.length,
    done: allSteps.filter((s) => s.status === "done").length,
    inProgress: allSteps.filter((s) => s.status === "in_progress").length,
    pending: allSteps.filter((s) => s.status === "pending").length,
  };
}

export const INTERESTS = [
  { id: "leadership", label: "Leadership" },
  { id: "events", label: "Events" },
  { id: "outreach", label: "Outreach" },
  { id: "communications", label: "Communications" },
  { id: "committees", label: "Committees" },
  { id: "voter_education", label: "Voter Education" },
  { id: "issue_organizing", label: "Issue Organizing" },
] as const;
