import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { executeInitiativeCommand } from "@/lib/civic-action/builds/11.1/api";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";
import type { InitiativeCommandType } from "@/lib/civic-action/builds/11.1/services/commands";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown> & { command_type?: InitiativeCommandType };
        if (!body.command_type) {
          throw new ApiError("VALIDATION_ERROR", "command_type is required", 400);
        }
        const initiativeId = (body.initiative_id_optional as string) ?? (body.initiative_id as string) ?? null;
        return executeInitiativeCommand(apiCtx, body.command_type, initiativeId, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/initiatives/commands" }
);
