import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getDashboards } from "@/lib/monitoring/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ dashboards: getDashboards() });
});
