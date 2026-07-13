import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOpsIntelligenceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOpsIntelligenceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { title: string; hypothesis: string };
      return operationsApplicationService.createInstitutionalScenario({
        institution_id: apiCtx.institution_id,
        title: body.title,
        hypothesis: body.hypothesis,
        created_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "intelligence.manage", endpoint: "/api/v1/intelligence/scenario" }
);
