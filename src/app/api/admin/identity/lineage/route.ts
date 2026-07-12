import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getInviteTree } from "@/lib/identity-trust/engine";

export const GET = withAdmin((_, request) => {
  const root = request?.nextUrl.searchParams.get("root") ?? "usr-001";
  const depth = Number(request?.nextUrl.searchParams.get("depth") ?? "4");
  return NextResponse.json({ lineage: getInviteTree(root, depth) });
});
