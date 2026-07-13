/**
 * CAE-11.12-W5 — External adapter registry (replaceable integrations)
 */
export type ExternalAdapterContract = {
  adapter_id: string;
  provider: string;
  supported_actions: string[];
  authentication_method: string;
  authority_scope: Record<string, string>;
  sync_direction: "inbound" | "outbound" | "bidirectional";
  conflict_policy: string;
  status: "registered" | "active" | "disabled";
};

export const EXTERNAL_ADAPTER_REGISTRY: ExternalAdapterContract[] = [
  {
    adapter_id: "ext-lms-generic",
    provider: "external_lms",
    supported_actions: ["import_completion_candidate", "import_enrollment_candidate"],
    authentication_method: "oauth2",
    authority_scope: {
      completion_record: "external_lms_authoritative",
      competency: "internal_knowledge_engine_authoritative",
      certification: "internal_knowledge_engine_authoritative",
    },
    sync_direction: "inbound",
    conflict_policy: "internal_wins_for_canonical_truth",
    status: "registered",
  },
  {
    adapter_id: "ext-scorm",
    provider: "scorm_package",
    supported_actions: ["import_package", "import_activity_statement"],
    authentication_method: "signed_upload",
    authority_scope: {
      package_content: "external_scorm_authoritative",
      completion: "internal_knowledge_engine_authoritative_after_validation",
    },
    sync_direction: "inbound",
    conflict_policy: "version_and_attribute_source",
    status: "registered",
  },
];

export function getExternalAdapter(adapterId: string) {
  return EXTERNAL_ADAPTER_REGISTRY.find((a) => a.adapter_id === adapterId) ?? null;
}
