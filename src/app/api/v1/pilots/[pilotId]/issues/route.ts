import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { assignCorrectiveAction, completeRetest, createIssue } from "@/lib/pilot/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const pilotId = request.nextUrl.pathname.split("/")[4] ?? "";
    const resource = request.nextUrl.pathname.split("/")[5] ?? "";
    const body = (await request.json()) as Record<string, unknown>;
    const actorId = ctx.actor_id ?? "system";
    try {
      if (resource === "issues") {
        const issue = createIssue({
          program_id: pilotId,
          session_id: body.session_id as string | undefined,
          workflow_id: body.workflow_id as string | undefined,
          severity: (body.severity as "P0" | "P1" | "P2" | "P3" | "P4") ?? "P2",
          title: String(body.title ?? "Issue"),
          description: String(body.description ?? ""),
          issue_domain: String(body.issue_domain ?? "product_design"),
          root_cause: String(body.root_cause ?? "poor_affordance"),
          owner: String(body.owner ?? actorId),
          actor_id: actorId,
        });
        return apiSuccess({ issue }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
      }
      throw new Error("Unknown resource.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Issue creation failed", 400);
    }
  },
  { permission: "pilot.manage", endpoint: "/api/v1/pilots/{pilotId}/issues" }
);
