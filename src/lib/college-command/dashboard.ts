import {
  getCountyFieldGoal,
  getFieldGoalsMeta,
  listCountyFieldGoals,
  computeCampusCivicGoals,
  CAMPUS_GOAL_FORMULA_VERSION,
} from "@/lib/field-goals";
import { getInstitutions, getHighSchools, getPrivateCharterSchools } from "@/lib/data";
import { listPositionCards, getScopeMetrics } from "@/lib/position-participation";
import type { CommunityKind } from "@/lib/community-workspace";
import { listEducationContacts } from "./contact-directory";
import { toCommunityId } from "@/lib/community-workspace/roles";
import {
  buildCountyGeographicContext,
  getMatrixCommandMeta,
  resolveMatrixReporting,
  type MatrixReporting,
} from "@/lib/volunteer-command/matrix-command";
import {
  EDUCATION_GOAL_DOCTRINE,
  educationGoalTier,
  type EducationGoalTier,
} from "./goal-scope";

export type EducationInstitutionRow = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  kind: CommunityKind;
  goalTier: EducationGoalTier;
  slug: string;
  countySlug: string;
  countyName: string;
  countyGoal: number;
  countyVci: number;
  institutionSubGoal: number;
  campusVciGoal: number;
  campusShare: number | null;
  confirmedParticipants: number;
  leadCount: number;
  volunteerCount: number;
  openPositions: number;
  committeeLabel: string;
  boardHref: string;
  networkHref: string;
  countyBoardHref: string;
  countyCommandHref: string;
  clusterName: string | null;
  matrixReporting: MatrixReporting;
  risk: "ok" | "needs_lead" | "forming" | "bonus";
};

function countyMatrixFields(countySlug: string) {
  const geo = buildCountyGeographicContext(countySlug);
  return {
    countyCommandHref: geo.county_command_href,
    clusterName: geo.cluster_name,
    matrixReporting: resolveMatrixReporting({
      role_key: "institution_lead",
      county_slug: countySlug,
    }),
  };
}

function riskForRow(
  goalTier: EducationGoalTier,
  leads: number,
  vols: number,
): EducationInstitutionRow["risk"] {
  if (goalTier === "bonus") {
    if (leads === 0) return "bonus";
    return vols > 0 ? "ok" : "forming";
  }
  if (leads === 0) return "needs_lead";
  return vols > 0 ? "ok" : "forming";
}

function committeeFromCounts(leads: number, vols: number): string {
  if (leads + vols === 0) return "Help Build This Team";
  if (leads === 0) return "Volunteer Team Forming";
  if (leads >= 1 && vols >= 1) return "Committee";
  if (leads === 1) return "Lead";
  return "Co-Leads";
}

