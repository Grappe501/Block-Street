import { buildCollegeCommandDashboard } from "@/lib/college-command/dashboard";
import { listCountyFieldGoals, CAMPUS_GOAL_FORMULA_VERSION, SUPERSEDED_FLAT_25_RULE } from "@/lib/field-goals";
import { loadPositionStore } from "@/lib/position-participation/store";
import persistAudit from "../../../data/v2/production-persistence-forensic-audit.json";
import {
  dashboardSectionsForRole,
  fieldPlanPlaceholderCopy,
  getDashboardConfig,
  getFieldPlanScaffold,
  listStatewideFunctions,
  roleIsUnderVolunteerManager,
} from "./roles";

export type VolunteerCommandSection =
  | "command"
  | "people"
  | "leadership"
  | "committees"
  | "counties"
  | "education"
  | "functions"
  | "intake"
  | "orientation"
  | "placement"
  | "retention"
  | "coverage"
  | "reports"
  | "risks"
  | "events"
  | "communications";

const SECTION_PATH: Record<VolunteerCommandSection, string> = {
  command: "/admin/volunteer-command",
  people: "/admin/volunteer-command/people",
  leadership: "/admin/volunteer-command/leadership",
  committees: "/admin/volunteer-command/committees",
  counties: "/admin/volunteer-command/counties",
  education: "/admin/volunteer-command/education",
  functions: "/admin/volunteer-command/functions",
  events: "/admin/volunteer-command",
  intake: "/admin/volunteer-command/intake",
  orientation: "/admin/volunteer-command/orientation",
  placement: "/admin/volunteer-command/placement",
  retention: "/admin/volunteer-command/retention",
  coverage: "/admin/volunteer-command/coverage",
  communications: "/admin/volunteer-command",
  reports: "/admin/volunteer-command/reports",
  risks: "/admin/volunteer-command/risks",
};

export function buildVolunteerCommandDashboard(input?: { section?: VolunteerCommandSection }) {
  const section = input?.section ?? "command";
  const store = loadPositionStore();
  const college = buildCollegeCommandDashboard();
  const counties = listCountyFieldGoals();
  const uniquePeople = new Set(store.persons.map((p) => p.canonical_person_id));
  const activeMemberships = store.memberships.filter((m) => m.status === "active");
  const leads = activeMemberships.filter((m) => m.participation_type === "lead");
  const volunteers = activeMemberships.filter((m) => m.participation_type === "volunteer");
  const leadPositionKeys = leads.map((m) => `${m.scope_id}\0${m.position_id}`);
  const coLeadScopes = new Set(
    [...new Set(leadPositionKeys)].filter(
      (key) => leadPositionKeys.filter((k) => k === key).length >= 2,
    ),
  );

  const nav = (getDashboardConfig("volunteer_command")?.navigation_sections ??
    dashboardSectionsForRole("volunteer_manager")) as string[];

  const functionalCoverage = listStatewideFunctions().map((fn) => ({
    function_key: fn,
    label: fn.replace(/_/g, " "),
    lead_coverage: "scaffold" as const,
    volunteer_coverage: "scaffold" as const,
    note: "Not yet connected to verified outcome data",
  }));

  return {
    header: {
      title: "VOLUNTEER COMMAND",
      subtitle: "Statewide personnel, leadership, placement, and readiness",
      role: "Volunteer Manager",
      scope: "Statewide volunteer workforce",
      refreshed_at: new Date().toISOString(),
      persistence_backend: persistAudit.canonical_persistence_backend,
      postgres_active: persistAudit.netlify_database_postgres_active,
      certification_state: "shell_implemented_not_journey_certified",
    },
    section,
    nav: nav.map((label) => {
      const key = label.toLowerCase().replace(/\s+/g, "_") as VolunteerCommandSection;
      return {
        label,
        href: SECTION_PATH[key] ?? "/admin/volunteer-command",
        active: section === key || (section === "command" && label === "Command"),
      };
    }),
    hierarchy: {
      volunteer_manager_parent: "director",
      subordinate_commands: ["county_volunteer_command", "education_volunteer_command", "statewide_functional", "intake_development"],
      college_leader_under_vm: roleIsUnderVolunteerManager("college_leader"),
      county_lead_under_vm: roleIsUnderVolunteerManager("county_volunteer_lead"),
    },
    personnel: {
      unique_confirmed_volunteers: uniquePeople.size,
      active_memberships: activeMemberships.length,
      active_leads: new Set(leads.map((m) => m.canonical_person_id)).size,
      active_volunteers: new Set(volunteers.map((m) => m.canonical_person_id)).size,
      co_lead_positions: coLeadScopes.size,
      committees_forming: "scaffold" as const,
      committees_active: "scaffold" as const,
      new_volunteers: "scaffold" as const,
      awaiting_contact: "scaffold" as const,
      awaiting_placement: "scaffold" as const,
      needing_orientation: "scaffold" as const,
      inactive: "scaffold" as const,
      potential_leaders: "scaffold" as const,
      counting_rule: "COUNT(DISTINCT canonical_person_id) — aliases do not inflate",
    },
    geographic: {
      counties_total: counties.length,
      counties_with_volunteer_leads: "scaffold" as const,
      counties_without_volunteer_leads: "scaffold" as const,
      colleges: college.summary.colleges,
      colleges_without_lead: college.summary.withoutLead,
      high_schools: college.summary.highSchools,
      institutions_needing_attention: college.summary.needingAttention,
    },
    functional_coverage: functionalCoverage,
    education_command: {
      route: "/admin/college-command",
      relationship: "subordinate_to_volunteer_manager",
      summary: college.summary,
      campus_goal_formula_version: CAMPUS_GOAL_FORMULA_VERSION,
      superseded_flat_25: SUPERSEDED_FLAT_25_RULE,
    },
    attention: [
      {
        id: "invite-chain",
        label: "Invite-chain certification still PENDING",
        severity: "high" as const,
      },
      {
        id: "field-plan",
        label: "Field Plan not uploaded — placeholders only",
        severity: "medium" as const,
      },
      {
        id: "persistence",
        label: "Sensitive personnel actions disabled until durable write path proven",
        severity: "high" as const,
      },
      {
        id: "education-gaps",
        label: `${college.summary.withoutLead} education institutions without a lead`,
        severity: "medium" as const,
      },
    ],
    activity: {
      label: "Last recorded" as const,
      note: "No presence signal — do not label historical rollups as Live",
      items: [] as Array<{ at: string; summary: string }>,
    },
    field_plan: {
      status: getFieldPlanScaffold().status,
      placeholder: fieldPlanPlaceholderCopy(),
      phases: getFieldPlanScaffold().operational_phases,
    },
    persistence: {
      backend: persistAudit.canonical_persistence_backend,
      postgres: false,
      shell_classification: "static_scaffold_plus_seed_rollups",
      durable_personnel_actions: false,
    },
    links: {
      operator_command: "/admin?tab=command",
      college_command: "/admin/college-command",
      director: "/admin/director",
    },
  };
}

