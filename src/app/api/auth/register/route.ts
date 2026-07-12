import { NextRequest, NextResponse } from "next/server";
import { register } from "@/lib/auth/engine";
import { requestMeta, setSessionCookie } from "@/lib/auth/http";
import { loadWave1Flags } from "@/lib/identity-trust/wave1/data";

export async function POST(request: NextRequest) {
  const flags = loadWave1Flags();
  if (flags.INVITATION_ONLY_ENTRY_REQUIRED || flags.PUBLIC_REGISTRATION_DISABLED || flags.LEGACY_ACCOUNT_CREATION_DISABLED) {
    return NextResponse.json(
      {
        error:
          "This platform is invitation-only. Your authentication was successful, but no active invitation is associated with this identity. Please use an invitation link to join.",
        code: "INVITATION_ONLY",
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { email, password, display_name } = body as { email: string; password: string; display_name: string };
  if (!email || !password || !display_name) {
    return NextResponse.json({ error: "email, password, and display_name required" }, { status: 400 });
  }
  const result = register({ email, password, display_name }, requestMeta(request));
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, user_id: result.user.user_id });
  setSessionCookie(res, result.session);
  return res;
}
