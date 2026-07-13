import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCertificationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, async (apiCtx) => ({
      launch: operationsApplicationService.approveOpsLaunch(apiCtx.institution_id, apiCtx.actor_human_id),
    })),
  { permission: "certification.manage", endpoint: "/api/v1/launch/approve" }
);
