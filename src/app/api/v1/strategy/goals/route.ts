import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withStrategyApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, (apiCtx) => {
      const pillarId = request.nextUrl.searchParams.get("pillar_id") ?? undefined;
      return { goals: operationsApplicationService.listGoals(apiCtx.institution_id, pillarId) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/strategy/goals" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { pillar_id: string; title: string; description: string };
      const goal = operationsApplicationService.createGoal({
        institution_id: apiCtx.institution_id,
        pillar_id: body.pillar_id,
        title: body.title,
        description: body.description,
        owner_human_id: apiCtx.actor_human_id,
      });
      return { goal, event: "goal.created" };
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/strategy/goals" }
);
