import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import {
  activateReplicatedInstitution,
  customizeReplicatedInstitution,
  replicateInstitution,
} from "@/lib/federation/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      template_id: string;
      target_name: string;
      action?: string;
      institution_id?: string;
      settings?: Record<string, unknown>;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "customize" && body.institution_id) {
        return apiSuccess(
          { institution: customizeReplicatedInstitution(body.institution_id, body.settings ?? {}, actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      if (body.action === "activate" && body.institution_id) {
        return apiSuccess(
          { institution: activateReplicatedInstitution(body.institution_id, actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      const institution = replicateInstitution({
        template_id: body.template_id,
        target_name: body.target_name,
        actor_id: actorId,
      });
      return apiSuccess({ institution }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Replication failed", 400);
    }
  },
  { permission: "federation.replicate", endpoint: "/api/v1/federation/replicate" }
);
