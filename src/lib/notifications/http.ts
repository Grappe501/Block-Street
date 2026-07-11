import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getUserById } from "@/lib/auth/engine";
import { NotificationError } from "@/lib/notifications/engine";

export function withNotifications(
  handler: (userId: string, request: NextRequest) => NextResponse | Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const session = getSessionFromRequest(request.headers.get("cookie"));
      if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      const user = getUserById(session.user_id);
      if (!user || user.account_status === "suspended") {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      return await handler(session.user_id, request);
    } catch (e) {
      if (e instanceof NotificationError) return NextResponse.json({ error: e.message }, { status: e.status });
      const err = e as { message?: string; status?: number };
      return NextResponse.json({ error: err.message ?? "Error" }, { status: err.status ?? 500 });
    }
  };
}

export function notificationError(e: unknown) {
  if (e instanceof NotificationError) return NextResponse.json({ error: e.message }, { status: e.status });
  const err = e as { message?: string; status?: number };
  return NextResponse.json({ error: err.message ?? "Error" }, { status: err.status ?? 500 });
}
