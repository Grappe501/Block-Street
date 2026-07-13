import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { executeCommunicationCommand } from "@/lib/civic-action/builds/11.7/api";
import type { CommunicationCommandType } from "@/lib/civic-action/builds/11.7/services/commands";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown> & { command_type?: CommunicationCommandType };
        if (!body.command_type) {
          throw new ApiError("VALIDATION_ERROR", "command_type is required", 400);
        }
        const initiativeId = (body.initiative_id as string) ?? "";
        if (!initiativeId) {
          throw new ApiError("VALIDATION_ERROR", "initiative_id is required", 400);
        }
        return executeCommunicationCommand(apiCtx, body.command_type, initiativeId, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/communications/commands" }
);
