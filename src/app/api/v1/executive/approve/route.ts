import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExecutiveApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withExecutiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { decision_id: string };
      return operationsApplicationService.approveExecutiveDecision(body.decision_id, apiCtx.actor_human_id);
    }),
  { permission: "executive.manage", endpoint: "/api/v1/executive/approve" }
);
