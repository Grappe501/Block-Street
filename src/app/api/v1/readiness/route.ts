import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResilienceApi, withCertificationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    request.nextUrl.searchParams.get("scope") === "ops_certification"
      ? withCertificationApi(ctx, request, (apiCtx) => ({
          readiness: operationsApplicationService.listOpsReadinessAssessments(apiCtx.institution_id),
          confidence: operationsApplicationService.getOperationalConfidenceIndex(apiCtx.institution_id),
        }))
      : withResilienceApi(ctx, request, (apiCtx) => ({
          readiness: operationsApplicationService.getReadinessAssessment(apiCtx.institution_id),
          dashboard: operationsApplicationService.getResilienceDashboard(apiCtx.institution_id),
        })),
  { permission: "resilience.view", endpoint: "/api/v1/readiness" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { domain_scores?: Record<string, string> };
      return operationsApplicationService.assessOpsReadiness({
        institution_id: apiCtx.institution_id,
        assessed_by: apiCtx.actor_human_id,
        domain_scores: body.domain_scores as Parameters<typeof operationsApplicationService.assessOpsReadiness>[0]["domain_scores"],
      });
    }),
  { permission: "certification.manage", endpoint: "/api/v1/readiness" }
);
