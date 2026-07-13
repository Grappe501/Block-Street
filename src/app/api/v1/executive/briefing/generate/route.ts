import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExecutiveApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withExecutiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json().catch(() => ({}))) as { briefing_type?: "morning" | "evening" | "on_demand" };
      return operationsApplicationService.generateExecutiveBriefing({
        institution_id: apiCtx.institution_id,
        executive_human_id: apiCtx.actor_human_id,
        briefing_type: body.briefing_type ?? "on_demand",
      });
    }),
  { permission: "executive.manage", endpoint: "/api/v1/executive/briefing/generate" }
);
