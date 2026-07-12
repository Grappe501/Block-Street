import type { LegacyInitiative } from "../../types";
import type {
  CanonicalInitiativeStatus,
  CanonicalInitiativeType,
  GovernanceClass,
  InitiativeAggregate,
  InitiativeCharterRecord,
  InitiativeMembershipRecord,
  InitiativeRecord,
  InitiativeScopeRecord,
  InitiativeTimelineRecord,
  InitiativeVisibility,
} from "./data-model";

const VISIBILITY_MAP: Record<string, InitiativeVisibility> = {
  public: "public",
  internal: "institution_internal",
  restricted: "private",
  private: "private",
  institution_internal: "institution_internal",
};

const STATUS_MAP: Record<string, CanonicalInitiativeStatus> = {
  concept: "concept",
  discovery: "discovery",
  design: "design",
  approval: "approval_pending",
  approval_pending: "approval_pending",
  approved: "approved",
  preparation: "preparation",
  active: "active",
  paused: "paused",
  at_risk: "at_risk",
  closing: "closing",
  completed: "completed",
  cancelled: "cancelled",
  archived: "archived",
};

const RISK_TO_GOVERNANCE: Record<string, GovernanceClass> = {
  low: 1,
  medium: 2,
  high: 4,
  critical: 5,
};

const TYPE_MAP: Record<string, CanonicalInitiativeType> = {
  program: "program",
  campaign: "campaign",
  project: "project",
  operation: "operation",
  pilot: "pilot",
  community_response: "community_response",
  educational_initiative: "educational_initiative",
  leadership_initiative: "educational_initiative",
  research_initiative: "research_initiative",
  coalition_initiative: "coalition_initiative",
  institutional_change: "institutional_change",
  emergency_operation: "emergency_initiative",
  emergency_initiative: "emergency_initiative",
  continuous_operating_function: "continuous_operating_function",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function legacyInitiativeToCanonical(legacy: LegacyInitiative, actor = "system"): InitiativeAggregate {
  const now = new Date().toISOString();
  const initiative_id = legacy.id;
  const status = STATUS_MAP[legacy.status] ?? "concept";
  const initiative: InitiativeRecord = {
    initiative_id,
    institution_id: legacy.institution_id,
    initiative_type: TYPE_MAP[legacy.initiative_type] ?? "program",
    initiative_name: legacy.name,
    initiative_slug: slugify(legacy.name) || initiative_id,
    public_name: legacy.public_name_optional,
    executive_owner_human_id: legacy.executive_owner_human_id,
    operational_owner_human_id: legacy.operational_owner_human_id,
    backup_owner_human_id: null,
    status,
    governance_class: RISK_TO_GOVERNANCE[legacy.risk_level] ?? 2,
    visibility: VISIBILITY_MAP[legacy.privacy_level] ?? "institution_internal",
    strategic_priority_id: null,
    portfolio_category: null,
    current_version: 1,
    is_archived: status === "archived",
    created_at: legacy.start_at ?? now,
    created_by: actor,
    updated_at: now,
    updated_by: actor,
  };

  const charter: InitiativeCharterRecord = {
    charter_id: `charter-${initiative_id}-v1`,
    initiative_id,
    problem_statement: legacy.problem_statement,
    opportunity_statement: null,
    purpose: legacy.purpose,
    institution_alignment: legacy.organizational_scope,
    success_definition: legacy.description,
    in_scope: legacy.organizational_scope,
    out_of_scope: "",
    public_description: legacy.public_name_optional,
    review_frequency: "quarterly",
    closeout_basis: "objective_completed",
    charter_status: status === "active" || status === "preparation" ? "active_version" : "draft",
    version: 1,
    approved_at: status === "active" ? legacy.start_at : null,
    approved_by: status === "active" ? legacy.executive_owner_human_id : null,
    created_at: legacy.start_at ?? now,
    created_by: actor,
    updated_at: now,
    updated_by: actor,
  };

  const scope: InitiativeScopeRecord = {
    scope_id: `scope-${initiative_id}-v1`,
    initiative_id,
    geographic_scope: legacy.geographic_scope,
    population_scope: legacy.target_population,
    institution_scope: legacy.organizational_scope,
    functional_scope: legacy.description,
    resource_scope: "",
    visibility_scope: legacy.privacy_level,
    data_scope: "institution_governed",
    version: 1,
    created_at: legacy.start_at ?? now,
    updated_at: now,
  };

  const timeline: InitiativeTimelineRecord = {
    timeline_id: `timeline-${initiative_id}`,
    initiative_id,
    concept_date: null,
    discovery_date: null,
    design_date: null,
    approval_date: null,
    preparation_date: null,
    activation_date: status === "active" ? legacy.start_at : null,
    target_completion_date: legacy.target_end_at,
    completion_date: status === "completed" ? legacy.target_end_at : null,
    archive_date: status === "archived" ? now : null,
    next_review_date: null,
  };

  const memberships: InitiativeMembershipRecord[] = [
    {
      membership_id: `mem-${initiative_id}-exec`,
      initiative_id,
      human_id: legacy.executive_owner_human_id,
      institution_membership_id: `mem-${legacy.executive_owner_human_id}`,
      institution_id: legacy.institution_id,
      role: "executive_owner",
      authority_level: "executive",
      status: "active",
      assigned_at: legacy.start_at ?? now,
      ended_at: null,
    },
    {
      membership_id: `mem-${initiative_id}-ops`,
      initiative_id,
      human_id: legacy.operational_owner_human_id,
      institution_membership_id: `mem-${legacy.operational_owner_human_id}`,
      institution_id: legacy.institution_id,
      role: "operational_owner",
      authority_level: "operational",
      status: "active",
      assigned_at: legacy.start_at ?? now,
      ended_at: null,
    },
  ];

  return {
    initiative,
    charter,
    scope,
    timeline,
    memberships,
    versions: [
      {
        initiative_version_id: `ver-${initiative_id}-1`,
        initiative_id,
        version_number: 1,
        change_summary: "Initial canonical projection from legacy store",
        trigger: "legacy_migration_projection",
        charter_id: charter.charter_id,
        scope_id: scope.scope_id,
        created_at: now,
        created_by: actor,
      },
    ],
    dependencies: [],
    reviews: [],
    history: [],
    closeout: null,
  };
}

export function projectLegacyInitiatives(legacyItems: LegacyInitiative[]): InitiativeAggregate[] {
  return legacyItems.map((l) => legacyInitiativeToCanonical(l));
}
