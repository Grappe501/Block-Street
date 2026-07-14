/**
 * V2-B.2 — map Field Plan positions into V2-A.3 hierarchy.
 * Unmapped / conflicting items go to review — never silent assign.
 */
import framework from "../../../data/field-plan/victory-field-framework.json";
import positionContent from "../../../data/field-plan/position-content.json";
import mappingRules from "../../../data/field-plan/position-mapping-rules.json";
import { listLeadershipRoles } from "@/lib/volunteer-command/roles";

export type MappingStatus = "mapped" | "unmapped" | "conflict" | "deferred_central";

export type PositionMappingRecord = {
  stable_id: string;
  field_plan_key: string;
  canonical_key: string;
  title: string;
  source_reference: string;
  status: MappingStatus;
  where_it_sits: string | null;
  who_supervises: string[] | null;
  geography_or_institution: string[];
  permissions_eventually: string[];
  dashboard_owner: string | null;
  vacancy_behavior: string;
  hierarchy_role: string | null;
  function_key: string | null;
  reason?: string;
  review_required: boolean;
};

function resolveCanonical(key: string): string {
  const aliases = mappingRules.aliases as Record<string, string>;
  return aliases[key] ?? key;
}

function leadershipKeys(): Set<string> {
  return new Set(listLeadershipRoles().map((r) => r.role_key));
}

