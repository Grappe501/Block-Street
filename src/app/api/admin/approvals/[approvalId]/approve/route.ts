import { NextRequest, NextResponse } from "next/server";
import { assertAuthenticated } from "@/lib/auth/engine";
import { approveRequest, AdminError, resolveAdminContext } from "@/lib/admin/engine";

export async function POST(request: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const session = assertAuthenticated(request.headers.get("cookie"));
    const ctx = resolveAdminContext(session);
    const { approvalId } = await params;
    const approval = approveRequest(approvalId, ctx);
    if (!approval) return NextResponse.json({ error: "Approval not found" }, { status: 404 });
    return NextResponse.json({ ok: true, approval });
  } catch (e) {
    if (e instanceof AdminError) return NextResponse.json({ error: e.message }, { status: e.status });
    const err = e as { message?: string; status?: number };
    return NextResponse.json({ error: err.message ?? "Unauthorized" }, { status: err.status ?? 401 });
  }
}
