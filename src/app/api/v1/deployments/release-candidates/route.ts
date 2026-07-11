import { NextRequest } from "next/server";
import { withApiGateway } from "@/lib/api/http";
import { withIdempotentPost } from "@/lib/api/http";
import { createReleaseCandidate } from "@/lib/deployment/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    return withIdempotentPost(ctx, request, "/api/v1/deployments/release-candidates", async (body) => {
      const candidate = createReleaseCandidate({
        version: String(body.version ?? "0.0.0"),
        commit_sha: String(body.commit_sha ?? "unknown"),
        created_by: ctx.actor_id ?? "system",
        has_migration: Boolean(body.has_migration),
        touches_auth: Boolean(body.touches_auth),
      });
      return { candidate };
    });
  },
  { permission: "deployments.create_candidate", endpoint: "/api/v1/deployments/release-candidates" }
);