export function mapFieldPlanPositions(): {
  generated_at: string;
  phase: string;
  mapped: PositionMappingRecord[];
  unmapped: PositionMappingRecord[];
  conflicts: PositionMappingRecord[];
  deferred_central: PositionMappingRecord[];
  summary: Record<string, number>;
} {
  const bindings = mappingRules.canonical_bindings as Record<
    string,
    {
      hierarchy_role: string;
      command_level: string;
      supervises_via: string[];
      dashboard_owner: string;
      scope_types: string[];
      permissions_deferred: string[];
      function_key: string | null;
      vacancy_behavior: string;
      note?: string;
    }
  >;
  const explicitUnmapped = mappingRules.explicit_unmapped as Record<string, string>;
  const roles = leadershipKeys();

  const sources: Array<{ key: string; title: string; source: string; contentStatus?: string }> = [];

  for (const row of framework.local_event_committee ?? []) {
    sources.push({
      key: row.key,
      title: row.title,
      source: `victory-field-framework.local_event_committee:${row.key}`,
      contentStatus: "framework",
    });
  }

  for (const key of Object.keys(positionContent.by_role_key ?? {})) {
    if (!sources.some((s) => s.key === key || resolveCanonical(s.key) === key)) {
      const content = (positionContent.by_role_key as Record<string, { source_reference?: string }>)[key];
      sources.push({
        key,
        title: key.replace(/_/g, " "),
        source: content?.source_reference ?? `position-content.by_role_key:${key}`,
        contentStatus: "role_content",
      });
    }
  }

  for (const role of listLeadershipRoles()) {
    if (role.field_plan_position_key) {
      sources.push({
        key: role.field_plan_position_key,
        title: role.display_name,
        source: `leadership-role-registry:${role.role_key}`,
        contentStatus: "hierarchy",
      });
    }
  }

  // Deduplicate by canonical key + original key pair preference
  const seenKeys = new Set<string>();
  const uniqueSources = sources.filter((s) => {
    const id = `${s.key}`;
    if (seenKeys.has(id)) return false;
    seenKeys.add(id);
    return true;
  });

  const mapped: PositionMappingRecord[] = [];
  const unmapped: PositionMappingRecord[] = [];
  const conflicts: PositionMappingRecord[] = [];
  const deferred_central: PositionMappingRecord[] = [];

  // Detect alias fan-in conflicts: multiple framework keys → same canonical except intentional
  const fanIn = new Map<string, string[]>();
  for (const s of uniqueSources) {
    const can = resolveCanonical(s.key);
    const list = fanIn.get(can) ?? [];
    list.push(s.key);
    fanIn.set(can, list);
  }

  for (const s of uniqueSources) {
    const canonical = resolveCanonical(s.key);
    const stable_id = `FP-position-${s.key}`;

    if (explicitUnmapped[s.key]) {
      unmapped.push({
        stable_id,
        field_plan_key: s.key,
        canonical_key: canonical,
        title: s.title,
        source_reference: s.source,
        status: "unmapped",
        where_it_sits: null,
        who_supervises: null,
        geography_or_institution: [],
        permissions_eventually: [],
        dashboard_owner: null,
        vacancy_behavior: mappingRules.vacancy_default,
        hierarchy_role: null,
        function_key: null,
        reason: explicitUnmapped[s.key],
        review_required: true,
      });
      continue;
    }

    const binding = bindings[canonical] ?? bindings[s.key];
    if (!binding) {
      unmapped.push({
        stable_id,
        field_plan_key: s.key,
        canonical_key: canonical,
        title: s.title,
        source_reference: s.source,
        status: "unmapped",
        where_it_sits: null,
        who_supervises: null,
        geography_or_institution: [],
        permissions_eventually: [],
        dashboard_owner: null,
        vacancy_behavior: mappingRules.vacancy_default,
        hierarchy_role: null,
        function_key: null,
        reason: "No canonical_binding in position-mapping-rules",
        review_required: true,
      });
      continue;
    }

    if (!roles.has(binding.hierarchy_role) && binding.hierarchy_role !== "functional_lead") {
      // functional_lead exists in registry
    }
    if (!roles.has(binding.hierarchy_role)) {
      conflicts.push({
        stable_id,
        field_plan_key: s.key,
        canonical_key: canonical,
        title: s.title,
        source_reference: s.source,
        status: "conflict",
        where_it_sits: binding.command_level,
        who_supervises: binding.supervises_via,
        geography_or_institution: binding.scope_types,
        permissions_eventually: binding.permissions_deferred,
        dashboard_owner: binding.dashboard_owner,
        vacancy_behavior: binding.vacancy_behavior,
        hierarchy_role: binding.hierarchy_role,
        function_key: binding.function_key,
        reason: `hierarchy_role ${binding.hierarchy_role} not in leadership role registry`,
        review_required: true,
      });
      continue;
    }

    // Fan-in: social_media_lead → social_lead while community_social_lead is distinct
    const fan = fanIn.get(canonical) ?? [];
    if (fan.length > 1 && canonical === "social_lead") {
      const others = fan.filter((k) => k !== s.key);
      if (others.includes("social_media_lead") && s.key === "social_media_lead") {
        // ok — primary alias
      }
    }

    mapped.push({
      stable_id,
      field_plan_key: s.key,
      canonical_key: canonical,
      title: s.title,
      source_reference: s.source,
      status: "mapped",
      where_it_sits: binding.command_level,
      who_supervises: binding.supervises_via,
      geography_or_institution: binding.scope_types,
      permissions_eventually: binding.permissions_deferred,
      dashboard_owner: binding.dashboard_owner,
      vacancy_behavior: binding.vacancy_behavior,
      hierarchy_role: binding.hierarchy_role,
      function_key: binding.function_key,
      reason: binding.note,
      review_required: false,
    });
  }

  // Central activation — never dump into volunteer hierarchy
  for (const key of framework.central_activation ?? []) {
    deferred_central.push({
      stable_id: `FP-central-${key}`,
      field_plan_key: key,
      canonical_key: key,
      title: key.replace(/_/g, " "),
      source_reference: "victory-field-framework.central_activation",
      status: "deferred_central",
      where_it_sits: "other_campaign_directorates",
      who_supervises: ["director"],
      geography_or_institution: ["statewide"],
      permissions_eventually: [],
      dashboard_owner: null,
      vacancy_behavior: "director_appointment_required",
      hierarchy_role: null,
      function_key: null,
      reason: mappingRules.central_activation_policy,
      review_required: true,
    });
  }

  // Soft conflict: distinct roles sharing a function lane need operator acknowledgement (not silent merge)
  const communityFunctionOwners = mapped.filter((m) => m.function_key === "community_outreach");
  if (communityFunctionOwners.length > 1) {
    conflicts.push({
      stable_id: "FP-conflict-community-outreach-lane",
      field_plan_key: communityFunctionOwners.map((m) => m.field_plan_key).join("+"),
      canonical_key: "community_outreach_lane",
      title: "Community outreach lane — multiple Field Plan positions",
      source_reference: "position-mapper:function_key_collision_check",
      status: "conflict",
      where_it_sits: "committee",
      who_supervises: ["county_volunteer_lead", "institution_lead"],
      geography_or_institution: ["county", "institution", "community"],
      permissions_eventually: [],
      dashboard_owner: "/leader/:leadershipAssignmentId",
      vacancy_behavior: mappingRules.vacancy_default,
      hierarchy_role: "functional_lead",
      function_key: "community_outreach",
      reason:
        "community_lead and community_social_lead both use function_key community_outreach — keep distinct; do not merge identities",
      review_required: true,
    });
  }

  return {
    generated_at: new Date().toISOString(),
    phase: "V2-B.2",
    mapped,
    unmapped,
    conflicts,
    deferred_central,
    summary: {
      mapped: mapped.length,
      unmapped: unmapped.length,
      conflicts: conflicts.length,
      deferred_central: deferred_central.length,
      total_considered:
        mapped.length + unmapped.length + conflicts.length + deferred_central.length,
    },
  };
}

export function mappingAnswersFor(record: PositionMappingRecord) {
  return {
    where_does_position_sit: record.where_it_sits,
    who_supervises: record.who_supervises?.join(", ") ?? null,
    geography_or_institution: record.geography_or_institution.join(", "),
    eventual_permissions: record.permissions_eventually.join(", ") || null,
    dashboard_owner: record.dashboard_owner,
    vacancy_behavior: record.vacancy_behavior,
  };
}
