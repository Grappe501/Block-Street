import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const parts = request.nextUrl.pathname.split("/");
      const nextActionId = parts[parts.length - 2] === "next-actions" ? parts[parts.length - 1] : "";
      return livingIntelligenceApplicationService.dismissNextAction(nextActionId, apiCtx.human_id);
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/next-actions/dismiss" }
);
