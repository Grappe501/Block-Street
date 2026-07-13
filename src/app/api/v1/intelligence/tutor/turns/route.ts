import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as {
        learner_question?: string;
        course_id?: string;
        lesson_id?: string;
        protected_assessment_active?: boolean;
        locale?: "en" | "es";
      };
      return knowledgeIntelligenceService.run(intelCtx, {
        request_type: "tutor_turn",
        purpose: "explainable_ai_tutor",
        query: body.learner_question ?? "",
        course_id: body.course_id,
        lesson_id: body.lesson_id,
        protected_assessment_active: body.protected_assessment_active,
      });
    }),
  { permission: "training.view", endpoint: "/api/v1/intelligence/tutor/turns" }
);
