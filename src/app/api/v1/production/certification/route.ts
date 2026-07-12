import { withApiGateway } from "@/lib/api/http";
import { institutionalProductionService } from "@/lib/civic-action/builds/11.1/production";
import { runBuild111Certification } from "@/lib/civic-action/builds/11.1/w8";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, (apiCtx) => ({
      certification_suite: institutionalProductionService.getCertification(),
      production_levels: institutionalProductionService.getProductionLevels(apiCtx.institution_id),
      build_111: runBuild111Certification(),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/production/certification" }
);
