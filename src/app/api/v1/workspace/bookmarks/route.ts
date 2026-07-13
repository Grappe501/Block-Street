import { withApiGateway } from "@/lib/api/http";
import { caeId, nowIso } from "@/lib/civic-action/utils";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";
import { readStoreSlice, writeStoreSlice } from "@/lib/civic-action/builds/11.12/services/repository";

const KEY = "workspace_bookmarks";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { target_type?: string; target_id?: string };
      const bookmark = {
        bookmark_id: caeId("wb"),
        actor_human_id: apiCtx.actor_human_id,
        institution_id: apiCtx.institution_id,
        target_type: body.target_type ?? "knowledge",
        target_id: body.target_id ?? "",
        created_at: nowIso(),
      };
      const rows = readStoreSlice<typeof bookmark>(KEY);
      rows.push(bookmark);
      writeStoreSlice(KEY, rows);
      return { bookmark, advisory_only: true };
    }),
  { permission: "training.view", endpoint: "/api/v1/workspace/bookmarks" }
);
