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
    { id: "sys-director", label: "Director program board (this page)", kind: "system", href: "/admin/director" },
    { id: "sys-operator", label: "Operator Command (truth board)", kind: "system", href: "/admin?tab=command" },
    { id: "sys-events", label: "Event Operations Command", kind: "system", href: "/command/events" },
    { id: "sys-events-lifecycle", label: "Event lifecycle command", kind: "system", href: "/command/events/lifecycle" },
    { id: "sys-events-core", label: "Core records command", kind: "system", href: "/command/events/core-records" },
    { id: "sys-events-conflicts", label: "Event conflicts command", kind: "system", href: "/command/events/conflicts" },
    { id: "sys-events-conflicts-resolved", label: "Resolved conflicts", kind: "system", href: "/command/events/conflicts/resolved" },
    { id: "sys-events-staffing", label: "Event staffing command", kind: "system", href: "/command/events/staffing" },
    { id: "sys-calendar-list", label: "Calendar event list", kind: "system", href: "/calendar/list" },
    { id: "sys-volunteer", label: "Volunteer Command (shell)", kind: "system", href: "/admin/volunteer-command" },
    { id: "sys-college", label: "College Leader Workbench", kind: "system", href: "/admin/college-command" },
    { id: "sys-clark-vc", label: "Clark County Volunteer Lead (shell)", kind: "system", href: "/admin/counties/clark/volunteer-command" },
    { id: "sys-benton-vc", label: "Benton County Volunteer Lead (shell)", kind: "system", href: "/admin/counties/benton/volunteer-command" },
    { id: "sys-leader-demo", label: "Area Leader demo shell (DEMO)", kind: "system", href: "/leader/demo-committee-canvass" },
    { id: "sys-field-manual", label: "Field Manual (static presentation)", kind: "system", href: "/field-strategy" },
    { id: "sys-start", label: "Invite start", kind: "system", href: "/start" },
    { id: "sys-network", label: "Participant network surface", kind: "system", href: "/network" },
  ];

  return {
    counties: countyTargets.sort((a, b) => a.label.localeCompare(b.label)),
    colleges: colleges.sort((a, b) => a.label.localeCompare(b.label)),
    highSchools: highSchools.sort((a, b) => a.label.localeCompare(b.label)),
    system,
  };
}
