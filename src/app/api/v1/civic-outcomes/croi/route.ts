import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { estimateCivicROI } from "@/lib/civic-outcomes/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const programId = request.nextUrl.searchParams.get("program_id");
    if (!programId) throw new Error("program_id is required");
    return apiSuccess(estimateCivicROI(programId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/croi" }
);
