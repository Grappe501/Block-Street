import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { institutionalOptimizationService } from "@/lib/civic-action/builds/11.1/optimization";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          test_type?: string;
          parameters?: Record<string, unknown>;
        };
        if (!body.test_type?.trim()) throw new ApiError("VALIDATION_ERROR", "test_type is required", 400);
        const twin = institutionalOptimizationService.buildDigitalTwin(apiCtx.institution_id);
        const test = institutionalOptimizationService.runDigitalTwinTest(apiCtx.institution_id, {
          test_type: body.test_type,
          parameters: body.parameters,
        });
        return { twin, test, advisory_only: true };
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/digital-twin/test" }
);
