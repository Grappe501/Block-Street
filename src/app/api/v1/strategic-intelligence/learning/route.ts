import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadLearningRecords } from "@/lib/strategic-intelligence/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    let records = loadLearningRecords();
    if (institutionId) records = records.filter((r) => r.institution_id === institutionId);
    return apiSuccess(records, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/learning" }
);
