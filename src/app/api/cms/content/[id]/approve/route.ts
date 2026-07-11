import { NextRequest, NextResponse } from "next/server";
import { approveContent } from "@/lib/cms/engine";
import { cmsError, withCms } from "@/lib/cms/http";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withCms((userId) => {
    const item = approveContent(userId, id);
    return NextResponse.json({ item });
  });
  return handler(request).catch(cmsError);
}
