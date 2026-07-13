import { withApiGateway } from "@/lib/api/http";
import { executeLifecycleAction } from "@/lib/civic-action/builds/11.12/api";
import {
  knowledgeIdFromPath,
  lifecycleActionFromPath,
  withKnowledgeApi,
} from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const artifactId = knowledgeIdFromPath(request, "knowledge");
        const action = lifecycleActionFromPath(request);
        return executeLifecycleAction(apiCtx, artifactId, action, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge/[id]/actions/[action]" }
);
