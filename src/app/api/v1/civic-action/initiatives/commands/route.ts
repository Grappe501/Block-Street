import { withApiGateway } from "@/lib/api/http";
import { apiSuccess, ApiError } from "@/lib/api/errors";
import { initiativeApplicationService } from "@/lib/civic-action/builds/11.1/services/application-service";
import type { InitiativeCommandEnvelope } from "@/lib/civic-action/builds/11.1/services/commands";
import { humanizeCommandFailure } from "@/lib/civic-action/builds/11.1/ux";
import { DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.1/ux/experience-context";
import { caeId, nowIso } from "@/lib/civic-action/utils";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Partial<InitiativeCommandEnvelope> & { payload?: Record<string, unknown> };
    if (!body.command_type) {
      throw new ApiError("VALIDATION_ERROR", "command_type is required", 400);
    }

    const envelope: InitiativeCommandEnvelope = {
      command_id: body.command_id ?? caeId("cmd"),
      command_type: body.command_type,
      actor_human_id: body.actor_human_id ?? DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.actor_human_id,
      institution_id: body.institution_id ?? DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_id,
      active_membership_id: body.active_membership_id ?? DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.active_membership_id,
      initiative_id_optional: body.initiative_id_optional ?? null,
      expected_version_optional: body.expected_version_optional ?? null,
      requested_at: body.requested_at ?? nowIso(),
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
      idempotency_key: body.idempotency_key ?? null,
      reason_optional: body.reason_optional ?? null,
      payload: body.payload ?? {},
    };

    const result = initiativeApplicationService.executeCommand(envelope, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.permissions);
    const humanBlocked = humanizeCommandFailure(result);

    return apiSuccess(
      { result, human_blocked: humanBlocked },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "civic_action.manage", endpoint: "/api/v1/civic-action/initiatives/commands" }
);
