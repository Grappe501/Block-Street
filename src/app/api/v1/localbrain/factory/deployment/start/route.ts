import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        capability_id: string;
        build_id: string;
        environment: "development" | "testing" | "staging" | "pilot" | "production";
        approved_by_human?: boolean;
      };
      return livingIntelligenceApplicationService.startDeployment({
        capability_id: body.capability_id,
        build_id: body.build_id,
        institution_id: apiCtx.institution_id,
        human_id: apiCtx.human_id,
        environment: body.environment,
        approved_by_human: body.approved_by_human,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/factory/deployment/start" }
);
