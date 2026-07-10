import counties from "../../data/registry/counties.json";
import institutions from "../../data/registry/institutions.json";
import buildProgress from "../../data/build-progress.json";

export type County = (typeof counties)[number];
export type Institution = {
  slug: string;
  name: string;
  shortName: string;
  type: string;
  sector: string;
  hbcu: boolean;
  city: string;
  county: string;
  founded: number;
  enrollment: number;
  website: string;
  colors: { primary: string; secondary: string };
  culture: string;
  representationStatus: RepresentationStatus;
  v1Priority: boolean;
};
export type BuildProgress = typeof buildProgress;
export type Phase = BuildProgress["phases"][number];
export type Step = Phase["steps"][number];
export type StepStatus = "done" | "in_progress" | "pending";
export type RepresentationStatus = "needs_organizer" | "building" | "active";

export const PLATFORM = {
  workingName: "ASYON",
  fullName: "Arkansas Student & Youth Organizing Network",
  motto: "Connect Locally. Organize Statewide. Lead Together.",
  tagline: "Your organizing home",
} as const;

/** @deprecated Use PLATFORM.workingName — kept for backward compatibility */
export const PLATFORM_NAME = PLATFORM.workingName;
export const PLATFORM_DISCLAIMER =
  "An independent youth organizing network. Not affiliated with or endorsed by any institution.";

export function getCounties(): County[] {
  return counties;
}

export function getCountyBySlug(slug: string): County | undefined {
  return counties.find((c) => c.slug === slug);
}

export function getInstitutions(): Institution[] {
  return institutions as Institution[];
}

export function getInstitutionBySlug(slug: string): Institution | undefined {
  return (institutions as Institution[]).find((i) => i.slug === slug);
}

export function getInstitutionsByCounty(countySlug: string): Institution[] {
  return (institutions as Institution[]).filter((i) => i.county === countySlug);
}

export function getV1Institutions(): Institution[] {
  return (institutions as Institution[]).filter((i) => i.v1Priority);
}

export function getBuildProgress(): BuildProgress {
  return buildProgress;
}

export function getPhaseById(id: number): Phase | undefined {
  return buildProgress.phases.find((p) => p.id === id);
}

export function getRegistryStats() {
  const inst = institutions as Institution[];
  return {
    totalCounties: counties.length,
    totalInstitutions: inst.length,
    v1Institutions: inst.filter((i) => i.v1Priority).length,
    needsOrganizer: inst.filter((i) => i.representationStatus === "needs_organizer").length,
    building: inst.filter((i) => i.representationStatus === "building").length,
    active: inst.filter((i) => i.representationStatus === "active").length,
  };
}

export const INTERESTS = [
  { id: "leadership", label: "Leadership" },
  { id: "events", label: "Events" },
  { id: "outreach", label: "Outreach" },
  { id: "communications", label: "Communications" },
  { id: "committees", label: "Committees" },
  { id: "voter_education", label: "Voter Education" },
  { id: "voter_registration", label: "Voter Registration" },
  { id: "issue_organizing", label: "Issue Organizing" },
] as const;

export const STATUS_LABELS: Record<RepresentationStatus, string> = {
  needs_organizer: "Needs Organizer",
  building: "Building",
  active: "Active",
};

export const STATUS_COLORS: Record<RepresentationStatus, string> = {
  needs_organizer: "bg-red-100 text-red-800",
  building: "bg-amber-100 text-amber-800",
  active: "bg-green-100 text-green-800",
};
