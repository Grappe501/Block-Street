import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { executeKnowledgeCommand } from "@/lib/civic-action/builds/11.12/api";
import type { KnowledgeCommandType } from "@/lib/civic-action/builds/11.12/services/commands";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown> & { command_type?: KnowledgeCommandType };
        if (!body.command_type) {
          throw new ApiError("VALIDATION_ERROR", "command_type is required", 400);
        }
        return executeKnowledgeCommand(apiCtx, body.command_type, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/learning/commands" }
);
