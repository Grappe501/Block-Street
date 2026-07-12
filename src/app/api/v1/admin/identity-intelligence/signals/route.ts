import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listSignals, getSignal, triageSignal, markSignalBenign, markSignalFalsePositive, closeSignal } from "@/lib/identity-trust/wave5/signals";
import { listDetectionRules } from "@/lib/identity-trust/wave5/rules";
import { listReferrals } from "@/lib/identity-trust/wave5/referrals";
import { runIdentityIntelligenceScan, getIntelligenceQualityMetrics } from "@/lib/identity-trust/wave5/detection";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "signals";
    const signalId = request.nextUrl.searchParams.get("signal_id");

    if (mode === "rules") {
      return apiSuccess(listDetectionRules(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (mode === "referrals") {
      return apiSuccess(listReferrals(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (mode === "quality") {
      return apiSuccess(getIntelligenceQualityMetrics(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (signalId) {
      const signal = getSignal(signalId);
      if (!signal) throw new Error("Signal not found");
      return apiSuccess(signal, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const statusParam = request.nextUrl.searchParams.get("status");
    return apiSuccess(
      listSignals(statusParam ? { status: statusParam as import("@/lib/identity-trust/wave5/types").IntelligenceSignalStatus } : undefined),
      {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/admin/identity-intelligence/signals" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string;
    const signalId = body.signal_id as string;

    if (action === "scan") {
      const signals = runIdentityIntelligenceScan();
      return apiSuccess({ generated: signals.length, signals }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (action === "triage") {
      return apiSuccess(triageSignal(signalId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (action === "benign") {
      return apiSuccess(markSignalBenign(signalId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (action === "false_positive") {
      return apiSuccess(
        markSignalFalsePositive(signalId, ctx.actor_id!, (body.reason as string) ?? "Reviewer marked false positive"),
        { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
      );
    }
    if (action === "close") {
      return apiSuccess(closeSignal(signalId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    throw new Error("Unknown action");
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/admin/identity-intelligence/signals" }
);
