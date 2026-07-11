import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadEnvironments, loadConfigDrift } from "@/lib/deployment/data";

export const GET = withAdmin(() => {
  return NextResponse.json({
    environments: loadEnvironments(),
    drift: loadConfigDrift(),
  });
});
