import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { agent_id: string };
      return livingIntelligenceApplicationService.retireAgent(body.agent_id);
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/agents/retire" }
);
