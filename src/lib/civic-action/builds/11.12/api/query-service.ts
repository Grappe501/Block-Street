/**
 * CAE-11.12-W5 — Knowledge query handlers (read-only projections)
 */
import { knowledgeApplicationService } from "../application-service";
import { KnowledgeDomainError } from "../services/errors";
import { assembleArtifactView, visibilityAllowed } from "./assemble-knowledge-view";
import type { KnowledgeApiContext, KnowledgeListQuery, LearningWorkspaceProjection } from "./contracts";

export function queryArtifactCollection(apiCtx: KnowledgeApiContext, query: KnowledgeListQuery) {
  const limit = Math.min(query.limit ?? 25, 100);
  let offset = 0;
  if (query.cursor) {
    const parsed = Number.parseInt(Buffer.from(query.cursor, "base64url").toString("utf8"), 10);
    if (!Number.isNaN(parsed)) offset = parsed;
  }

  const institutionId = query.institution_id ?? apiCtx.institution_id;
  let items = knowledgeApplicationService
    .listArtifacts(institutionId)
    .filter((a) => visibilityAllowed(a, apiCtx));

  if (query.initiative_id) items = items.filter((a) => a.initiative_id === query.initiative_id);
  if (query.status) items = items.filter((a) => a.lifecycle_state === query.status);
  if (query.artifact_type) items = items.filter((a) => a.artifact_type === query.artifact_type);
  if (query.domain_id) items = items.filter((a) => a.domain_id === query.domain_id);
  if (!query.include_historical) {
    items = items.filter((a) => a.lifecycle_state !== "historical" && a.lifecycle_state !== "archived");
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter(
      (a) => a.display_name.toLowerCase().includes(q) || (a.summary ?? "").toLowerCase().includes(q)
    );
  }

  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const hasMore = nextOffset < items.length;

  return {
    items: page.map((a) => assembleArtifactView(a, apiCtx)),
    meta: {
      total_visible: items.length,
      cursor: hasMore ? Buffer.from(String(nextOffset)).toString("base64url") : null,
      has_more: hasMore,
    },
  };
}

export function queryArtifactDetail(artifactId: string, apiCtx: KnowledgeApiContext) {
  const artifact = knowledgeApplicationService.getArtifact(artifactId);
  if (!artifact || !visibilityAllowed(artifact, apiCtx)) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_NOT_FOUND",
      message: "Knowledge artifact not found.",
      requirement_ids: ["CAE-11.12-W5-API-013"],
    });
  }
  return assembleArtifactView(artifact, apiCtx);
}

export function queryLearningWorkspace(apiCtx: KnowledgeApiContext): LearningWorkspaceProjection {
  const enrollments = knowledgeApplicationService.listEnrollments(apiCtx.institution_id, apiCtx.actor_human_id);
  const courses = knowledgeApplicationService.listCourses(apiCtx.institution_id);
  const courseById = new Map(courses.map((c) => [c.canonical_id, c]));

  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    active_enrollments: enrollments.filter((e) => e.lifecycle_state === "active").length,
    assigned_learning: enrollments.slice(0, 5).map((e) => ({
      course_id: e.course_id ?? "",
      display_name: courseById.get(e.course_id ?? "")?.display_name ?? e.course_id ?? "Course",
      progress_percent: e.lifecycle_state === "completed" ? 100 : e.lifecycle_state === "active" ? 50 : 0,
    })),
    recommended_learning: courses
      .filter((c) => c.lifecycle_state === "published")
      .slice(0, 3)
      .map((c) => ({
        course_id: c.canonical_id,
        display_name: c.display_name,
        reason: "Published course in your institution",
      })),
    due_soon: enrollments
      .filter((e) => e.lifecycle_state === "active" || e.lifecycle_state === "enrolled")
      .slice(0, 5)
      .map((e) => ({
        enrollment_id: e.canonical_id,
        course_name: courseById.get(e.course_id ?? "")?.display_name ?? e.course_id ?? "Course",
        due_at: null,
      })),
    next_lesson: { lesson_id: null, course_id: enrollments[0]?.course_id ?? null },
    competency_implications: ["Progress does not auto-verify competency"],
    certification_implications: ["Certification requires explicit eligibility evaluation"],
  };
}

export function queryCourseCollection(apiCtx: KnowledgeApiContext, query: KnowledgeListQuery) {
  const institutionId = query.institution_id ?? apiCtx.institution_id;
  let items = knowledgeApplicationService.listCourses(institutionId);
  if (query.status) items = items.filter((c) => c.lifecycle_state === query.status);
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter((c) => c.display_name.toLowerCase().includes(q));
  }
  return {
    items: items.map((c) => ({
      id: c.canonical_id,
      display_name: c.display_name,
      lifecycle_state: c.lifecycle_state,
      version: c.current_version,
      institution_id: c.institution_id,
    })),
    meta: { total_visible: items.length },
  };
}

export function queryMyCompetencyProfile(apiCtx: KnowledgeApiContext) {
  const records = knowledgeApplicationService.listCompetencyRecords(apiCtx.institution_id, apiCtx.actor_human_id);
  return {
    human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    demonstrated_competencies: records.map((r) => ({
      competency_id: r.competency_id,
      level_id: r.competency_level_id,
      lifecycle_state: r.lifecycle_state,
      verified_by: r.verified_by_human_id,
    })),
    note: "Capability profile — not a ranking or trust score",
  };
}

export function queryCertificationEligibility(apiCtx: KnowledgeApiContext, certificationId: string) {
  const certification = knowledgeApplicationService.listCertifications(apiCtx.institution_id).find(
    (c) => c.canonical_id === certificationId
  );
  if (!certification) {
    throw new KnowledgeDomainError({
      code: "KNOWLEDGE_NOT_FOUND",
      message: "Certification not found.",
      requirement_ids: ["CAE-11.12-W5-API-013"],
    });
  }
  const awards = knowledgeApplicationService.listCertificationAwards(apiCtx.institution_id, apiCtx.actor_human_id);
  const existing = awards.find((a) => a.certification_id === certificationId && a.lifecycle_state === "awarded");
  return {
    certification_id: certificationId,
    eligibility: existing ? "already_awarded" : "human_review_required",
    missing_requirements: existing ? [] : ["Complete eligibility evaluation via command API"],
    next_actions: existing ? [] : ["POST /api/v1/certifications/commands EvaluateCertificationEligibility"],
  };
}

export function queryPublicCredential(verificationCode: string) {
  const award = knowledgeApplicationService.findAwardByVerificationCode(verificationCode);
  if (!award || award.lifecycle_state === "revoked") {
    return null;
  }
  const certification = knowledgeApplicationService.listCertifications(award.institution_id).find(
    (c) => c.canonical_id === award.certification_id
  );
  return {
    credential_name: certification?.display_name ?? "Institutional credential",
    status: award.lifecycle_state,
    issued_at: award.awarded_at,
    expires_at_optional: award.expires_at,
    verification_code: award.public_id,
    institution_id: award.institution_id,
  };
}

export function summarizeKnowledgeReadOnly(artifactId: string, apiCtx: KnowledgeApiContext) {
  const artifact = knowledgeApplicationService.getArtifact(artifactId);
  if (!artifact || !visibilityAllowed(artifact, apiCtx)) return null;
  return {
    artifact_id: artifactId,
    display_name: artifact.display_name,
    summary: artifact.summary?.slice(0, 500) ?? "",
    lifecycle_state: artifact.lifecycle_state,
    read_only: true,
    mutation_allowed: false,
    sources: [{ type: "artifact", id: artifact.canonical_id, version: artifact.current_version }],
  };
}
