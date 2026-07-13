import { NextRequest, NextResponse } from "next/server";
import { queryPublicCredential } from "@/lib/civic-action/builds/11.12/api";

export async function GET(_request: NextRequest, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const credential = queryPublicCredential(code);
  if (!credential) {
    return NextResponse.json({ success: false, error: { code: "CREDENTIAL_NOT_FOUND", message: "Credential not found" } }, { status: 404 });
  }
  return NextResponse.json({
    success: true,
    data: credential,
    meta: { api_version: "11.12-w5.1", public: true },
  });
}
