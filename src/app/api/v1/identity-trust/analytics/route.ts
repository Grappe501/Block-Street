import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  generateIdentityIntelligence,
  getAiIdentityRecommendation,
  listIntelligenceAlerts,
  searchIdentities,
} from "@/lib/identity-trust/intelligence";
import { getInvitationAnalytics } from "@/lib/identity-trust/invitations";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "alerts";
    if (mode === "search") {
      const q = request.nextUrl.searchParams.get("q") ?? "";
      return apiSuccess(searchIdentities(q), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (mode === "invitations") {
      return apiSuccess(getInvitationAnalytics(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (mode === "scan") {
      return apiSuccess(generateIdentityIntelligence(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const status = request.nextUrl.searchParams.get("status") as Parameters<typeof listIntelligenceAlerts>[0];
    return apiSuccess(listIntelligenceAlerts(status ?? undefined), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/analytics" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const answer = getAiIdentityRecommendation(body.question as string);
    return apiSuccess(answer, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/analytics" }
);
