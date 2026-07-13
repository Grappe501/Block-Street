import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { role_id?: string; required_competency_ids?: string[] };
      return knowledgeIntelligenceService.run(intelCtx, {
        request_type: "role_readiness",
        purpose: "role_assignment_support",
        role_id: body.role_id,
        query: body.required_competency_ids?.join(","),
      });
    }),
  { permission: "training.view", endpoint: "/api/v1/intelligence/capability/role-readiness" }
);
