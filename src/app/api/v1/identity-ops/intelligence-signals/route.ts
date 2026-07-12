import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  listIntelligenceSignalsForReview,
  getIntelligenceSignalDetail,
  triageIntelligenceSignal,
  markIntelligenceSignalBenign,
  reportIntelligenceFalsePositive,
  openCaseFromIntelligenceSignal,
} from "@/lib/identity-trust/wave6/intelligence-review";

export const GET = withApiGateway(
  async (ctx, request) => {
    const signalId = request.nextUrl.searchParams.get("signal_id");
    if (signalId) {
      const detail = getIntelligenceSignalDetail(signalId);
      if (!detail) throw new Error("Signal not found");
      return apiSuccess(detail, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    return apiSuccess(listIntelligenceSignalsForReview({ status }), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-ops/intelligence-signals" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string;
    const signalId = body.signal_id as string;

    if (action === "triage") {
      return apiSuccess(triageIntelligenceSignal(signalId, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "benign") {
      return apiSuccess(markIntelligenceSignalBenign(signalId, ctx.actor_id!, body.reason as string | undefined), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "false_positive") {
      return apiSuccess(reportIntelligenceFalsePositive(signalId, ctx.actor_id!, (body.reason as string) ?? "False positive"), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "open_case") {
      return apiSuccess(openCaseFromIntelligenceSignal(signalId, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    throw new Error("Unknown action");
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-ops/intelligence-signals" }
);
