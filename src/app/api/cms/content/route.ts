import { NextRequest, NextResponse } from "next/server";
import { withCms } from "@/lib/cms/http";
import { assertContentPermission, createContent, loadContentItems } from "@/lib/cms/engine";

export const GET = withCms((userId) => {
  assertContentPermission(userId, "content.view");
  return NextResponse.json({ items: loadContentItems() });
});

export const POST = withCms(async (userId, request: NextRequest) => {
  const body = await request.json();
  const result = createContent(userId, body);
  return NextResponse.json(result, { status: 201 });
});
