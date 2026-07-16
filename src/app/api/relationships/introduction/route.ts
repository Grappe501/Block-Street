import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { suggestIntroduction } from "@/lib/relationships/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      fromLabel: string;
      toLabel: string;
      reason: string;
      evidence?: string[];
    };
    if (!body.fromLabel || !body.toLabel || !body.reason) {
      return apiSuccess({ error: "fromLabel, toLabel, reason required" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 400);
    }
    const introduction = suggestIntroduction({
      fromLabel: body.fromLabel,
      toLabel: body.toLabel,
      reason: body.reason,
      evidence: body.evidence,
    });
    return apiSuccess({ ok: true, introduction }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_action.manage", endpoint: "/api/relationships/introduction" }
);
