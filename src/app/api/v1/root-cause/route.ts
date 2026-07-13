import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withImprovementApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withImprovementApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        issue: string;
        symptoms: string[];
        method?: string;
      };
      return operationsApplicationService.conductRootCauseAnalysis({
        institution_id: apiCtx.institution_id,
        issue: body.issue,
        symptoms: body.symptoms,
        conducted_by: apiCtx.actor_human_id,
        method: body.method as Parameters<typeof operationsApplicationService.conductRootCauseAnalysis>[0]["method"],
      });
    }),
  { permission: "improvement.manage", endpoint: "/api/v1/root-cause" }
);
