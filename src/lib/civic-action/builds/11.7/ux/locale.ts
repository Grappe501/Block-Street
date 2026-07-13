/**
 * CAE-11.7-W4 — EN/ES strings for Communication Workbench
 */
type Locale = "en" | "es";

const EN: Record<string, string> = {
  "home.title": "My Communications",
  "home.subtitle": "Stay aligned on missions, decisions, and action.",
  "home.empty.title": "No conversations yet.",
  "home.empty.body": "Start a mission conversation to coordinate work with your team.",
  "home.empty.action": "Start a Conversation",
  "brief.title": "Today's Brief",
  "brief.empty": "Your brief will build automatically as conversations, decisions, and meetings happen.",
  "nav.home": "My Communications",
  "nav.missions": "Mission Conversations",
  "nav.meetings": "Meetings",
  "nav.documents": "Documents",
  "nav.decisions": "Decisions",
  "nav.knowledge": "Knowledge",
  "nav.notifications": "Notifications",
  "nav.search": "Search",
  "nav.brief": "Today's Brief",
  "role.executive": "Executive View",
  "role.operational_owner": "Operational View",
  "role.mission_lead": "Mission Lead View",
  "role.contributor": "Contributor View",
  "role.volunteer": "Volunteer View",
  "role.viewer": "Viewer",
  "banner.archived": "This conversation is archived. History remains available for learning.",
  "status.draft": "Draft",
  "status.open": "Open",
  "status.active": "Active",
  "status.resolved": "Resolved",
  "status.archived": "Archived",
  "q.conversations": "What conversations matter right now?",
  "q.decisions": "Which decisions need me?",
  "q.actions": "What action items are on me?",
  "q.changed": "What changed since I last checked?",
  "card.priority_conversations": "Priority Conversations",
  "card.mentions": "Mentions",
  "card.pending_decisions": "Pending Decisions",
  "card.meetings": "Upcoming Meetings",
  "card.action_items": "Action Items",
  "card.mission_updates": "Mission Updates",
  "card.ai_summary": "AI Summary",
  "error.permission.title": "You can view this conversation but cannot post or decide here.",
  "error.permission.body": "Ask the conversation owner or a moderator for access.",
  "es.progress.prompt": "¿Cómo va la conversación?",
  "es.decision.prompt": "¿Qué decidimos aquí?",
  "es.next.prompt": "¿Qué necesitamos hacer ahora?",
  "search.placeholder": "Ask in plain language — e.g. decisions about voter outreach",
  "offline.title": "Offline sync manifest",
  "offline.body": "Cached views refresh when you reconnect.",
  "a11y.nav.label": "Communication workbench sections",
  "a11y.timeline.label": "Conversation timeline",
};

const ES: Record<string, string> = {
  "home.title": "Mis Comunicaciones",
  "home.subtitle": "Mantente alineado en misiones, decisiones y acciones.",
  "home.empty.title": "Todavía no hay conversaciones.",
  "home.empty.body": "Abre una conversación de misión para coordinar con tu equipo.",
  "home.empty.action": "Empezar una Conversación",
  "brief.title": "Resumen de Hoy",
  "brief.empty": "Tu resumen se arma solo cuando hay conversaciones, decisiones y reuniones.",
  "nav.home": "Mis Comunicaciones",
  "nav.missions": "Conversaciones de Misión",
  "nav.meetings": "Reuniones",
  "nav.documents": "Documentos",
  "nav.decisions": "Decisiones",
  "nav.knowledge": "Conocimiento",
  "nav.notifications": "Notificaciones",
  "nav.search": "Buscar",
  "nav.brief": "Resumen de Hoy",
  "role.executive": "Vista Ejecutiva",
  "role.operational_owner": "Vista Operativa",
  "role.mission_lead": "Vista de Líder de Misión",
  "role.contributor": "Vista de Colaborador",
  "role.volunteer": "Vista de Voluntario",
  "role.viewer": "Observador",
  "banner.archived": "Esta conversación está archivada. El historial sigue disponible.",
  "status.draft": "Borrador",
  "status.open": "Abierta",
  "status.active": "Activa",
  "status.resolved": "Resuelta",
  "status.archived": "Archivada",
  "q.conversations": "¿Qué conversaciones importan ahora?",
  "q.decisions": "¿Qué decisiones me necesitan?",
  "q.actions": "¿Qué acciones tengo pendientes?",
  "q.changed": "¿Qué cambió desde la última vez?",
  "card.priority_conversations": "Conversaciones Prioritarias",
  "card.mentions": "Menciones",
  "card.pending_decisions": "Decisiones Pendientes",
  "card.meetings": "Próximas Reuniones",
  "card.action_items": "Acciones",
  "card.mission_updates": "Actualizaciones de Misión",
  "card.ai_summary": "Resumen con IA",
  "error.permission.title": "Puedes ver esta conversación pero no publicar ni decidir aquí.",
  "error.permission.body": "Pide acceso al dueño de la conversación o a un moderador.",
  "es.progress.prompt": "¿Cómo va la conversación?",
  "es.decision.prompt": "¿Qué decidimos aquí?",
  "es.next.prompt": "¿Qué necesitamos hacer ahora?",
  "search.placeholder": "Pregunta en lenguaje natural — p. ej. decisiones sobre alcance electoral",
  "offline.title": "Manifiesto de sincronización sin conexión",
  "offline.body": "Las vistas guardadas se actualizan cuando vuelvas a conectarte.",
  "a11y.nav.label": "Secciones del banco de comunicación",
  "a11y.timeline.label": "Línea de tiempo de la conversación",
};

export function t(locale: Locale, key: string, ...args: string[]): string {
  const table = locale === "es" ? ES : EN;
  let s = table[key] ?? EN[key] ?? key;
  args.forEach((a, i) => {
    s = s.replace(`{${i}}`, a);
  });
  return s;
}

export function conversationStatusLabel(status: string, locale: Locale): string {
  const key = `status.${status}`;
  return t(locale, key);
}

export const UX_INVARIANTS = [
  "CAE-11.7-W4-UX-001",
  "CAE-11.7-W4-UX-002",
  "CAE-11.7-W4-UX-003",
  "CAE-11.7-W4-UX-004",
  "CAE-11.7-W4-UX-005",
  "CAE-11.7-W4-UX-006",
  "CAE-11.7-W4-UX-007",
  "CAE-11.7-W4-UX-008",
  "CAE-11.7-W4-UX-009",
  "CAE-11.7-W4-UX-010",
] as const;
