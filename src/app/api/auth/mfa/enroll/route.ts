import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    status: "mfa_enrollment_scaffold",
    message: "MFA enrollment available for elevated roles — configure TOTP in production deployment",
  });
}
