/**
 * CAE-11.6-W1 — Institutional Operations & Strategic Planning Constitution (OPS-001)
 */
export const OPS_GOVERNING_PRINCIPLE =
  'Every action should answer one simple question: "Why are we doing this?" If the platform cannot answer that question, the work has become disconnected from the mission.';

export const STRATEGIC_ARCHITECTURE = [
  "purpose",
  "core_values",
  "vision",
  "mission",
  "strategic_pillars",
  "strategic_goals",
  "strategic_objectives",
  "key_results",
  "programs",
  "projects",
  "missions",
  "tasks",
  "execution",
  "measurement",
  "institutional_learning",
] as const;

export const TRACEABILITY_CHAIN = [
  "task",
  "mission",
  "project",
  "program",
  "key_result",
  "strategic_objective",
  "strategic_goal",
  "strategic_pillar",
  "mission_statement",
  "vision",
  "purpose",
  "institution",
] as const;

export const PLANNING_HORIZONS = [
  "30_days",
  "90_days",
  "6_months",
  "1_year",
  "2_years",
  "5_years",
  "10_years",
  "lifetime",
] as const;

export const INSTITUTIONAL_PRIORITIES = ["critical", "high", "medium", "low", "future"] as const;

export const DEPENDENCY_TYPES = ["blocks", "supports", "enables", "requires", "related", "alternative"] as const;

export const REVIEW_CYCLES = ["weekly", "monthly", "quarterly", "semiannual", "annual"] as const;

export const CORE_VALUE_EXAMPLES = [
  "Integrity",
  "Service",
  "Stewardship",
  "Transparency",
  "Respect",
  "Innovation",
] as const;

export const STRATEGIC_PILLAR_EXAMPLES = [
  "Education",
  "Community",
  "Operations",
  "Technology",
  "Finance",
  "Growth",
  "Research",
  "Public Engagement",
  "Infrastructure",
  "Human Development",
] as const;

export const CONSTITUTIONAL_COMMITMENTS = [
  "Every operational object traces to Purpose through Mission and strategic hierarchy",
  "Only one active Purpose exists at a time; historical versions remain immutable",
  "Key Results never exist without a Strategic Objective",
  "Programs link to owning objectives; Projects link to Programs",
  "Risks and assumptions are first-class governed objects",
  "Priority affects planning—not Human value",
  "AI may assist strategic analysis but never changes plans without Human approval",
  "No orphan operational work is permitted",
  "Traceability fields are never optional on governed objects",
  "Strategic reviews record changes, risks, and lessons learned",
] as const;

export const REQUIRED_DOMAIN_SERVICES = [
  "VisionService",
  "MissionService",
  "GoalService",
  "ObjectiveService",
  "KeyResultService",
  "ProgramService",
  "ProjectService",
  "MissionTemplateService",
  "StrategicPlanningService",
  "RiskService",
  "DependencyService",
  "StrategicTimelineService",
  "ReviewService",
  "ExecutiveDashboardService",
  "AIStrategyAdvisor",
] as const;

export const AI_MAY_ASSIST = [
  "Summarize strategic progress",
  "Identify bottlenecks and duplicate work",
  "Suggest priorities and review topics",
  "Forecast delays and detect conflicting goals",
  "Explain how work contributes to mission",
  "Identify missing dependencies",
] as const;

export const AI_MAY_NOT = [
  "Approve strategic plans or change objectives autonomously",
  "Publish mission or vision without Human approval",
  "Assign institutional priority without Human authority",
  "Close risks or assumptions without review",
  "Rank Human worth or loyalty",
] as const;

export const SPANISH_GLOSSARY: Record<string, { en: string; es: string }> = {
  purpose: { en: "Purpose", es: "Propósito" },
  vision: { en: "Vision", es: "Visión" },
  mission: { en: "Mission", es: "Misión" },
  pillar: { en: "Strategic Pillar", es: "Pilar estratégico" },
  goal: { en: "Strategic Goal", es: "Meta estratégica" },
  objective: { en: "Objective", es: "Objetivo" },
  key_result: { en: "Key Result", es: "Resultado clave" },
  program: { en: "Program", es: "Programa" },
  project: { en: "Project", es: "Proyecto" },
  risk: { en: "Risk", es: "Riesgo" },
  assumption: { en: "Assumption", es: "Supuesto" },
  review: { en: "Strategic Review", es: "Revisión estratégica" },
  why: { en: "Why are we doing this?", es: "¿Por qué hacemos esto?" },
  priority: { en: "Priority", es: "Prioridad" },
  horizon: { en: "Planning Horizon", es: "Horizonte de planificación" },
  dashboard: { en: "Strategic Dashboard", es: "Panel estratégico" },
  traceability: { en: "Traceability", es: "Trazabilidad" },
  success: { en: "Success Criteria", es: "Criterios de éxito" },
  dependency: { en: "Dependency", es: "Dependencia" },
  timeline: { en: "Strategic Timeline", es: "Línea de tiempo estratégica" },
  executive: { en: "Executive", es: "Ejecutivo" },
  critical: { en: "Critical", es: "Crítico" },
  blocked: { en: "Blocked", es: "Bloqueado" },
};

export function getOperationsConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W1",
    status: "documented",
    governing_principle: OPS_GOVERNING_PRINCIPLE,
    strategic_architecture: [...STRATEGIC_ARCHITECTURE],
    traceability_chain: [...TRACEABILITY_CHAIN],
    planning_horizons: [...PLANNING_HORIZONS],
    commitments: [...CONSTITUTIONAL_COMMITMENTS],
    required_services: [...REQUIRED_DOMAIN_SERVICES],
    ai_may_assist: [...AI_MAY_ASSIST],
    ai_may_not: [...AI_MAY_NOT],
    spanish_glossary: SPANISH_GLOSSARY,
    pillar_examples: [...STRATEGIC_PILLAR_EXAMPLES],
    core_value_examples: [...CORE_VALUE_EXAMPLES],
  };
}
