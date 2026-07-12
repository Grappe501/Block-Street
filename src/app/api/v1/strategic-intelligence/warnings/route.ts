import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { generateEarlyWarnings } from "@/lib/strategic-intelligence/engine";
import { loadWarnings } from "@/lib/strategic-intelligence/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";
    const countyId = request.nextUrl.searchParams.get("county_id") ?? undefined;
    if (!institutionId) throw new Error("institution_id is required");
    const warnings = refresh ? generateEarlyWarnings(institutionId, countyId) : loadWarnings().filter((w) => w.institution_id === institutionId);
    return apiSuccess(warnings, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/warnings" }
);
