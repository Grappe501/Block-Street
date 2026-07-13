import { withApiGateway } from "@/lib/api/http";
import { queryLearningWorkspace } from "@/lib/civic-action/builds/11.12/api";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => queryLearningWorkspace(apiCtx)),
  { permission: "training.view", endpoint: "/api/v1/learning/workspace" }
);
