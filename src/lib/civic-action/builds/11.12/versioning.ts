/** CAE-11.12-W2 — Knowledge entity versioning */

export const VERSION_TRIGGERS = [
  "body_changed",
  "claim_changed",
  "owner_changed",
  "lifecycle_changed",
  "evidence_changed",
  "competency_changed",
  "course_content_changed",
  "certification_requirement_changed",
  "translation_changed",
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
    protocol: "11.12-W2",
    principle: "Every change creates version record; history is permanent; nothing overwritten",
    triggers: VERSION_TRIGGERS,
    version_record_fields: [
      "version_number",
      "timestamp",
      "changed_by",
      "reason",
      "affected_fields",
      "previous_version",
    ],
    entities_versioned: [
      "KnowledgeArtifact",
      "KnowledgeClaim",
      "Course",
      "Module",
      "Lesson",
      "Competency",
      "Certification",
      "Playbook",
      "StandardOperatingProcedure",
    ],
    immutable: ["knowledge_versions", "knowledge_version_audit", "knowledge_history_events"],
    completion_version_binding: "LearningCompletion binds bound_course_version and bound_artifact_version",
  };
}
