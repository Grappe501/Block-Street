/** Version triggers — CAE-11.1-W2 versioning rules */

export const VERSION_TRIGGERS = [
  "purpose_changed",
  "owner_changed",
  "scope_changed",
  "institution_changed",
  "visibility_changed",
  "governance_class_changed",
  "charter_major_edit",
  "type_changed",
] as const;

export type VersionTrigger = (typeof VERSION_TRIGGERS)[number];

export function requiresNewVersion(trigger: string): boolean {
  return VERSION_TRIGGERS.includes(trigger as VersionTrigger);
}

export function nextVersionNumber(current: number): number {
  return current + 1;
}

export function getVersioningRules() {
  return {
    wave: "11.1-W2",
    principle: "No overwrite — every major change creates a new version record",
    triggers: VERSION_TRIGGERS,
    entities_versioned: ["initiative", "charter", "scope"],
    immutable: ["initiative_history_events", "initiative_versions"],
  };
}
