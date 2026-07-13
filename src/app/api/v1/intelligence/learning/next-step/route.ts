import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { course_id?: string; goal?: string };
      return knowledgeIntelligenceService.run(intelCtx, {
        request_type: "learning_next_step",
        purpose: "adaptive_learning_sequence",
        course_id: body.course_id,
        query: body.goal,
      });
    }),
  { permission: "training.view", endpoint: "/api/v1/intelligence/learning/next-step" }
);
