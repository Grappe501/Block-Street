import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExperienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withExperienceApi(ctx, request, (apiCtx) => ({
      workspace: operationsApplicationService.getWorkspace(apiCtx.actor_human_id, apiCtx.institution_id),
    })),
  { permission: "experience.view", endpoint: "/api/v1/workspace" }
);
