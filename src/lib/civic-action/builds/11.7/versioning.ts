/** CAE-11.7-W3 — Communication entity versioning */

export const VERSION_TRIGGERS = [
  "content_changed",
  "owner_changed",
  "lifecycle_changed",
  "participant_changed",
  "visibility_changed",
  "moderation_changed",
] as const;

export type VersionTrigger = (typeof VERSION_TRIGGERS)[number];

export function requiresNewVersion(trigger: string): boolean {
  return VERSION_TRIGGERS.includes(trigger as VersionTrigger);
}

export function nextVersionNumber(current: number): number {
  return current + 1;
}
