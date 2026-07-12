/**
 * CAE-11.2-W1 — Objective Execution System constitution (OBJ-001)
 */
export const OBJ_GOVERNING_PRINCIPLE =
  "An Initiative may exist without Objectives. Execution may never exist without Objectives. Every Mission, Task, Calendar Event, Resource Assignment, Budget Item, Volunteer Assignment, Communication Campaign, or Automation must ultimately trace back to an Objective.";

export const OBJECTIVE_DEFINITION =
  "An Objective describes the future state the institution intends to create — not a task, meeting, calendar event, project plan, or checklist.";

export const OBJECTIVE_FORMULA =
  "Current State + Desired State + Evidence of Success + Time Horizon + Responsible Owners + Measurement + Review Rhythm = Governed Objective";

export const EXECUTION_HIERARCHY = [
  "institution",
  "initiative",
  "objective",
  "key_result",
  "workstream",
  "mission",
  "milestone",
  "deliverable",
  "task",
  "activity",
  "evidence",
  "outcome",
  "lessons_learned",
] as const;

export const TRACEABILITY_CHAIN = [
  "task",
  "mission",
  "workstream",
  "objective",
  "initiative",
  "institution",
] as const;

export const CONSTITUTIONAL_COMMITMENTS = [
  "Every Objective belongs to exactly one Initiative",
  "Every Key Result belongs to exactly one Objective",
  "Every Workstream belongs to one primary Objective",
  "Every Mission belongs to one Workstream",
  "Every Deliverable belongs to one Mission",
  "Every Task belongs to one Mission",
  "Calendar events, resources, communications, and budget items trace to an Objective",
  "Objectives may not become Active until parent Initiative is Active",
  "AI may recommend Objectives but may never approve them",
  "Completed work retains permanent traceability",
  "Archived Objectives remain searchable institutional memory",
  "No orphan work is permitted",
] as const;

export const OBJECTIVE_TYPES = [
  { type: "strategic", definition: "Long-horizon institutional direction tied to mission outcomes." },
  { type: "operational", definition: "Day-to-day execution outcomes supporting active Initiatives." },
  { type: "community", definition: "Community-facing change the institution intends to create." },
  { type: "legislative", definition: "Policy or civic outcomes requiring governed advocacy." },
  { type: "educational", definition: "Learning, training, or certification outcomes." },
  { type: "campaign", definition: "Time-bounded mobilization targets with measurable reach." },
  { type: "technology", definition: "Platform, tooling, or data outcomes." },
  { type: "financial", definition: "Funding, budget, or resource sustainability outcomes." },
  { type: "volunteer", definition: "Volunteer recruitment, retention, or capacity outcomes." },
  { type: "membership", definition: "Membership growth, engagement, or retention outcomes." },
  { type: "training", definition: "Skill development and readiness outcomes." },
  { type: "research", definition: "Evidence, findings, or analysis outcomes." },
  { type: "emergency", definition: "Short-horizon urgent outcomes under emergency governance." },
] as const;

export const OBJECTIVE_LIFECYCLE = [
  "draft",
  "proposed",
  "approved",
  "ready",
  "active",
  "on_track",
  "needs_attention",
  "at_risk",
  "completed",
  "partially_achieved",
  "superseded",
  "archived",
] as const;

export const OUTCOME_CATEGORIES = [
  "achieved",
  "exceeded",
  "partially_achieved",
  "not_achieved",
  "cancelled",
  "replaced",
  "continuing",
  "unable_to_measure",
] as const;

export const REVIEW_RHYTHMS = ["weekly", "biweekly", "monthly", "quarterly", "custom"] as const;

export const OBJECTIVE_CHARACTERISTICS = [
  "why_does_this_matter",
  "what_changes",
  "who_benefits",
  "how_will_we_know",
  "who_owns_success",
  "when_should_it_exist",
  "what_evidence_proves_success",
  "what_assumptions_exist",
  "what_constraints_exist",
] as const;

export const OWNERSHIP_ROLES = [
  "executive_owner",
  "operational_owner",
  "review_authority",
  "contributor",
  "observer",
] as const;

export const REQUIRED_DOMAIN_SERVICES = [
  "ObjectiveService",
  "KeyResultService",
  "WorkstreamService",
  "MissionService",
  "MilestoneService",
  "DeliverableService",
  "TaskService",
  "ObjectiveLifecycleService",
  "ObjectiveReviewService",
  "ObjectiveTraceabilityService",
] as const;

export const PROHIBITED_PATTERNS = [
  "orphan_task",
  "orphan_mission",
  "orphan_workstream",
  "objective_without_initiative",
  "execution_without_objective",
  "task_without_mission",
  "deliverable_without_mission",
  "active_objective_inactive_initiative",
  "ai_approved_objective",
  "silent_traceability_break",
  "binary_success_only_reporting",
  "meeting_as_objective",
  "checklist_as_objective",
] as const;

