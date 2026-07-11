import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { assignCorrectiveAction, completeRetest } from "@/lib/pilot/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const issueId = request.nextUrl.pathname.split("/")[4] ?? "";
    const action = request.nextUrl.pathname.split("/")[5] ?? "";
    const body = (await request.json()) as Record<string, unknown>;
    const actorId = ctx.actor_id ?? "system";
    try {
      if (action === "corrective-actions") {
        return apiSuccess(
          {
            corrective_action: assignCorrectiveAction(
              issueId,
              String(body.action_type ?? "product_fix"),
              String(body.owner ?? actorId),
              actorId
            ),
          },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      if (action === "retests") {
        return apiSuccess(
          {
            retest: completeRetest(
              issueId,
              String(body.new_session_id ?? ""),
              Number(body.human_help_delta ?? 0),
              actorId
            ),
          },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      throw new Error("Unknown issue action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Issue action failed", 400);
    }
  },
  { permission: "pilot.manage", endpoint: "/api/v1/pilot-issues/{issueId}/{action}" }
);
