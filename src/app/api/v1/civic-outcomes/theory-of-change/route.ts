import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { defineTheoryOfChange } from "@/lib/civic-outcomes/engine";
import { loadTheoryOfChange } from "@/lib/civic-outcomes/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const programId = request.nextUrl.searchParams.get("program_id");
    const items = loadTheoryOfChange();
    return apiSuccess(programId ? items.filter((t) => t.program_id === programId) : items, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/theory-of-change" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const toc = defineTheoryOfChange({
      program_id: body.program_id,
      institution_id: body.institution_id,
      resources: body.resources ?? [],
      activities: body.activities ?? [],
      outputs: body.outputs ?? [],
      outcomes: body.outcomes ?? [],
      long_term_impact: body.long_term_impact ?? [],
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(toc, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.manage", endpoint: "/api/v1/civic-outcomes/theory-of-change" }
);
