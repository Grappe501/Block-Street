import { NextResponse } from "next/server";
import { loadUsers } from "@/lib/auth/data";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "users.view");
  const users = loadUsers().map(({ password_hash: _, mfa_secret: __, ...u }) => u);
  return NextResponse.json({ users });
});
