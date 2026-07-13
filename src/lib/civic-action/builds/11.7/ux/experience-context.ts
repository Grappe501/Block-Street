/**
 * CAE-11.7-W4 — Communication experience context
 */
import type { CommunicationExperienceRole } from "./view-models";

export type CommunicationExperienceContext = {
  actor_human_id: string;
  institution_id: string;
  institution_name: string;
  active_membership_id: string;
  permissions: string[];
  locale: "en" | "es";
};

export const DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT: CommunicationExperienceContext = {
  actor_human_id: "usr-001",
  institution_id: "inst-block-street",
  institution_name: "Block Street",
  active_membership_id: "mem-001",
  permissions: [
    "civic_action.manage",
    "communication.conversation.create",
    "communication.thread.create",
    "communication.message.post",
    "communication.message.edit",
    "communication.decision.record",
    "communication.meeting.create",
    "communication.document.create",
    "communication.conversation.archive",
    "communication.ai.summary",
    "communication.action_item.create",
    "communication.thread.resolve",
    "communication.announcement.publish",
  ],
  locale: "en",
};

export function resolveCommunicationExperienceRole(
  actorHumanId: string,
  ownerHumanId: string,
  moderatorIds: string[],
  participantIds: string[],
  permissions: string[]
): CommunicationExperienceRole {
  if (permissions.includes("civic_action.manage")) return "executive";
  if (actorHumanId === ownerHumanId) return "operational_owner";
  if (moderatorIds.includes(actorHumanId)) return "mission_lead";
  if (permissions.includes("communication.message.post") && participantIds.includes(actorHumanId)) {
    return "contributor";
  }
  if (permissions.includes("communication.message.post")) return "volunteer";
  if (participantIds.includes(actorHumanId)) return "viewer";
  return "viewer";
}

export function humanLabel(humanId: string): string {
  if (!humanId) return "Unassigned";
  if (humanId === "usr-001") return "Steve Grappe";
  if (humanId === "usr-002") return "Maria Lopez";
  return humanId.replace(/^usr-/, "Member ");
}

export function roleFocusLabels(role: CommunicationExperienceRole, locale: "en" | "es"): string[] {
  const en: Record<CommunicationExperienceRole, string[]> = {
    executive: ["Priority Conversations", "Pending Decisions", "Mission Updates", "Institutional Brief"],
    operational_owner: ["Today's Brief", "Action Items", "Meetings", "Documents", "Mentions"],
    mission_lead: ["Mission Threads", "Decisions", "Action Items", "Knowledge Capture"],
    contributor: ["My Mentions", "Assigned Actions", "Active Threads", "Upcoming Meetings"],
    volunteer: ["Today's Messages", "Directions", "Contacts", "Simple Actions"],
    viewer: ["Announcements", "Published Decisions", "Public Documents"],
  };
  const es: Record<CommunicationExperienceRole, string[]> = {
    executive: ["Conversaciones Prioritarias", "Decisiones Pendientes", "Actualizaciones", "Resumen"],
    operational_owner: ["Resumen de Hoy", "Acciones", "Reuniones", "Documentos", "Menciones"],
    mission_lead: ["Hilos de Misión", "Decisiones", "Acciones", "Conocimiento"],
    contributor: ["Mis Menciones", "Acciones Asignadas", "Hilos Activos", "Próximas Reuniones"],
    volunteer: ["Mensajes de Hoy", "Indicaciones", "Contactos", "Acciones Simples"],
    viewer: ["Anuncios", "Decisiones Publicadas", "Documentos Públicos"],
  };
  return locale === "es" ? es[role] : en[role];
}
