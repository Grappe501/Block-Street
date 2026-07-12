import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { computeCivicReturnOnParticipation } from "@/lib/civic-outcomes/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const programId = request.nextUrl.searchParams.get("program_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!programId || !institutionId) throw new Error("program_id and institution_id are required");
    return apiSuccess(computeCivicReturnOnParticipation(programId, institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/crop" }
);
