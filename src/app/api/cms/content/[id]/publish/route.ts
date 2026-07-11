import { NextRequest, NextResponse } from "next/server";
import { publishContent } from "@/lib/cms/engine";
import { cmsError, withCms } from "@/lib/cms/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withCms(async (userId, req) => {
    const body = (await req.json().catch(() => ({}))) as { channels?: string[] };
    const item = publishContent(userId, id, body.channels);
    return NextResponse.json({ item });
  });
  return handler(request).catch(cmsError);
}
