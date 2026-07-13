/**
 * CAE-11.12-W4 — Knowledge & Learning experience context
 */
import type { LearningExperienceRole } from "./view-models";

export type KnowledgeExperienceContext = {
  actor_human_id: string;
  institution_id: string;
  institution_name: string;
  active_membership_id: string;
  initiative_id_optional: string | null;
  permissions: string[];
  locale: "en" | "es";
  timezone: string;
};

export const DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT: KnowledgeExperienceContext = {
  actor_human_id: "usr-001",
  institution_id: "inst-block-street",
  institution_name: "Block Street",
  active_membership_id: "mem-001",
  initiative_id_optional: "ini-knowledge-default",
  permissions: ["civic_action.view", "civic_action.manage", "training.view"],
  locale: "en",
  timezone: "America/Chicago",
};

export function resolveLearningExperienceRole(
  permissions: string[]
): LearningExperienceRole {
  if (permissions.includes("civic_action.manage")) return "administrator";
  if (permissions.includes("training.manage")) return "instructor";
  if (permissions.includes("training.view")) return "learner";
  return "volunteer";
}

export function roleFocusLabels(role: LearningExperienceRole, locale: "en" | "es"): string[] {
  if (role === "executive" || role === "administrator") {
    return locale === "es"
      ? ["Riesgos de conocimiento", "Certificaciones", "Mejoras prioritarias"]
      : ["Knowledge risks", "Certifications", "Priority improvements"];
  }
  if (role === "knowledge_steward" || role === "reviewer") {
    return locale === "es"
      ? ["Revisiones pendientes", "Fuentes rotas", "Contradicciones"]
      : ["Reviews due", "Broken sources", "Contradictions"];
  }
  return locale === "es"
    ? ["Continuar aprendiendo", "Próxima lección", "Competencias"]
    : ["Continue learning", "Next lesson", "Competencies"];
}
