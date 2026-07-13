import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) => ({
      preferences: livingIntelligenceApplicationService.getLocalBrainPreferences(apiCtx.human_id),
    })),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/preferences" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        language?: string;
        notifications?: Record<string, boolean>;
      };
      return livingIntelligenceApplicationService.updateLocalBrainPreferences({
        human_id: apiCtx.human_id,
        language: body.language,
        notifications: body.notifications,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/preferences" }
);
