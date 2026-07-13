import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExecutiveApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withExecutiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        title: string;
        purpose: "campaign" | "emergency" | "election_day" | "crisis" | "legislative_session" | "custom";
        mission_ids?: string[];
        participant_human_ids: string[];
      };
      return operationsApplicationService.openWarRoom({
        institution_id: apiCtx.institution_id,
        title: body.title,
        purpose: body.purpose,
        mission_ids: body.mission_ids,
        participant_human_ids: body.participant_human_ids,
        opened_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "executive.manage", endpoint: "/api/v1/executive/warroom" }
);
