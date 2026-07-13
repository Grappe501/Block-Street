/**
 * CAE-11.12-W4 — Role-aware learning workbench shell
 */
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { t } from "./locale";
import type { LearningExperienceRole, LearningWorkbenchShellView } from "./view-models";

const ALL_NAV = [
  { key: "home", path: "/learning" },
  { key: "mission", path: "/learning/mission" },
  { key: "knowledge", path: "/learning/knowledge" },
  { key: "learning", path: "/learning/courses" },
  { key: "competencies", path: "/learning/competencies" },
  { key: "certifications", path: "/learning/certifications" },
  { key: "research", path: "/learning/research" },
] as const;

const LEARNER_NAV_KEYS = new Set(["home", "knowledge", "learning", "competencies", "certifications"]);

function navKeysForRole(role: LearningExperienceRole): Set<string> {
  if (role === "learner" || role === "volunteer") return LEARNER_NAV_KEYS;
  if (role === "knowledge_steward" || role === "reviewer" || role === "instructor") {
    return new Set(["home", "knowledge", "learning", "competencies", "certifications", "research"]);
  }
  return new Set(ALL_NAV.map((n) => n.key));
}

export function assembleLearningWorkbenchShell(
  ctx: KnowledgeExperienceContext,
  roleOptional?: LearningExperienceRole,
  activeSectionKey = "home"
): LearningWorkbenchShellView {
  const role = roleOptional ?? resolveLearningExperienceRole(ctx.permissions);
  const allowed = navKeysForRole(role);

  return {
    institution_name: ctx.institution_name,
    viewer_role: role,
    viewer_role_label:
      role === "administrator"
        ? t(ctx.locale, "role.administrator")
        : role === "instructor"
          ? t(ctx.locale, "role.instructor")
          : role === "knowledge_steward"
            ? t(ctx.locale, "role.knowledge_steward")
            : role === "executive"
              ? t(ctx.locale, "role.executive")
              : t(ctx.locale, "role.learner"),
    nav_sections: ALL_NAV.filter((n) => allowed.has(n.key)).map((n) => ({
      key: n.key,
      label: t(ctx.locale, `nav.${n.key}`),
      href: n.path,
    })),
    active_section_key: activeSectionKey,
    context_panel: {
      related_knowledge: [],
      recent_activity: [],
      people: [{ id: ctx.actor_human_id, label: "You", role: role }],
    },
  };
}
