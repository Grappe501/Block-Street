export const INI_GOVERNING_PRINCIPLE =
  "Every organized body of work must have a clear purpose, an accountable Human, an authorized institution, a defined scope, and a measurable reason for existing.";

export const INITIATIVE_DEFINITION =
  "An Initiative is the canonical platform container for a coordinated, time-bounded or continuously governed body of work undertaken by one or more institutions to produce a defined result.";

export const INITIATIVE_FORMULA =
  "Identified Need + Institutional Authority + Clear Purpose + Accountable Human Ownership + Defined Scope + Expected Outcome = Governed Initiative";

export const EXECUTION_HIERARCHY = [
  "institutional_mission",
  "strategic_priority",
  "initiative",
  "objective",
  "workstream",
  "mission",
  "task",
  "evidence",
  "outcome",
  "learning",
] as const;

export const CONSTITUTIONAL_COMMITMENTS = [
  "Every initiative belongs to one governing institution",
  "Every active initiative has accountable Human owners",
  "Every active initiative has approved purpose",
  "Every active initiative has defined scope",
  "Every initiative follows a governed lifecycle",
  "Every initiative has a closeout basis",
  "Initiative authority is bounded",
  "Active initiatives link to institutional strategy or mandate",
  "Major changes preserve version history",
  "AI may assist but cannot own or approve initiatives",
] as const;

export const INITIATIVE_TYPES = [
  { type: "program", definition: "Continuing or recurring organized body of work delivering ongoing value." },
  { type: "campaign", definition: "Time-bounded, goal-oriented effort intended to produce a specific measurable result." },
  { type: "project", definition: "Bounded effort producing a defined deliverable." },
  { type: "operation", definition: "Coordinated execution effort involving multiple active workstreams, often under time pressure." },
  { type: "pilot", definition: "Limited test designed to produce learning before broader adoption." },
  { type: "community_response", definition: "Coordinated response to an immediate community need." },
  { type: "educational_initiative", definition: "Organized effort primarily intended to produce learning or certification." },
  { type: "research_initiative", definition: "Governed body of work intended to answer questions and produce evidence." },
  { type: "coalition_initiative", definition: "Shared initiative involving more than one independent institution (COL-001)." },
  { type: "institutional_change", definition: "Organized effort to change how an institution operates." },
  { type: "emergency_initiative", definition: "Short-duration initiative authorized through emergency governance.", legacy_alias: "emergency_operation" },
  { type: "continuous_operating_function", definition: "Permanent institutional function requiring governed ownership and review." },
] as const;

export const INITIATIVE_LIFECYCLE = [
  "concept",
  "discovery",
  "design",
  "approval",
  "preparation",
  "active",
  "paused",
  "at_risk",
  "closing",
  "completed",
  "cancelled",
  "archived",
] as const;

export const CHARTER_STATUSES = [
  "incomplete",
  "draft",
  "ready_for_review",
  "approved",
  "active_version",
  "superseded",
  "archived",
] as const;

export const VISIBILITY_STATES = [
  "private",
  "institution_internal",
  "participating_institutions",
  "member_public",
  "public",
] as const;

export const GOVERNANCE_CLASSES = [
  { class: 1, name: "Routine", description: "Low-risk internal initiative" },
  { class: 2, name: "Managed", description: "Multiple teams, moderate resources" },
  { class: 3, name: "Significant", description: "Public impact, substantial resources, partners" },
  { class: 4, name: "High Risk", description: "Sensitive data, youth, legal exposure" },
  { class: 5, name: "Critical", description: "Emergency, public safety, statewide impact" },
] as const;

export const INITIATIVE_BOUNDARIES = {
  versus_program: "Programs are recurring; initiatives may become programs when sustained.",
  versus_campaign: "Campaigns are time-boxed targets; initiatives may contain campaigns.",
  versus_project: "Projects deliver artifacts; initiatives may contain multiple projects.",
  versus_operation: "Operations are coordinated execution; initiatives may host operational rhythms.",
  versus_pilot: "Pilots are limited scope with evaluation path.",
  versus_coalition: "Coalition initiatives use COL-001; single-institution initiatives use INI-001.",
  versus_workspace: "Workspace is interface context; deleting workspace must not delete initiative record.",
};

export const PROHIBITED_PATTERNS = [
  "ownerless_active_initiative",
  "zombie_initiative",
  "shell_initiative",
  "authority_laundering",
  "scope_creep_without_review",
  "duplicate_shadow_initiative",
  "ai_owned_initiative",
  "service_account_ownership",
  "hidden_initiative",
  "permanent_emergency",
  "vanity_initiative",
  "retroactive_initiative_without_labeling",
] as const;

export const PROHIBITED_BEHAVIORS = [
  "Ownerless active initiatives",
  "Service identity as executive, operational, or backup owner",
  "Anonymous ownership",
  "Initiative without institution_id",
  "Initiative without purpose",
  "Active initiative without scope",
  "Cross-institution data access without agreement",
  "Hidden executive override of initiative ownership",
  "AI autonomous initiative creation, approval, or closure",
  "Draft mistaken for execution authority",
  "Permanent emergency authority",
  "Silent scope expansion",
  "Silent history deletion",
];