export function buildCollegeCommandDashboard() {
  const meta = getFieldGoalsMeta();
  const counties = listCountyFieldGoals();
  const institutions = getInstitutions();
  const highSchools = getHighSchools();
  const privateSchools = getPrivateCharterSchools();

  const rows: EducationInstitutionRow[] = [];

  for (const inst of institutions) {
    const county = getCountyFieldGoal(inst.county);
    const campus = computeCampusCivicGoals({
      countySlug: inst.county,
      enrollment: inst.enrollment,
    });
    const metrics = getScopeMetrics({
      kind: "institution",
      slug: inst.slug,
      enrollment: inst.enrollment,
      countySlug: inst.county,
    });
    const cards = listPositionCards({ kind: "institution", slug: inst.slug });
    const leads = cards.reduce((n, c) => n + c.lead_count, 0);
    const vols = cards.reduce((n, c) => n + c.volunteer_count, 0);
    const openPositions = cards.filter((c) => c.lead_count + c.volunteer_count === 0).length;
    const goalTier = educationGoalTier({ kind: "institution", institutionType: inst.type });
    const countyMatrix = countyMatrixFields(inst.county);
    rows.push({
      id: `school:${inst.slug}`,
      name: inst.name,
      shortName: inst.shortName,
      type: inst.type,
      kind: "institution",
      goalTier,
      slug: inst.slug,
      countySlug: inst.county,
      countyName: county?.county_name ?? inst.county,
      countyGoal: county?.voter_registration_goal ?? 0,
      countyVci: county?.vci ?? 0,
      institutionSubGoal: campus.campus_registration_goal,
      campusVciGoal: campus.campus_vci_goal,
      campusShare: campus.campus_share,
      confirmedParticipants: metrics.confirmed_participants,
      leadCount: leads,
      volunteerCount: vols,
      openPositions,
      committeeLabel: committeeFromCounts(leads, vols),
      boardHref: `/schools/${inst.slug}`,
      networkHref: `/network?place=${encodeURIComponent(inst.slug)}`,
      countyBoardHref: `/county/${inst.county}`,
      ...countyMatrix,
      risk: riskForRow(goalTier, leads, vols),
    });
  }

  for (const hs of highSchools as Array<{ slug: string; name: string; shortName: string; county: string; enrollment?: number }>) {
    const county = getCountyFieldGoal(hs.county);
    const campus = computeCampusCivicGoals({
      countySlug: hs.county,
      enrollment: hs.enrollment,
    });
    const metrics = getScopeMetrics({
      kind: "high_school",
      slug: hs.slug,
      enrollment: hs.enrollment,
      countySlug: hs.county,
    });
    const cards = listPositionCards({ kind: "high_school", slug: hs.slug });
    const leads = cards.reduce((n, c) => n + c.lead_count, 0);
    const vols = cards.reduce((n, c) => n + c.volunteer_count, 0);
    const goalTier = educationGoalTier({ kind: "high_school" });
    const countyMatrix = countyMatrixFields(hs.county);
    rows.push({
      id: `high_school:${hs.slug}`,
      name: hs.name,
      shortName: hs.shortName,
      type: "high_school",
      kind: "high_school",
      goalTier,
      slug: hs.slug,
      countySlug: hs.county,
      countyName: county?.county_name ?? hs.county,
      countyGoal: county?.voter_registration_goal ?? 0,
      countyVci: county?.vci ?? 0,
      institutionSubGoal: campus.campus_registration_goal,
      campusVciGoal: campus.campus_vci_goal,
      campusShare: campus.campus_share,
      confirmedParticipants: metrics.confirmed_participants,
      leadCount: leads,
      volunteerCount: vols,
      openPositions: cards.filter((c) => c.lead_count + c.volunteer_count === 0).length,
      committeeLabel: committeeFromCounts(leads, vols),
      boardHref: `/high-schools/${hs.slug}`,
      networkHref: `/network?place=${encodeURIComponent(hs.slug)}`,
      countyBoardHref: `/county/${hs.county}`,
      ...countyMatrix,
      risk: riskForRow(goalTier, leads, vols),
    });
  }

  for (const ps of privateSchools as Array<{ slug: string; name: string; shortName: string; county: string; enrollment?: number }>) {
    const county = getCountyFieldGoal(ps.county);
    const campus = computeCampusCivicGoals({
      countySlug: ps.county,
      enrollment: ps.enrollment,
    });
    const metrics = getScopeMetrics({
      kind: "private_charter",
      slug: ps.slug,
      enrollment: ps.enrollment,
      countySlug: ps.county,
    });
    const cards = listPositionCards({ kind: "private_charter", slug: ps.slug });
    const leads = cards.reduce((n, c) => n + c.lead_count, 0);
    const vols = cards.reduce((n, c) => n + c.volunteer_count, 0);
    const goalTier = educationGoalTier({ kind: "private_charter" });
    const countyMatrix = countyMatrixFields(ps.county);
    rows.push({
      id: `private_charter:${ps.slug}`,
      name: ps.name,
      shortName: ps.shortName,
      type: "private_charter",
      kind: "private_charter",
      goalTier,
      slug: ps.slug,
      countySlug: ps.county,
      countyName: county?.county_name ?? ps.county,
      countyGoal: county?.voter_registration_goal ?? 0,
      countyVci: county?.vci ?? 0,
      institutionSubGoal: campus.campus_registration_goal,
      campusVciGoal: campus.campus_vci_goal,
      campusShare: campus.campus_share,
      confirmedParticipants: metrics.confirmed_participants,
      leadCount: leads,
      volunteerCount: vols,
      openPositions: cards.filter((c) => c.lead_count + c.volunteer_count === 0).length,
      committeeLabel: committeeFromCounts(leads, vols),
      boardHref: `/private-schools/${ps.slug}`,
      networkHref: `/network?place=${encodeURIComponent(ps.slug)}`,
      countyBoardHref: `/county/${ps.county}`,
      ...countyMatrix,
      risk: riskForRow(goalTier, leads, vols),
    });
  }

  const goalScope = rows.filter((r) => r.goalTier === "required");
  const bonusCoverage = rows.filter((r) => r.goalTier === "bonus");

  return {
    meta,
    countyCount: counties.length,
    goalDoctrine: EDUCATION_GOAL_DOCTRINE,
    summary: {
      totalInstitutions: rows.length,
      colleges: goalScope.length,
      bonusCoverage: bonusCoverage.length,
      /** @deprecated Use bonusCoverage — kept for transitional callers */
      highSchools: bonusCoverage.length,
      withoutLead: goalScope.filter((r) => r.leadCount === 0).length,
      withCoLeads: rows.filter((r) => r.leadCount >= 2).length,
      totalVolunteers: rows.reduce((n, r) => n + r.volunteerCount, 0),
      needingAttention: goalScope.filter((r) => r.risk === "needs_lead").length,
      bonusWithLead: bonusCoverage.filter((r) => r.leadCount > 0).length,
    },
    rows: rows.sort((a, b) => a.name.localeCompare(b.name)),
    parentCommand: {
      label: "Volunteer Command",
      href: "/admin/volunteer-command",
      relationship: "College Leader reports functionally to Volunteer Manager",
    },
    matrixCommand: {
      ...getMatrixCommandMeta(),
      college_leader_reporting: resolveMatrixReporting({ role_key: "college_leader" }),
      doctrine_summary:
        "Matrix command — functional chain through Volunteer Manager; geographic coordination with County Commanders for each campus county",
    },
    campus_goal_formula_version: CAMPUS_GOAL_FORMULA_VERSION,
    privacyNote:
      "High-school contact and directory access remain privacy-restricted. Full direct-contact features require age-safety review; campaign-controlled relay only until then.",
    contactSnapshots: {
      [toCommunityId("institution", "henderson-state")]: listEducationContacts({
        role: "college_leader",
        scopeId: toCommunityId("institution", "henderson-state"),
      }),
      // Representative secondary scope — always relay regardless of membership count
      "high_school:privacy-review-example": listEducationContacts({
        role: "college_leader",
        scopeId: "high_school:privacy-review-example",
      }),
    },
  };
}
