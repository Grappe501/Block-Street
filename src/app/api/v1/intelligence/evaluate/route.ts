import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOpsIntelligenceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOpsIntelligenceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        prediction_id: string;
        actual_outcome: string;
      };
      return operationsApplicationService.evaluateInstitutionalPrediction({
        institution_id: apiCtx.institution_id,
        prediction_id: body.prediction_id,
        actual_outcome: body.actual_outcome,
        recorded_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "intelligence.manage", endpoint: "/api/v1/intelligence/evaluate" }
);
