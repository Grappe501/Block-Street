/** CAE-11.2-W2 — Execution entity versioning */

export const VERSION_TRIGGERS = [
  "purpose_changed",
  "owner_changed",
  "target_changed",
  "lifecycle_changed",
  "measurement_changed",
  "scope_changed",
  "priority_changed",
  "relationship_changed",
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
    protocol: "11.2-W2",
    principle: "Every change creates version record; history is permanent; nothing overwritten",
    triggers: VERSION_TRIGGERS,
    version_record_fields: ["version_number", "timestamp", "changed_by", "reason", "affected_fields", "previous_version"],
    entities_versioned: [
      "Objective",
      "KeyResult",
      "Workstream",
      "Mission",
      "Milestone",
      "Deliverable",
      "Task",
    ],
    immutable: ["execution_versions", "execution_history_events"],
  };
}