export function buildCountyVolunteerCommand(countySlug: string) {
  const slug = countySlug.replace(/-county$/, "");
  const county = listCountyFieldGoals().find((c) => c.county_slug === slug) ?? null;
  return {
    header: {
      title: `${county?.county_name ?? slug} Volunteer Command`,
      subtitle: "County personnel under Volunteer Manager",
      parent: "/admin/volunteer-command/counties",
    },
    county_slug: slug,
    registration_goal: county?.voter_registration_goal ?? null,
    vci_goal: county?.vci ?? null,
    sections: dashboardSectionsForRole("county_volunteer_lead"),
    scope_rule: "Assigned county only — other counties are not visible",
    field_plan_placeholder: fieldPlanPlaceholderCopy(),
    verified_progress: "Not yet connected to verified outcome data",
    persistence: "static_scaffold",
  };
}

export function buildFunctionalLeaderDashboard(functionKey: string, scopeLabel: string) {
  const functions = listStatewideFunctions();
  if (!functions.includes(functionKey)) {
    throw new Error(`Unknown function: ${functionKey}`);
  }
  const sections = dashboardSectionsForRole("functional_lead");
  return {
    header: {
      title: `${functionKey.replace(/_/g, " ")} — Functional Lead`,
      subtitle: `Scope: ${scopeLabel}`,
      parent: "/admin/volunteer-command/functions",
    },
    function_key: functionKey,
    sections,
    field_plan_placeholder: fieldPlanPlaceholderCopy(),
    field_plan_content_status: "placeholder" as const,
    related_functions_hidden: true,
    verified_outcomes: "Not yet connected to verified outcome data",
    persistence: "static_scaffold",
    escalation_target: "volunteer_manager",
  };
}

export function buildLeaderDashboard(assignmentId: string) {
  const sections = (getDashboardConfig("campaign_leader")?.navigation_sections ??
    dashboardSectionsForRole("functional_lead")) as string[];
  return {
    assignment_id: assignmentId,
    sections,
    field_plan_placeholder: fieldPlanPlaceholderCopy(),
    field_plan_content_status: "placeholder" as const,
    persistence: "static_scaffold",
    note: "Registry-driven shell — responsibilities populate when Field Plan is uploaded.",
  };
}
