import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { communicationOptimizationService } from "@/lib/civic-action/builds/11.7/optimization";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { conversation_id?: string };
      if (!body.conversation_id) {
        throw new ApiError("VALIDATION_ERROR", "conversation_id is required", 400);
      }
      return {
        optimizations: communicationOptimizationService.analyzeCommunication(body.conversation_id),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/communications/analyze" }
);
