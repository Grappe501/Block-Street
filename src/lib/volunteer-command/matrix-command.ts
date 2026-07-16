import chainOfCommand from "../../../data/volunteer-command/chain-of-command.json";
import clusterRegistry from "../../../data/volunteer-command/geographic-clusters.json";
import { getLeadershipRole } from "./roles";

export type CommandDimension = "functional" | "geographic";

export type ReportingLink = {
  dimension: CommandDimension;
  parent_role_key: string;
  display_name: string;
  question: string;
  resolved_by?: "institution_county" | "assignment_county" | "statewide";
};

export type MatrixReporting = {
  functional: ReportingLink[];
  geographic: ReportingLink[];
};

const FUNCTIONAL_QUESTIONS: Record<string, string> = {
  volunteer_manager: "Are statewide volunteer and education standards being followed?",
  college_leader: "Are campus education goals and procedures on track?",
  county_volunteer_lead: "How is county execution progressing?",
  cluster_commander: "Is this cluster executing consistently across its counties?",
  campaign_command_manager: "Is geographic command coordinated statewide?",
};

const GEOGRAPHIC_QUESTIONS: Record<string, string> = {
  county_volunteer_lead: "How is work progressing in this county?",
  cluster_commander: "How is this cluster performing?",
  campaign_command_manager: "Are clusters resourced and aligned?",
};

function roleDisplayName(roleKey: string): string {
  return getLeadershipRole(roleKey)?.display_name ?? roleKey.replace(/_/g, " ");
}

function functionalLinksForRole(roleKey: string): ReportingLink[] {
  const role = getLeadershipRole(roleKey);
  if (!role?.parent_role_keys?.length) return [];
  return role.parent_role_keys.map((parent) => ({
    dimension: "functional" as const,
    parent_role_key: parent,
    display_name: roleDisplayName(parent),
    question: FUNCTIONAL_QUESTIONS[parent] ?? "Are functional standards being met?",
  }));
}

export function listGeographicClusters() {
  return clusterRegistry.clusters;
}

export function getClusterForCounty(countySlug: string) {
  const slug = countySlug.replace(/-county$/, "");
  return clusterRegistry.clusters.find((c) => c.county_slugs.includes(slug)) ?? null;
}

export function countyVolunteerCommandHref(countySlug: string): string {
  const slug = countySlug.replace(/-county$/, "");
  return `/admin/counties/${slug}/volunteer-command`;
}

export function resolveMatrixReporting(input: {
  role_key: string;
  county_slug?: string | null;
}): MatrixReporting {
  const functional = functionalLinksForRole(input.role_key);
  const geographic: ReportingLink[] = [];
  const role = getLeadershipRole(input.role_key);

  if (input.role_key === "college_leader") {
    geographic.push({
      dimension: "geographic",
      parent_role_key: "county_volunteer_lead",
      display_name: "County Commanders (per campus county)",
      question: "How are campus needs resourced within each county?",
      resolved_by: "institution_county",
    });
  }

  if (
    (input.role_key === "institution_lead" || input.role_key === "functional_lead") &&
    input.county_slug
  ) {
    geographic.push({
      dimension: "geographic",
      parent_role_key: "county_volunteer_lead",
      display_name: roleDisplayName("county_volunteer_lead"),
      question: GEOGRAPHIC_QUESTIONS.county_volunteer_lead ?? "County execution progress",
      resolved_by: "institution_county",
    });
    const cluster = getClusterForCounty(input.county_slug);
    if (cluster) {
      geographic.push({
        dimension: "geographic",
        parent_role_key: "cluster_commander",
        display_name: cluster.display_name,
        question: GEOGRAPHIC_QUESTIONS.cluster_commander ?? "Cluster coordination",
        resolved_by: "assignment_county",
      });
    }
  }

  if (input.role_key === "county_volunteer_lead" && input.county_slug) {
    const cluster = getClusterForCounty(input.county_slug);
    if (cluster) {
      geographic.push({
        dimension: "geographic",
        parent_role_key: "cluster_commander",
        display_name: cluster.display_name,
        question: GEOGRAPHIC_QUESTIONS.cluster_commander ?? "Cluster coordination",
        resolved_by: "assignment_county",
      });
    }
    geographic.push({
      dimension: "geographic",
      parent_role_key: "campaign_command_manager",
      display_name: roleDisplayName("campaign_command_manager"),
      question: GEOGRAPHIC_QUESTIONS.campaign_command_manager ?? "Statewide geographic alignment",
      resolved_by: "statewide",
    });
  }

  if (role?.geographic_parent_role_keys?.length) {
    for (const parent of role.geographic_parent_role_keys) {
      if (geographic.some((g) => g.parent_role_key === parent)) continue;
      geographic.push({
        dimension: "geographic",
        parent_role_key: parent,
        display_name: roleDisplayName(parent),
        question: GEOGRAPHIC_QUESTIONS[parent] ?? "Geographic execution progress",
        resolved_by: input.county_slug ? "institution_county" : "statewide",
      });
    }
  }

  return { functional, geographic };
}

export function getExecutiveCommandCouncil() {
  return chainOfCommand.executive_command_council ?? null;
}

export function getMatrixCommandMeta() {
  return {
    matrix_command: chainOfCommand.matrix_command ?? false,
    unity_of_command: chainOfCommand.unity_of_command,
    doctrine: chainOfCommand.doctrine,
    matrix_doctrine: chainOfCommand.matrix?.doctrine ?? "docs/v2/MATRIX_COMMAND_DOCTRINE.md",
    command_dimensions: chainOfCommand.matrix?.command_dimensions ?? [],
    functional_chain: chainOfCommand.matrix?.functional_chain ?? [],
    geographic_chain: chainOfCommand.matrix?.geographic_chain ?? [],
    cluster_count: clusterRegistry.clusters.length,
    county_count: clusterRegistry.county_count,
  };
}

export function buildCountyGeographicContext(countySlug: string) {
  const slug = countySlug.replace(/-county$/, "");
  const cluster = getClusterForCounty(slug);
  return {
    county_slug: slug,
    cluster_key: cluster?.cluster_key ?? null,
    cluster_name: cluster?.display_name ?? null,
    county_command_href: countyVolunteerCommandHref(slug),
    county_commander_role: "county_volunteer_lead" as const,
  };
}
