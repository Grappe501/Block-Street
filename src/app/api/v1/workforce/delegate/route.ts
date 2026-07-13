import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { WorkforceError } from "@/lib/civic-action/builds/11.6/workforce/services/workforce-service";
import { withWorkforceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkforceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        assignment_id: string;
        delegated_to: string;
        reason: string;
        duration_end: string;
        authority_scope: string;
      };
      try {
        return operationsApplicationService.delegateAssignment({
          assignment_id: body.assignment_id,
          delegated_by: apiCtx.actor_human_id,
          delegated_to: body.delegated_to,
          reason: body.reason,
          duration_end: body.duration_end,
          authority_scope: body.authority_scope,
          approved_by: apiCtx.actor_human_id,
        });
      } catch (e) {
        if (e instanceof WorkforceError) throw new ApiError(e.code, e.message, 400);
        throw e;
      }
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/workforce/delegate" }
);
