import { getCountyFieldGoal, getFieldGoalsMeta, listCountyFieldGoals } from "@/lib/field-goals";
import { getInstitutions, getHighSchools, getPrivateCharterSchools } from "@/lib/data";
import { listPositionCards, getScopeMetrics } from "@/lib/position-participation";
import type { CommunityKind } from "@/lib/community-workspace";
import { listEducationContacts } from "./contact-directory";
import { toCommunityId } from "@/lib/community-workspace/roles";

export type EducationInstitutionRow = {
  id: string;
  name: string;
  shortName: string;
  type: string;
  kind: CommunityKind;
  slug: string;
  countySlug: string;
  countyName: string;
  countyGoal: number;
  institutionSubGoal: number;
  confirmedParticipants: number;
  leadCount: number;
  volunteerCount: number;
  openPositions: number;
  committeeLabel: string;
  boardHref: string;
  risk: "ok" | "needs_lead" | "forming";
};

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
    rows.push({
      id: `school:${inst.slug}`,
      name: inst.name,
      shortName: inst.shortName,
      type: inst.type,
      kind: "institution",
      slug: inst.slug,
      countySlug: inst.county,
      countyName: county?.county_name ?? inst.county,
      countyGoal: county?.voter_registration_goal ?? 0,
      institutionSubGoal: county ? Math.ceil(county.voter_registration_goal * 0.25) : 0,
      confirmedParticipants: metrics.confirmed_participants,
      leadCount: leads,
      volunteerCount: vols,
      openPositions,
      committeeLabel: committeeFromCounts(leads, vols),
      boardHref: `/schools/${inst.slug}`,
      risk: leads === 0 ? "needs_lead" : vols > 0 ? "ok" : "forming",
    });
  }

  for (const hs of highSchools as Array<{ slug: string; name: string; shortName: string; county: string; enrollment?: number }>) {
    const county = getCountyFieldGoal(hs.county);
    const metrics = getScopeMetrics({
      kind: "high_school",
      slug: hs.slug,
      enrollment: hs.enrollment,
      countySlug: hs.county,
    });
    const cards = listPositionCards({ kind: "high_school", slug: hs.slug });
    const leads = cards.reduce((n, c) => n + c.lead_count, 0);
    const vols = cards.reduce((n, c) => n + c.volunteer_count, 0);
    rows.push({
      id: `high_school:${hs.slug}`,
      name: hs.name,
      shortName: hs.shortName,
      type: "high_school",
      kind: "high_school",
      slug: hs.slug,
      countySlug: hs.county,
      countyName: county?.county_name ?? hs.county,
      countyGoal: county?.voter_registration_goal ?? 0,
      institutionSubGoal: county ? Math.ceil(county.voter_registration_goal * 0.25) : 0,
      confirmedParticipants: metrics.confirmed_participants,
      leadCount: leads,
      volunteerCount: vols,
      openPositions: cards.filter((c) => c.lead_count + c.volunteer_count === 0).length,
      committeeLabel: committeeFromCounts(leads, vols),
      boardHref: `/high-schools/${hs.slug}`,
      risk: leads === 0 ? "needs_lead" : "forming",
    });
  }

  for (const ps of privateSchools as Array<{ slug: string; name: string; shortName: string; county: string; enrollment?: number }>) {
    const county = getCountyFieldGoal(ps.county);
    const metrics = getScopeMetrics({
      kind: "private_charter",
      slug: ps.slug,
      enrollment: ps.enrollment,
      countySlug: ps.county,
    });
    const cards = listPositionCards({ kind: "private_charter", slug: ps.slug });
    const leads = cards.reduce((n, c) => n + c.lead_count, 0);
    const vols = cards.reduce((n, c) => n + c.volunteer_count, 0);
    rows.push({
      id: `private_charter:${ps.slug}`,
      name: ps.name,
      shortName: ps.shortName,
      type: "private_charter",
      kind: "private_charter",
      slug: ps.slug,
      countySlug: ps.county,
      countyName: county?.county_name ?? ps.county,
      countyGoal: county?.voter_registration_goal ?? 0,
      institutionSubGoal: county ? Math.ceil(county.voter_registration_goal * 0.25) : 0,
      confirmedParticipants: metrics.confirmed_participants,
      leadCount: leads,
      volunteerCount: vols,
      openPositions: cards.filter((c) => c.lead_count + c.volunteer_count === 0).length,
      committeeLabel: committeeFromCounts(leads, vols),
      boardHref: `/private-schools/${ps.slug}`,
      risk: leads === 0 ? "needs_lead" : "forming",
    });
  }

  const colleges = rows.filter((r) => r.kind === "institution");
  const secondary = rows.filter((r) => r.kind !== "institution");

  return {
    meta,
    countyCount: counties.length,
    summary: {
      totalInstitutions: rows.length,
      colleges: colleges.length,
      highSchools: secondary.length,
      withoutLead: rows.filter((r) => r.leadCount === 0).length,
      withCoLeads: rows.filter((r) => r.leadCount >= 2).length,
      totalVolunteers: rows.reduce((n, r) => n + r.volunteerCount, 0),
      needingAttention: rows.filter((r) => r.risk === "needs_lead").length,
    },
    rows: rows.sort((a, b) => a.name.localeCompare(b.name)),
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
