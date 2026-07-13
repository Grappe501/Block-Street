import { withApiGateway } from "@/lib/api/http";
import { communicationProductionService } from "@/lib/civic-action/builds/11.7/production";
import { runBuild117Certification } from "@/lib/civic-action/builds/11.7/w8";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => ({
      certification_suite: communicationProductionService.getCertification(),
      production_levels: communicationProductionService.getProductionLevels(apiCtx.institution_id),
      build_117: runBuild117Certification(),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/production/certification" }
);
