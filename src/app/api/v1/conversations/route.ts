import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCommunicationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, (apiCtx) => {
      const missionId = request.nextUrl.searchParams.get("mission_id") ?? undefined;
      return { conversations: operationsApplicationService.listConversations(apiCtx.institution_id, missionId) };
    }),
  { permission: "communications.view", endpoint: "/api/v1/conversations" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        conversation_type: string;
        title: string;
        description: string;
        mission_id?: string;
        organization_unit_id?: string;
        participant_human_ids?: string[];
        visibility?: string;
      };
      return operationsApplicationService.createConversation({
        institution_id: apiCtx.institution_id,
        conversation_type: body.conversation_type as "mission_room",
        title: body.title,
        description: body.description,
        owner_human_id: apiCtx.actor_human_id,
        mission_id: body.mission_id,
        organization_unit_id: body.organization_unit_id,
        participant_human_ids: body.participant_human_ids,
        visibility: body.visibility as "institution" | undefined,
      });
    }),
  { permission: "communications.manage", endpoint: "/api/v1/conversations" }
);
