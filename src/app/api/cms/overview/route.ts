import { NextResponse } from "next/server";
import { withCms } from "@/lib/cms/http";
import { getCmsOverview, loadContentItems } from "@/lib/cms/engine";
import { editorialPermissionsForUser } from "@/lib/cms/permissions";

export const GET = withCms((userId) => {
  return NextResponse.json({
    overview: getCmsOverview(),
    permissions: editorialPermissionsForUser(userId),
    recent: loadContentItems().slice(0, 10),
  });
});
