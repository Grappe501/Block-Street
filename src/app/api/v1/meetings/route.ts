import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCommunicationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, (apiCtx) => ({
      meetings: operationsApplicationService.listMeetings(apiCtx.institution_id),
    })),
  { permission: "communications.view", endpoint: "/api/v1/meetings" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        conversation_id: string;
        title: string;
        agenda?: string[];
        participant_human_ids: string[];
        calendar_event_id?: string;
      };
      return operationsApplicationService.createMeetingWorkspace({
        institution_id: apiCtx.institution_id,
        conversation_id: body.conversation_id,
        title: body.title,
        agenda: body.agenda,
        participant_human_ids: body.participant_human_ids,
        calendar_event_id: body.calendar_event_id,
      });
    }),
  { permission: "communications.manage", endpoint: "/api/v1/meetings" }
);
