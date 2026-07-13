/**
 * CAE-11.12-W5 — Default Knowledge API experience context
 */
export const DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT = {
  actor_human_id: "usr-001",
  institution_id: "inst-block-street",
  institution_name: "Block Street",
  active_membership_id: "mem-001",
  initiative_id_optional: "ini-knowledge-default",
  permissions: ["civic_action.view", "civic_action.manage", "training.view"],
  locale: "en" as const,
};
