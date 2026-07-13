import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        memory_id: string;
        target_tier: string;
      };
      return livingIntelligenceApplicationService.promoteLocalBrainMemory(
        body.memory_id,
        apiCtx.human_id,
        apiCtx.actor_human_id,
        body.target_tier as Parameters<typeof livingIntelligenceApplicationService.promoteLocalBrainMemory>[3]
      );
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/promote-memory" }
);
