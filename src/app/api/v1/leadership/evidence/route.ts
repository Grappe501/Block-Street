import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { listEvidence, recordLeadershipEvidence } from "@/lib/leadership/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id") ?? undefined;
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ evidence: listEvidence(userId, institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "leadership.view", endpoint: "/api/v1/leadership/evidence" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      user_id: string;
      institution_id: string;
      competency: string;
      activity_type: string;
      evidence_reference?: string;
      verification_level?: "self_reported" | "peer_verified" | "leader_verified" | "system_verified";
      impact_score?: number;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      const evidence = recordLeadershipEvidence({ ...body, actor_id: actorId });
      return apiSuccess({ evidence }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Evidence recording failed", 400);
    }
  },
  { permission: "leadership.manage", endpoint: "/api/v1/leadership/evidence" }
);
