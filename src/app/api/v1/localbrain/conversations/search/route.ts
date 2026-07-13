import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const url = new URL(request.url);
      const query = url.searchParams.get("q") ?? "";
      return livingIntelligenceApplicationService.searchConversations({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        query,
      });
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/conversations/search" }
);
