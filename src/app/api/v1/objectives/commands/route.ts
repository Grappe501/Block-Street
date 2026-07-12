import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { executeObjectiveCommand } from "@/lib/civic-action/builds/11.2/api";
import type { ExecutionCommandType } from "@/lib/civic-action/builds/11.2/services/commands";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown> & { command_type?: ExecutionCommandType };
        if (!body.command_type) {
          throw new ApiError("VALIDATION_ERROR", "command_type is required", 400);
        }
        const initiativeId = (body.initiative_id as string) ?? "";
        if (!initiativeId) {
          throw new ApiError("VALIDATION_ERROR", "initiative_id is required", 400);
        }
        return executeObjectiveCommand(apiCtx, body.command_type, initiativeId, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/objectives/commands" }
);
