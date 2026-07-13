import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCommunicationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        announcement_id?: string;
        message_id?: string;
        channels: ("email" | "sms" | "push" | "in_app")[];
        recipient_count: number;
      };
      return operationsApplicationService.sendBroadcast({
        institution_id: apiCtx.institution_id,
        announcement_id: body.announcement_id,
        message_id: body.message_id,
        channels: body.channels,
        recipient_count: body.recipient_count,
      });
    }),
  { permission: "communications.manage", endpoint: "/api/v1/broadcasts" }
);
