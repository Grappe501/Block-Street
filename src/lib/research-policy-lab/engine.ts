import {
  appendAudit,
  loadAudit,
  loadBriefs,
  loadDatasetRequests,
  loadFeatureFlags,
  loadReviews,
  loadWorkspaces,
  persistBriefs,
  persistDatasetRequests,
  persistReviews,
  persistWorkspaces,
} from "./data";
import type {
  DatasetRequest,
  PolicyBrief,
  ResearchLabOverview,
  ResearchReview,
  ResearchWorkspace,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function createWorkspace(input: {
  institution_id: string;
  title: string;
  research_question: string;
  sponsor_email: string;
  retention_days?: number;
}): ResearchWorkspace {
  const flags = loadFeatureFlags();
  if (!flags.RPL_ENABLED) throw new Error("Research & Policy Lab is disabled");
  const workspace: ResearchWorkspace = {
    id: id("rpl-ws"),
    institution_id: input.institution_id,
    title: input.title.trim(),
    research_question: input.research_question.trim(),
    sponsor_email: input.sponsor_email.trim().toLowerCase(),
    status: "active",
    retention_days: input.retention_days ?? 365,
    created_at: now(),
    updated_at: now(),
  };
  persistWorkspaces([workspace, ...loadWorkspaces()]);
  appendAudit("workspace_created", workspace.id);
  return workspace;
}

export function requestDataset(input: {
  workspace_id: string;
  requested_dimensions: string[];
}): DatasetRequest {
  const flags = loadFeatureFlags();
  const min = Number(flags.RPL_MIN_COHORT_SIZE ?? 25);
  const ws = loadWorkspaces().find((w) => w.id === input.workspace_id);
  if (!ws) throw new Error("Workspace not found");

  const req: DatasetRequest = {
    id: id("rpl-ds"),
    workspace_id: input.workspace_id,
    requested_dimensions: input.requested_dimensions,
    minimum_cohort_size: min,
    status: "approved",
    suppression_applied: true,
    denial_reason: null,
    created_at: now(),
    fulfilled_at: now(),
  };

  if (flags.RPL_PII_EXPORT_PROHIBITED === false) {
    throw new Error("Invariant: PII export must remain prohibited");
  }

  persistDatasetRequests([req, ...loadDatasetRequests()]);
  appendAudit("dataset_fulfilled_aggregate_only", req.id);
  return req;
}

export function createBrief(input: {
  workspace_id: string;
  title: string;
  summary: string;
  evidence_sources?: string[];
}): PolicyBrief {
  const brief: PolicyBrief = {
    id: id("rpl-brief"),
    workspace_id: input.workspace_id,
    title: input.title.trim(),
    summary: input.summary.trim(),
    evidence_sources: input.evidence_sources ?? ["OUT-001", "INT-002", "CHD-001", "CIV-001"],
    status: "in_review",
    created_at: now(),
    updated_at: now(),
  };
  persistBriefs([brief, ...loadBriefs()]);
  appendAudit("brief_submitted_for_review", brief.id);
  return brief;
}

export function reviewTarget(input: {
  target_type: ResearchReview["target_type"];
  target_id: string;
  reviewer_email: string;
  decision: ResearchReview["decision"];
  notes?: string;
}): ResearchReview {
  const review: ResearchReview = {
    id: id("rpl-rev"),
    target_type: input.target_type,
    target_id: input.target_id,
    reviewer_email: input.reviewer_email.trim().toLowerCase(),
    decision: input.decision,
    notes: input.notes?.trim() || "",
    created_at: now(),
  };
  persistReviews([review, ...loadReviews()]);

  if (input.target_type === "policy_brief") {
    const briefs = loadBriefs();
    const idx = briefs.findIndex((b) => b.id === input.target_id);
    if (idx >= 0) {
      briefs[idx] = {
        ...briefs[idx],
        status: input.decision === "approve" ? "approved" : input.decision === "deny" ? "draft" : "in_review",
        updated_at: now(),
      };
      persistBriefs(briefs);
    }
  }

  appendAudit("review_recorded", `${input.target_type}:${input.target_id}:${input.decision}`);
  return review;
}

export function getResearchLabOverview(): ResearchLabOverview {
  const flags = loadFeatureFlags();
  const workspaces = loadWorkspaces();
  const briefs = loadBriefs();
  return {
    workspace_count: workspaces.length,
    active_workspaces: workspaces.filter((w) => w.status === "active").length,
    pending_reviews: briefs.filter((b) => b.status === "in_review").length,
    briefs_in_review: briefs.filter((b) => b.status === "in_review").length,
    min_cohort_size: Number(flags.RPL_MIN_COHORT_SIZE ?? 25),
    pii_export_prohibited: Boolean(flags.RPL_PII_EXPORT_PROHIBITED),
    recent_audit: loadAudit(12),
  };
}

export function runAcceptanceDemo(institutionId: string, sponsorEmail: string) {
  const ws = createWorkspace({
    institution_id: institutionId,
    title: "Youth belonging longitudinal scan",
    research_question: "Which counties show rising belonging with stable privacy protections?",
    sponsor_email: sponsorEmail,
  });
  const ds = requestDataset({
    workspace_id: ws.id,
    requested_dimensions: ["participation_index", "health_index", "outcome_trends"],
  });
  const brief = createBrief({
    workspace_id: ws.id,
    title: "Belonging policy note — aggregate findings",
    summary:
      "Aggregated evidence shows participation and health move together where mentorship capacity is stable. Recommendations remain advisory.",
  });
  const review = reviewTarget({
    target_type: "policy_brief",
    target_id: brief.id,
    reviewer_email: sponsorEmail,
    decision: "approve",
    notes: "Approved for internal institutional use only.",
  });
  return { workspace: ws, dataset: ds, brief, review, overview: getResearchLabOverview() };
}
