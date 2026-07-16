import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, SESSION_COOKIE } from "@/lib/auth/session";
import { resolveAdminContext } from "@/lib/admin/engine";

/** Server-side gate for Director / admin pages (not login). */
export async function requireAdminPageAccess(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const session = token ? getSession(token) : null;
  if (!session) redirect("/admin/login");

  const ctx = resolveAdminContext(session);
  if (ctx.effective_permissions.length === 0) {
    redirect("/access-denied");
  }
}
