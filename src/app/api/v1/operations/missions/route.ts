import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOperationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, (apiCtx) => ({
      missions: operationsApplicationService.listMissions(apiCtx.institution_id),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/operations/missions" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        title: string;
        description: string;
        purpose: string;
        desired_outcome: string;
        classification: string;
        program_id?: string;
        project_id?: string;
        strategic_goal_id?: string;
        objective_id?: string;
      };
      const result = operationsApplicationService.createMission({
        institution_id: apiCtx.institution_id,
        title: body.title,
        description: body.description,
        purpose: body.purpose,
        desired_outcome: body.desired_outcome,
        classification: body.classification as "operational",
        mission_owner: apiCtx.actor_human_id,
        executive_owner: apiCtx.actor_human_id,
        created_by: apiCtx.actor_human_id,
        program_id: body.program_id,
        project_id: body.project_id,
        strategic_goal_id: body.strategic_goal_id,
        objective_id: body.objective_id,
      });
      return result;
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/operations/missions" }
);
