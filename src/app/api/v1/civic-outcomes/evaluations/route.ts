import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { evaluateProgram } from "@/lib/civic-outcomes/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const evaluation = evaluateProgram({
      program_id: body.program_id,
      institution_id: body.institution_id,
      did_it_work: body.did_it_work ?? true,
      why_summary: body.why_summary ?? "",
      for_whom: body.for_whom ?? "community participants",
      conditions: body.conditions ?? "",
      recommendations: body.recommendations ?? [],
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(evaluation, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.manage", endpoint: "/api/v1/civic-outcomes/evaluations" }
);
