import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        deployment_id: string;
        rollback_type?: "immediate" | "partial" | "feature_flag" | "blue_green" | "canary" | "data_migration";
      };
      return livingIntelligenceApplicationService.rollbackDeployment({
        deployment_id: body.deployment_id,
        institution_id: apiCtx.institution_id,
        human_id: apiCtx.human_id,
        rollback_type: body.rollback_type,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/factory/deployment/rollback" }
);