export const AI_MAY_ASSIST = [
  "Draft initiative charter",
  "Suggest initiative types",
  "Identify missing fields",
  "Recommend objectives",
  "Summarize risks",
  "Identify possible duplication",
  "Suggest structure",
];

export const AI_MAY_NOT = [
  "Create active initiative without Human action",
  "Approve an initiative",
  "Serve as initiative owner",
  "Materially expand initiative scope",
  "Allocate high-risk resources",
  "Create institutional authority",
  "Cancel an initiative",
  "Declare successful completion",
];

export const AUTHORITY_RULES = {
  executive_owner: "Accountable for institutional legitimacy, strategic outcome, major escalation, closeout acceptance.",
  operational_owner: "Accountable for charter, workstreams, progress, blockers, reporting, closeout initiation.",
  backup_owner: "Authorized succession when operational owner unavailable.",
  institution: "Owns initiative data, authority, and membership scope.",
  coalition: "Coalition roles do not create authority inside member institutions.",
  owner_required: "Exception state when no eligible operational owner; high-risk execution pauses.",
};

export const PHASE_RELATIONSHIPS = {
  identity_trust_layer: "Every owner resolves to Global Human ID; institution context required on every action.",
  phase_5_ios: "Historical multi-community coordination; INI-001 extends with institutional governance.",
  phase_5_acn: "Action constitution principles aligned under Phase 11 execution hierarchy.",
  phase_10_outcomes: "Objectives link to OUT-001 outcome records.",
  phase_10_intelligence: "Strategic intelligence provides advisory signals only.",
  phase_10_participation: "Participation events may evidence initiative activity.",
  build_11_2: "Objectives defined in OBJ-001.",
  build_11_9: "Coalition mechanics in COL-001.",
};

export const SPANISH_GLOSSARY: Record<string, { en: string; es: string }> = {
  initiative: { en: "Initiative", es: "Iniciativa" },
  program: { en: "Program", es: "Programa" },
  campaign: { en: "Campaign", es: "Campaña" },
  project: { en: "Project", es: "Proyecto" },
  operation: { en: "Operation", es: "Operación" },
  pilot: { en: "Pilot", es: "Programa Piloto" },
  our_work: { en: "Our Work", es: "Nuestro Trabajo" },
  executive_owner: { en: "Executive Owner", es: "Responsable Ejecutivo" },
  operational_owner: { en: "Operational Owner", es: "Responsable de Operaciones" },
  backup_owner: { en: "Backup Owner", es: "Responsable Suplente" },
  purpose: { en: "Purpose", es: "Propósito" },
  charter: { en: "Initiative Charter", es: "Carta de la Iniciativa" },
  scope: { en: "Scope", es: "Alcance" },
  in_scope: { en: "In Scope", es: "Incluido en el Alcance" },
  out_of_scope: { en: "Out of Scope", es: "Fuera del Alcance" },
  approval: { en: "Approval", es: "Aprobación" },
  active: { en: "Active", es: "Activa" },
  paused: { en: "Paused", es: "En Pausa" },
  at_risk: { en: "At Risk", es: "En Riesgo" },
  closing: { en: "Closing", es: "En Cierre" },
  completed: { en: "Completed", es: "Completada" },
  cancelled: { en: "Cancelled", es: "Cancelada" },
  archived: { en: "Archived", es: "Archivada" },
  workstream: { en: "Workstream", es: "Línea de Trabajo" },
  mission: { en: "Mission", es: "Misión" },
  evidence: { en: "Evidence", es: "Evidencia" },
  owner_required: { en: "Owner Required", es: "Responsable Requerido" },
};

export function getInitiativeConstitution() {
  return {
    system_id: "INI-001",
    wave: "11.1-W1",
    status: "documented",
    governing_principle: INI_GOVERNING_PRINCIPLE,
    definition: INITIATIVE_DEFINITION,
    formula: INITIATIVE_FORMULA,
    execution_hierarchy: EXECUTION_HIERARCHY,
    commitments: CONSTITUTIONAL_COMMITMENTS,
    types: INITIATIVE_TYPES,
    lifecycle: INITIATIVE_LIFECYCLE,
    charter_statuses: CHARTER_STATUSES,
    visibility_states: VISIBILITY_STATES,
    governance_classes: GOVERNANCE_CLASSES,
    boundaries: INITIATIVE_BOUNDARIES,
    prohibited_patterns: PROHIBITED_PATTERNS,
    prohibited: PROHIBITED_BEHAVIORS,
    ai_may_assist: AI_MAY_ASSIST,
    ai_may_not: AI_MAY_NOT,
    authority: AUTHORITY_RULES,
    phase_relationships: PHASE_RELATIONSHIPS,
    spanish_glossary: SPANISH_GLOSSARY,
  };
}
