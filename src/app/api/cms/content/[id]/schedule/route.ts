import { NextRequest, NextResponse } from "next/server";
import { scheduleContent } from "@/lib/cms/engine";
import { cmsError, withCms } from "@/lib/cms/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withCms(async (userId, req) => {
    const body = await req.json();
    const item = scheduleContent(userId, id, body.scheduled_at);
    return NextResponse.json({ item });
  });
  return handler(request).catch(cmsError);
}
