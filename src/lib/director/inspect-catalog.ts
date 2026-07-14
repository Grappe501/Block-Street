import { listCountyFieldGoals } from "@/lib/field-goals";
import { getInstitutions, getHighSchools, getPrivateCharterSchools, getCounties } from "@/lib/data";

export type InspectTarget = {
  id: string;
  label: string;
  kind: "county" | "college" | "high_school" | "private_charter" | "system";
  href: string;
  meta?: string;
};

export function buildDirectorInspectCatalog(): {
  counties: InspectTarget[];
  colleges: InspectTarget[];
  highSchools: InspectTarget[];
  system: InspectTarget[];
} {
  const goals = listCountyFieldGoals();
  const counties = getCounties();

  const countyTargets: InspectTarget[] = counties.map((c) => {
    const g = goals.find((row) => row.county_slug === c.slug);
    return {
      id: `county:${c.slug}`,
      label: `${c.name} County board`,
      kind: "county",
      href: `/county/${c.slug}`,
      meta: g
        ? `Reg ${g.voter_registration_goal.toLocaleString()} · VCI ${g.vci.toLocaleString()}`
        : undefined,
    };
  });

  const colleges = getInstitutions().map((inst) => ({
    id: `school:${inst.slug}`,
    label: inst.name,
    kind: "college" as const,
    href: `/schools/${inst.slug}`,
    meta: `${inst.county} · enrollment ${inst.enrollment?.toLocaleString?.() ?? "—"}`,
  }));

  const highSchools = [
    ...getHighSchools().map((hs) => ({
      id: `high_school:${hs.slug}`,
      label: hs.name,
      kind: "high_school" as const,
      href: `/high-schools/${hs.slug}`,
      meta: hs.county,
    })),
    ...getPrivateCharterSchools().map((ps) => ({
      id: `private:${ps.slug}`,
      label: ps.name,
      kind: "private_charter" as const,
      href: `/private-schools/${ps.slug}`,
      meta: ps.county,
    })),
  ];

  const system: InspectTarget[] = [
    { id: "sys-network", label: "Participant network surface", kind: "system", href: "/network" },
    { id: "sys-start", label: "Invite start", kind: "system", href: "/start" },
    { id: "sys-volunteer", label: "Volunteer Command", kind: "system", href: "/admin/volunteer-command" },
    { id: "sys-college", label: "College Leader Workbench", kind: "system", href: "/admin/college-command" },
    { id: "sys-operator", label: "Operator Command", kind: "system", href: "/admin?tab=command" },
    { id: "sys-clark-vc", label: "Clark County Volunteer Lead", kind: "system", href: "/admin/counties/clark/volunteer-command" },
  ];

  return {
    counties: countyTargets.sort((a, b) => a.label.localeCompare(b.label)),
    colleges: colleges.sort((a, b) => a.label.localeCompare(b.label)),
    highSchools: highSchools.sort((a, b) => a.label.localeCompare(b.label)),
    system,
  };
}
