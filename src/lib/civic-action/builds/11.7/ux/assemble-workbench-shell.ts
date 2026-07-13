/**
 * CAE-11.7-W4 — Role-aware collaboration workbench shell
 */
import type { CommunicationExperienceContext } from "./experience-context";
import { roleFocusLabels } from "./experience-context";
import { t } from "./locale";
import type { CollaborationWorkbenchShellView, CommunicationExperienceRole } from "./view-models";

const ALL_NAV = [
  { key: "home", path: "/communications" },
  { key: "brief", path: "/communications/brief" },
  { key: "missions", path: "/communications/missions" },
  { key: "meetings", path: "/communications/meetings" },
  { key: "documents", path: "/communications/documents" },
  { key: "decisions", path: "/communications/decisions" },
  { key: "knowledge", path: "/communications/knowledge" },
  { key: "notifications", path: "/communications/notifications" },
  { key: "search", path: "/communications/search" },
] as const;

const VOLUNTEER_NAV_KEYS = new Set(["home", "brief", "notifications"]);

function navKeysForRole(role: CommunicationExperienceRole): Set<string> {
  if (role === "volunteer" || role === "viewer") return VOLUNTEER_NAV_KEYS;
  if (role === "contributor") return new Set(["home", "brief", "missions", "meetings", "notifications", "search"]);
  return new Set(ALL_NAV.map((n) => n.key));
}

export function assembleCollaborationWorkbenchShell(
  ctx: CommunicationExperienceContext,
  role: CommunicationExperienceRole,
  activeSectionKey: string
): CollaborationWorkbenchShellView {
  const allowed = navKeysForRole(role);
  return {
    institution_name: ctx.institution_name,
    viewer_role: role,
    viewer_role_label: t(ctx.locale, `role.${role}`),
    nav_sections: ALL_NAV.filter((n) => allowed.has(n.key)).map((n) => ({
      key: n.key,
      label: t(ctx.locale, `nav.${n.key}`),
      href: n.path,
    })),
    active_section_key: activeSectionKey,
  };
}

export function shellRoleFocus(role: CommunicationExperienceRole, locale: "en" | "es"): string[] {
  return roleFocusLabels(role, locale);
}
