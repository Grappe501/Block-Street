import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { listDeployments } from "@/lib/deployment/engine";

export const GET = withAdmin(() => {
  const data = listDeployments();
  return NextResponse.json({
    candidates: data.candidates,
    manifests: data.manifests,
    previews: data.previews,
    artifacts: data.artifacts,
  });
});
