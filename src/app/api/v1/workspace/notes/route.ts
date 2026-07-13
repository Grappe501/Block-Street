import { withApiGateway } from "@/lib/api/http";
import { caeId, nowIso } from "@/lib/civic-action/utils";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";
import { readStoreSlice, writeStoreSlice } from "@/lib/civic-action/builds/11.12/services/repository";

const KEY = "workspace_notes";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { content?: string; target_id?: string };
      const note = {
        note_id: caeId("wn"),
        actor_human_id: apiCtx.actor_human_id,
        institution_id: apiCtx.institution_id,
        content: body.content ?? "",
        target_id: body.target_id ?? null,
        created_at: nowIso(),
      };
      const rows = readStoreSlice<typeof note>(KEY);
      rows.push(note);
      writeStoreSlice(KEY, rows);
      return { note, advisory_only: true };
    }),
  { permission: "training.view", endpoint: "/api/v1/workspace/notes" }
);
