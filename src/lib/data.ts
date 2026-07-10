import counties from "../../data/registry/counties.json";
import institutions from "../../data/registry/institutions.json";
import postSecondaryService from "../../data/registry/county-post-secondary-service.json";
import highSchoolRegistry from "../../data/registry/high-schools.json";
import privateCharterRegistry from "../../data/registry/private-charter-schools.json";
import buildProgress from "../../data/build-progress.json";

export type County = (typeof counties)[number];

export type InstitutionType =
  | "university"
  | "college"
  | "community_college"
  | "technical_college"
  | "trade_school"
  | "nursing_college"
  | "high_school"
  | "private_school"
  | "charter_school";

export type HighSchool = {
  slug: string;
  name: string;
  shortName: string;
  type: "high_school";
  sector: "public";
  lea: string;
  county: string;
  countyCode: string;
  city: string;
  grades: string;
  enrollment: number;
  website: string;
  colors: { primary: string; secondary: string };
  culture: string;
  representationStatus: RepresentationStatus;
  v1Priority: boolean;
  dataSource?: string;
};

export type PrivateCharterSchool = {
  slug: string;
  name: string;
  shortName: string;
  type: "private_school" | "charter_school";
  sector: "private" | "charter";
  lea: string | null;
  districtLea: string;
  district: string;
  county: string;
  countyCode: string;
  city: string;
  grades: string;
  enrollment: number;
  website: string;
  colors: { primary: string; secondary: string };
  culture: string;
  representationStatus: RepresentationStatus;
  v1Priority: boolean;
  dataSource?: string;
};

export type Institution = {
  slug: string;
  name: string;
  shortName: string;
  type: InstitutionType | string;
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

export const INSTITUTION_TYPE_LABELS: Record<string, string> = {
  university: "University",
  college: "College",
  community_college: "Community College",
  technical_college: "Technical College",
  trade_school: "Trade School",
  nursing_college: "Nursing & Health",
  high_school: "Public High School",
  private_school: "Private School",
  charter_school: "Charter School",
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

/** Local campuses plus district-served schools for counties without a local campus */
export function getPostSecondaryForCounty(countySlug: string): {
  local: Institution[];
  served: Institution[];
  all: Institution[];
} {
  const local = getInstitutionsByCounty(countySlug);
  const servedSlugs = postSecondaryService.servedBy[countySlug as keyof typeof postSecondaryService.servedBy] ?? [];
  const localSlugs = new Set(local.map((i) => i.slug));
  const served = servedSlugs
    .map((slug) => getInstitutionBySlug(slug))
    .filter((i): i is Institution => !!i && !localSlugs.has(i.slug));
  return { local, served, all: [...local, ...served] };
}

export function getInstitutionTypeLabel(type: string): string {
  return INSTITUTION_TYPE_LABELS[type] ?? type.replace(/_/g, " ");
}

export function getV1Institutions(): Institution[] {
  return (institutions as Institution[]).filter((i) => i.v1Priority);
}

const highSchools = highSchoolRegistry.schools as HighSchool[];

export function getHighSchools(): HighSchool[] {
  return highSchools;
}

export function getHighSchoolBySlug(slug: string): HighSchool | undefined {
  return highSchools.find((s) => s.slug === slug);
}

export function getHighSchoolsByCounty(countySlug: string): HighSchool[] {
  return highSchools.filter((s) => s.county === countySlug);
}

export function getV1HighSchools(): HighSchool[] {
  return highSchools.filter((s) => s.v1Priority);
}

const privateCharterSchools = privateCharterRegistry.schools as PrivateCharterSchool[];

export function getPrivateCharterSchools(): PrivateCharterSchool[] {
  return privateCharterSchools;
}

export function getPrivateSchools(): PrivateCharterSchool[] {
  return privateCharterSchools.filter((s) => s.sector === "private");
}

export function getCharterSchools(): PrivateCharterSchool[] {
  return privateCharterSchools.filter((s) => s.sector === "charter");
}

export function getPrivateCharterSchoolBySlug(slug: string): PrivateCharterSchool | undefined {
  return privateCharterSchools.find((s) => s.slug === slug);
}

export function getPrivateCharterSchoolsByCounty(countySlug: string): PrivateCharterSchool[] {
  return privateCharterSchools.filter((s) => s.county === countySlug);
}

export function getPrivateSchoolsByCounty(countySlug: string): PrivateCharterSchool[] {
  return getPrivateSchools().filter((s) => s.county === countySlug);
}

export function getCharterSchoolsByCounty(countySlug: string): PrivateCharterSchool[] {
  return getCharterSchools().filter((s) => s.county === countySlug);
}

export function getV1PrivateCharterSchools(): PrivateCharterSchool[] {
  return privateCharterSchools.filter((s) => s.v1Priority);
}

export function getBuildProgress(): BuildProgress {
  return buildProgress;
}

export function getPhaseById(id: number): Phase | undefined {
  return buildProgress.phases.find((p) => p.id === id);
}

export function getRegistryStats() {
  const inst = institutions as Institution[];
  const byType = inst.reduce<Record<string, number>>((acc, i) => {
    acc[i.type] = (acc[i.type] ?? 0) + 1;
    return acc;
  }, {});
  return {
    totalCounties: counties.length,
    totalInstitutions: inst.length,
    totalHighSchools: highSchools.length,
    countiesWithHighSchool: highSchoolRegistry.countiesWithHighSchool,
    totalPrivateSchools: privateCharterRegistry.totalPrivateSchools,
    totalCharterSchools: privateCharterRegistry.totalCharterSchools,
    totalPrivateCharterSchools: privateCharterRegistry.totalSchools,
    countiesWithPrivateSchool: privateCharterRegistry.countiesWithPrivateSchool,
    countiesWithCharterSchool: privateCharterRegistry.countiesWithCharterSchool,
    countiesWithPrivateOrCharter: privateCharterRegistry.countiesWithPrivateOrCharter,
    v1Institutions: inst.filter((i) => i.v1Priority).length,
    v1HighSchools: highSchools.filter((s) => s.v1Priority).length,
    v1PrivateCharterSchools: privateCharterSchools.filter((s) => s.v1Priority).length,
    countiesWithLocalCampus: postSecondaryService.countiesWithLocalCampus,
    postSecondaryTypes: Object.keys(byType).length,
    byType,
    needsOrganizer:
      inst.filter((i) => i.representationStatus === "needs_organizer").length +
      highSchools.filter((s) => s.representationStatus === "needs_organizer").length +
      privateCharterSchools.filter((s) => s.representationStatus === "needs_organizer").length,
    building:
      inst.filter((i) => i.representationStatus === "building").length +
      highSchools.filter((s) => s.representationStatus === "building").length +
      privateCharterSchools.filter((s) => s.representationStatus === "building").length,
    active:
      inst.filter((i) => i.representationStatus === "active").length +
      highSchools.filter((s) => s.representationStatus === "active").length +
      privateCharterSchools.filter((s) => s.representationStatus === "active").length,
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
