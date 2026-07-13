import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCommunicationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, (apiCtx) => ({
      announcements: operationsApplicationService.listAnnouncements(apiCtx.institution_id),
    })),
  { permission: "communications.view", endpoint: "/api/v1/announcements" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        title: string;
        body: string;
        scope: string;
        scope_id?: string;
        requires_acknowledgment?: boolean;
      };
      return operationsApplicationService.createAnnouncement({
        institution_id: apiCtx.institution_id,
        title: body.title,
        body: body.body,
        scope: body.scope as "institution",
        scope_id: body.scope_id,
        published_by: apiCtx.actor_human_id,
        requires_acknowledgment: body.requires_acknowledgment,
      });
    }),
  { permission: "communications.manage", endpoint: "/api/v1/announcements" }
);
