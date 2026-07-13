import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withStrategyApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, (apiCtx) => {
      const objectiveId = request.nextUrl.searchParams.get("objective_id") ?? undefined;
      return { key_results: operationsApplicationService.listKeyResults(apiCtx.institution_id, objectiveId) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/strategy/key-results" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        objective_id: string;
        metric: string;
        baseline: number;
        target: number;
        current_value?: number;
      };
      const key_result = operationsApplicationService.createKeyResult({
        institution_id: apiCtx.institution_id,
        objective_id: body.objective_id,
        metric: body.metric,
        baseline: body.baseline,
        target: body.target,
        current_value: body.current_value,
      });
      return { key_result, event: "key_result.updated" };
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/strategy/key-results" }
);
