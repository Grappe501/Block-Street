import { loadEditorialAssignments } from "./data";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  author: ["content.view", "content.create", "content.edit_own", "content.submit_review", "media.upload"],
  editor: ["content.view", "content.create", "content.edit_all", "content.submit_review", "content.review", "content.request_changes", "media.upload"],
  approver: ["content.view", "content.review", "content.approve", "content.request_changes"],
  publisher: ["content.view", "content.publish", "content.schedule", "content.archive"],
  content_administrator: ["content.view", "content.create", "content.edit_all", "content.approve", "content.publish", "content.schedule", "content.archive", "content.manage_taxonomy", "media.upload", "media.approve"],
};

export function editorialPermissionsForUser(userId: string): string[] {
  const assignment = loadEditorialAssignments().find((a) => a.user_id === userId);
  if (!assignment) return ["content.view"];
  const perms = new Set<string>();
  for (const role of assignment.roles) {
    for (const p of ROLE_PERMISSIONS[role] ?? []) perms.add(p);
  }
  return [...perms];
}

export function hasContentPermission(userId: string, permission: string): boolean {
  return editorialPermissionsForUser(userId).includes(permission);
}
