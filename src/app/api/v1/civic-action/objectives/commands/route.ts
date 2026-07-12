import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { executeObjectiveCommand } from "@/lib/civic-action/builds/11.2/api";
import type { ExecutionCommandType } from "@/lib/civic-action/builds/11.2/services/commands";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown> & { command_type?: ExecutionCommandType };
    if (!body.command_type) {
      throw new ApiError("VALIDATION_ERROR", "command_type is required", 400);
    }
    const initiativeId = (body.initiative_id as string) ?? "";
    if (!initiativeId) {
      throw new ApiError("VALIDATION_ERROR", "initiative_id is required", 400);
    }
    const data = executeObjectiveCommand(body.command_type, initiativeId, body);
    return apiSuccess(data, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_action.manage", endpoint: "/api/v1/civic-action/objectives/commands" }
);
