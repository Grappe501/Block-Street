import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadMigrations } from "@/lib/deployment/data";

export const GET = withAdmin(() => {
  return NextResponse.json({ migrations: loadMigrations() });
});
