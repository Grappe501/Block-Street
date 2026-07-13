import { withApiGateway } from "@/lib/api/http";
import { queryArtifactDetail } from "@/lib/civic-action/builds/11.12/api";
import { knowledgeIdFromPath, withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => queryArtifactDetail(knowledgeIdFromPath(request, "knowledge"), apiCtx)),
  { permission: "civic_action.view", endpoint: "/api/v1/knowledge/[id]" }
);
