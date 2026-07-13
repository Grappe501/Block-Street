import { withApiGateway } from "@/lib/api/http";
import { knowledgeExperienceService } from "@/lib/civic-action/builds/11.12/ux";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";
import { toExperienceContext } from "@/lib/civic-action/builds/11.12/ux/workspace-api";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => ({
      notifications: knowledgeExperienceService.getNotifications(toExperienceContext(apiCtx)),
      event: "notification.read",
    })),
  { permission: "training.view", endpoint: "/api/v1/workspace/notifications" }
);
