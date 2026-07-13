/**
 * CAE-11.12-W2.29 — TypeScript contract types for knowledge canonical model
 */
import type {
  AIKnowledgeSuggestionRecord,
  AssessmentRecord,
  CertificationAwardRecord,
  CertificationRecord,
  CitationRecord,
  CompetencyRecord,
  CourseRecord,
  KnowledgeArtifactRecord,
  KnowledgeClaimRecord,
  KnowledgeVersionRecord,
  LearningCompletionRecord,
} from "./data-model";
import type { CanonicalKnowledgeEntity } from "./entity-registry";

export interface KnowledgeDatabaseContract {
  contract_id: string;
  protocol: "11.12-W2";
  system_id: "ADP-001";
  principle: string;
  tables: KnowledgeTableContract[];
}

export interface KnowledgeTableContract {
  name: string;
  primary_key: string;
  foreign_keys?: Record<string, string>[];
  required_fields?: string[];
  constraints?: string[];
  immutable?: boolean;
  append_only?: boolean;
  polymorphic_link?: boolean;
}

export interface KnowledgeEntitySchemaContract {
  schema_id: string;
  protocol: "11.12-W2";
  entities: Record<CanonicalKnowledgeEntity, { required_fields: string[]; lifecycle?: boolean }>;
}

export interface KnowledgeStateMachineContract {
  protocol: "11.12-W2";
  entities: Record<string, { states: string[]; transitions: Record<string, string[]> }>;
  illegal_child_parent: {
    child: string;
    child_state: string;
    parent: string;
    parent_state: string;
    reason: string;
  }[];
}

export interface KnowledgeEventContract {
  event_type: string;
  version: number;
  description: string;
  producer: string;
  consumers: string[];
  privacy_classification: string;
  status: string;
}

export interface KnowledgeEventCatalogContract {
  catalog_version: string;
  subsystem: string;
  events: KnowledgeEventContract[];
}

export interface KnowledgeRelationshipMatrixContract {
  protocol: "11.12-W2";
  parent_child: Record<string, string | null>;
  cross_links: string[];
}

export interface ValidateArtifactContract {
  record: KnowledgeArtifactRecord;
  issues: { code: string; field?: string; message: string }[];
}

export interface ValidateClaimContract {
  record: KnowledgeClaimRecord;
  issues: { code: string; field?: string; message: string }[];
}

export interface ValidateCitationContract {
  record: CitationRecord;
  issues: { code: string; field?: string; message: string }[];
}

export interface ValidateCompletionContract {
  record: LearningCompletionRecord;
  course_version: number;
  issues: { code: string; field?: string; message: string }[];
}

export interface ValidateCertificationAwardContract {
  record: CertificationAwardRecord;
  certification: CertificationRecord;
  issues: { code: string; field?: string; message: string }[];
}

export interface KnowledgeVersionContract {
  version: KnowledgeVersionRecord;
  artifact: KnowledgeArtifactRecord;
  trigger: string;
}

export interface CourseModelContract {
  course: CourseRecord;
  modules: string[];
  competencies: CompetencyRecord[];
}

export interface AssessmentModelContract {
  assessment: AssessmentRecord;
  competency_id: string | null;
  course_id: string | null;
}

export interface AISuggestionContract {
  suggestion: AIKnowledgeSuggestionRecord;
  requires_human_review: true;
  does_not_create_truth: true;
}

export const W2_CONTRACT_VERSION = "11.12-W2.29" as const;

export function getContractManifest() {
  return {
    version: W2_CONTRACT_VERSION,
    protocol: "11.12-W2",
    contracts: [
      "KnowledgeDatabaseContract",
      "KnowledgeEntitySchemaContract",
      "KnowledgeStateMachineContract",
      "KnowledgeEventCatalogContract",
      "KnowledgeRelationshipMatrixContract",
      "ValidateArtifactContract",
      "ValidateClaimContract",
      "ValidateCitationContract",
      "ValidateCompletionContract",
      "ValidateCertificationAwardContract",
      "KnowledgeVersionContract",
      "CourseModelContract",
      "AssessmentModelContract",
      "AISuggestionContract",
    ],
  };
}
