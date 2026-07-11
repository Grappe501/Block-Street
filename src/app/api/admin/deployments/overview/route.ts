import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getDeploymentOverview } from "@/lib/deployment/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ overview: getDeploymentOverview() });
});
