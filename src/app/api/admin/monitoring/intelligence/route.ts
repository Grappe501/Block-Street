import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getOperationalIntelligence } from "@/lib/monitoring/engine";

export const GET = withAdmin(() => {
  return NextResponse.json(getOperationalIntelligence());
});
