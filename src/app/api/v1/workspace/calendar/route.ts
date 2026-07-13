import { withApiGateway } from "@/lib/api/http";
import { knowledgeExperienceService } from "@/lib/civic-action/builds/11.12/ux";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";
import { toExperienceContext } from "@/lib/civic-action/builds/11.12/ux/workspace-api";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => ({
      calendar: knowledgeExperienceService.getCalendar(toExperienceContext(apiCtx)),
      event: "calendar.event_opened",
    })),
  { permission: "training.view", endpoint: "/api/v1/workspace/calendar" }
);
