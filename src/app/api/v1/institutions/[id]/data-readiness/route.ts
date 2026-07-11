import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { assessDataReadiness, certifyReadiness } from "@/lib/migration/engine";
import { loadReadinessAssessments } from "@/lib/migration/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const projectId = request.nextUrl.searchParams.get("project_id");
    let assessments = loadReadinessAssessments().filter((a) => a.institution_id === institutionId);
    if (projectId) assessments = assessments.filter((a) => a.migration_project_id === projectId);
    const overall = assessments.length
      ? Math.round(assessments.reduce((s, a) => s + a.overall_score, 0) / assessments.length)
      : 0;
    return apiSuccess({ assessments, overall_percent: overall }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "migration.view", endpoint: "/api/v1/institutions/{institutionId}/data-readiness" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { action: string; migration_project_id: string };
    try {
      if (body.action === "assess") {
        const assessments = assessDataReadiness(institutionId, body.migration_project_id, ctx.actor_id ?? "system");
        return apiSuccess({ assessments }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "certify") {
        const result = certifyReadiness(institutionId, body.migration_project_id, ctx.actor_id ?? "system");
        return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      throw new Error("Unknown data-readiness action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Data readiness action failed", 400);
    }
  },
  { permission: "migration.approve", endpoint: "/api/v1/institutions/{institutionId}/data-readiness" }
);