export const PROHIBITED_BEHAVIORS = [
  "Task without Mission parent",
  "Mission without Workstream parent",
  "Workstream without primary Objective",
  "Objective without Initiative",
  "Active Objective under inactive Initiative",
  "Calendar event without Objective trace",
  "Resource allocation without Objective trace",
  "Budget item without Objective trace",
  "Communication campaign without Objective trace",
  "Automation without Objective trace",
  "AI approval of Objectives",
  "Deleting traceability history",
  "Treating completed Task as successful Objective",
];

export const SUCCESS_DOCTRINE = [
  "A completed Task does not imply a successful Mission",
  "A completed Mission does not imply a successful Objective",
  "A completed Objective does not imply a successful Initiative",
  "Each layer evaluates independently",
  "Honest outcome categories are required",
] as const;

export const AI_MAY_ASSIST = [
  "Recommend Objectives from Initiative context",
  "Suggest Key Results",
  "Identify missing measurement",
  "Summarize execution progress",
  "Detect orphan work patterns",
  "Propose Workstream structure",
  "Draft review summaries",
];

export const AI_MAY_NOT = [
  "Approve an Objective",
  "Activate an Objective",
  "Create Tasks without Mission traceability",
  "Break traceability chain",
  "Declare Objective achieved without Human review",
  "Reassign Objective ownership autonomously",
  "Delete execution history",
  "Bypass parent Initiative Active gate",
];

export const SPANISH_GLOSSARY: Record<string, { en: string; es: string }> = {
  objective: { en: "Objective", es: "Objetivo" },
  key_result: { en: "Key Result", es: "Resultado Clave" },
  workstream: { en: "Workstream", es: "Línea de Trabajo" },
  mission: { en: "Mission", es: "Misión" },
  milestone: { en: "Milestone", es: "Hito" },
  deliverable: { en: "Deliverable", es: "Entregable" },
  task: { en: "Task", es: "Tarea" },
  activity: { en: "Activity", es: "Actividad" },
  evidence: { en: "Evidence", es: "Evidencia" },
  outcome: { en: "Outcome", es: "Resultado" },
  lessons_learned: { en: "Lessons Learned", es: "Lecciones Aprendidas" },
  executive_owner: { en: "Executive Owner", es: "Responsable Ejecutivo" },
  operational_owner: { en: "Operational Owner", es: "Responsable de Operaciones" },
  review_authority: { en: "Review Authority", es: "Autoridad de Revisión" },
  contributor: { en: "Contributor", es: "Colaborador" },
  observer: { en: "Observer", es: "Observador" },
  on_track: { en: "On Track", es: "En Curso" },
  needs_attention: { en: "Needs Attention", es: "Requiere Atención" },
  at_risk: { en: "At Risk", es: "En Riesgo" },
  partially_achieved: { en: "Partially Achieved", es: "Parcialmente Logrado" },
  superseded: { en: "Superseded", es: "Reemplazado" },
  achieved: { en: "Achieved", es: "Logrado" },
  not_achieved: { en: "Not Achieved", es: "No Logrado" },
  traceability: { en: "Traceability", es: "Trazabilidad" },
  orphan_work: { en: "Orphan Work", es: "Trabajo Huérfano" },
};

export function getObjectiveConstitution() {
  return {
    system_id: "OBJ-001",
    wave: "11.2-W1",
    status: "documented",
    governing_principle: OBJ_GOVERNING_PRINCIPLE,
    definition: OBJECTIVE_DEFINITION,
    formula: OBJECTIVE_FORMULA,
    execution_hierarchy: EXECUTION_HIERARCHY,
    traceability_chain: TRACEABILITY_CHAIN,
    commitments: CONSTITUTIONAL_COMMITMENTS,
    types: OBJECTIVE_TYPES,
    lifecycle: OBJECTIVE_LIFECYCLE,
    outcome_categories: OUTCOME_CATEGORIES,
    review_rhythms: REVIEW_RHYTHMS,
    characteristics: OBJECTIVE_CHARACTERISTICS,
    ownership_roles: OWNERSHIP_ROLES,
    required_services: REQUIRED_DOMAIN_SERVICES,
    prohibited_patterns: PROHIBITED_PATTERNS,
    prohibited: PROHIBITED_BEHAVIORS,
    success_doctrine: SUCCESS_DOCTRINE,
    ai_may_assist: AI_MAY_ASSIST,
    ai_may_not: AI_MAY_NOT,
    spanish_glossary: SPANISH_GLOSSARY,
  };
}
