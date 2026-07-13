import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { communicationApplicationService } from "@/lib/civic-action/builds/11.7/application-service";
import type { CommunicationCommandType } from "@/lib/civic-action/builds/11.7/services/commands";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown> & {
      command_type?: CommunicationCommandType;
    };
    if (!body.command_type) {
      throw new ApiError("VALIDATION_ERROR", "command_type is required", 400);
    }
    const initiativeId = (body.initiative_id as string) ?? "";
    if (!initiativeId) {
      throw new ApiError("VALIDATION_ERROR", "initiative_id is required", 400);
    }

    const result = communicationApplicationService.executeCommand({
      command_id: (body.command_id as string) ?? `cmd-${Date.now()}`,
      command_type: body.command_type,
      actor_human_id: (body.actor_human_id as string) ?? "usr-001",
      institution_id: (body.institution_id as string) ?? "inst-block-street",
      active_membership_id: (body.active_membership_id as string) ?? "mem-001",
      initiative_id: initiativeId,
      entity_id_optional: (body.entity_id_optional as string) ?? null,
      expected_version_optional: (body.expected_version_optional as number) ?? null,
      requested_at: (body.requested_at as string) ?? new Date().toISOString(),
      request_id: (body.request_id as string) ?? `req-${Date.now()}`,
      correlation_id: (body.correlation_id as string) ?? `cor-${Date.now()}`,
      idempotency_key: (body.idempotency_key as string) ?? null,
      reason_optional: (body.reason_optional as string) ?? null,
      request_source: (body.request_source as "human") ?? "human",
      payload: (body.payload as Record<string, unknown>) ?? {},
    });

    return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "civic_action.manage", endpoint: "/api/v1/civic-action/communications/commands" }
);
