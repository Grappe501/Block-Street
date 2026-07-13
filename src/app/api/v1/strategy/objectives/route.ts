import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withStrategyApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, (apiCtx) => {
      const goalId = request.nextUrl.searchParams.get("goal_id") ?? undefined;
      return { objectives: operationsApplicationService.listObjectives(apiCtx.institution_id, goalId) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/strategy/objectives" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        goal_id: string;
        title: string;
        description: string;
        measurement_type: string;
      };
      const objective = operationsApplicationService.createObjective({
        institution_id: apiCtx.institution_id,
        goal_id: body.goal_id,
        title: body.title,
        description: body.description,
        measurement_type: body.measurement_type,
        owner_human_id: apiCtx.actor_human_id,
      });
      return { objective, event: "objective.updated" };
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/strategy/objectives" }
);
