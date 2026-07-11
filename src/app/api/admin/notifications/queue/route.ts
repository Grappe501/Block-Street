import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadQueue } from "@/lib/notifications/engine";

export const GET = withAdmin(() => {
  const q = loadQueue();
  return NextResponse.json(q);
});
