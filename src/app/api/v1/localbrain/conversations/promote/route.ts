import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        conversation_id: string;
        target: string;
      };
      return livingIntelligenceApplicationService.promoteConversation({
        conversation_id: body.conversation_id,
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        target: body.target as "working_knowledge" | "institutional_knowledge",
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/conversations/promote" }
);
