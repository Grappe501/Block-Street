import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getApiOverview } from "@/lib/api/gateway";

export const GET = withAdmin(() => {
  return NextResponse.json({ overview: getApiOverview() });
});
