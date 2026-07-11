import { NextRequest } from "next/server";
import { withApiGateway } from "@/lib/api/http";
import { withIdempotentPost } from "@/lib/api/http";
import { approveRelease } from "@/lib/deployment/engine";
import type { ApprovalRole } from "@/lib/deployment/types";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/deployments/${id}/approve`, async (body) => {
      const result = approveRelease(
        id,
        (body.role as ApprovalRole) ?? "technical",
        ctx.actor_id ?? "system",
        String(body.approver_name ?? "Reviewer")
      );
      return result;
    });
  },
  { permission: "deployments.approve", endpoint: "/api/v1/deployments/{id}/approve" }
);
