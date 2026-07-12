/**
 * CAE-11.2-W4 — Experience context
 */
import type { ObjectiveExperienceRole } from "./view-models";

export type ObjectiveExperienceContext = {
  actor_human_id: string;
  institution_id: string;
  institution_name: string;
  active_membership_id: string;
  permissions: string[];
  locale: "en" | "es";
};

export const DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT: ObjectiveExperienceContext = {
  actor_human_id: "usr-001",
  institution_id: "inst-block-street",
  institution_name: "Block Street",
  active_membership_id: "mem-001",
  permissions: [
    "civic_action.manage",
    "execution.objective.create",
    "execution.objective.propose",
    "execution.objective.approve",
    "execution.objective.activate",
    "execution.mission.create",
    "execution.mission.start",
    "execution.task.create",
    "execution.task.assign",
    "execution.evidence.attach",
    "execution.outcome.record",
  ],
  locale: "en",
};

export function resolveObjectiveExperienceRole(
  actorHumanId: string,
  executiveOwnerId: string,
  operationalOwnerId: string,
  permissions: string[]
): ObjectiveExperienceRole {
  if (permissions.includes("civic_action.manage")) return "administrator";
  if (actorHumanId === executiveOwnerId) return "executive_owner";
  if (actorHumanId === operationalOwnerId) return "operational_owner";
  if (permissions.includes("execution.task.assign")) return "contributor";
  return "viewer";
}

export function humanLabel(humanId: string): string {
  if (!humanId) return "Unassigned";
  if (humanId === "usr-001") return "Steve Grappe";
  if (humanId === "usr-002") return "Maria Lopez";
  return humanId.replace(/^usr-/, "Member ");
}

export function roleFocusLabels(role: ObjectiveExperienceRole, locale: "en" | "es"): string[] {
  const en: Record<ObjectiveExperienceRole, string[]> = {
    executive_owner: ["Strategic Progress", "Objective Health", "Key Results", "Risks", "Executive Decisions"],
    operational_owner: ["Today's Work", "Blocked Missions", "People", "Timeline", "Reviews", "Dependencies"],
    contributor: ["Assigned Missions", "Today's Tasks", "Upcoming Deadlines", "Evidence Needed"],
    volunteer: ["Today's Mission", "Directions", "Contacts", "Checklist", "Submit Evidence"],
    viewer: ["Purpose", "Progress", "Public Outcomes"],
    administrator: ["Governance", "Ownership", "Lifecycle", "Audit"],
  };
  const es: Record<ObjectiveExperienceRole, string[]> = {
    executive_owner: ["Progreso Estratégico", "Salud del Objetivo", "Resultados Clave", "Riesgos"],
    operational_owner: ["Trabajo de Hoy", "Misiones Bloqueadas", "Personas", "Cronograma", "Revisiones"],
    contributor: ["Misiones Asignadas", "Tareas de Hoy", "Fechas Límite", "Evidencia Necesaria"],
    volunteer: ["Misión de Hoy", "Direcciones", "Contactos", "Lista de Verificación"],
    viewer: ["Propósito", "Progreso", "Resultados"],
    administrator: ["Gobernanza", "Propiedad", "Ciclo de Vida"],
  };
  return locale === "es" ? es[role] : en[role];
}
