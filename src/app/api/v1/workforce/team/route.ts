import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkforceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withWorkforceApi(ctx, request, (apiCtx) => {
      const team = request.nextUrl.searchParams.get("team") ?? "Field Operations";
      return { team: operationsApplicationService.getTeamWorkCenter(team, apiCtx.institution_id) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/workforce/team" }
);
