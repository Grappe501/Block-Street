export type ResearchWorkspace = {
  id: string;
  institution_id: string;
  title: string;
  research_question: string;
  sponsor_email: string;
  status: "draft" | "active" | "paused" | "closed";
  retention_days: number;
  created_at: string;
  updated_at: string;
};

export type DatasetRequest = {
  id: string;
  workspace_id: string;
  requested_dimensions: string[];
  minimum_cohort_size: number;
  status: "requested" | "approved" | "denied" | "fulfilled";
  suppression_applied: boolean;
  denial_reason: string | null;
  created_at: string;
  fulfilled_at: string | null;
};

export type PolicyBrief = {
  id: string;
  workspace_id: string;
  title: string;
  summary: string;
  evidence_sources: string[];
  status: "draft" | "in_review" | "approved" | "released";
  created_at: string;
  updated_at: string;
};

export type ResearchReview = {
  id: string;
  target_type: "dataset_request" | "policy_brief";
  target_id: string;
  reviewer_email: string;
  decision: "approve" | "deny" | "request_changes";
  notes: string;
  created_at: string;
};

export type ResearchLabOverview = {
  workspace_count: number;
  active_workspaces: number;
  pending_reviews: number;
  briefs_in_review: number;
  min_cohort_size: number;
  pii_export_prohibited: boolean;
  recent_audit: { at: string; action: string; detail: string }[];
};
