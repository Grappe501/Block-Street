import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { approveKnowledge, contributeKnowledge } from "@/lib/federation/engine";

export const GET = withApiGateway(
  async (ctx) => {
    const { loadKnowledgeContributions } = await import("@/lib/federation/data");
    return apiSuccess({ contributions: loadKnowledgeContributions() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.view", endpoint: "/api/v1/federation/knowledge" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      title: string;
      contribution_type: "lesson_learned" | "best_practice" | "case_study";
      summary: string;
      action?: string;
      contribution_id?: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "approve" && body.contribution_id) {
        return apiSuccess(
          { contribution: approveKnowledge(body.contribution_id, actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      const contribution = contributeKnowledge({ ...body, actor_id: actorId });
      return apiSuccess({ contribution }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Knowledge action failed", 400);
    }
  },
  { permission: "federation.publish", endpoint: "/api/v1/federation/knowledge" }
);
