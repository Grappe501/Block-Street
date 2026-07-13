import { withApiGateway } from "@/lib/api/http";
import { queryCourseCollection } from "@/lib/civic-action/builds/11.12/api";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return queryCourseCollection(apiCtx, {
        status: sp.get("status") ?? undefined,
        search: sp.get("search") ?? sp.get("q") ?? undefined,
      });
    }),
  { permission: "training.view", endpoint: "/api/v1/learning/courses" }
);
