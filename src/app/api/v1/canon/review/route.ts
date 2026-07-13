import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withEvolutionApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { evolution_id?: string };
      return operationsApplicationService.reviewOpsArchitecture({
        institution_id: apiCtx.institution_id,
        evolution_id: body.evolution_id,
        reviewed_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "evolution.manage", endpoint: "/api/v1/canon/review" }
);
