import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExperienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withExperienceApi(ctx, request, (apiCtx) => ({
      sync: operationsApplicationService.syncOfflineWorkspace({
        human_id: apiCtx.actor_human_id,
        institution_id: apiCtx.institution_id,
      }),
    })),
  { permission: "experience.manage", endpoint: "/api/v1/offline/sync" }
);
