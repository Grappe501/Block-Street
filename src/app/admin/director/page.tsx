import { DirectorOmniview } from "@/components/director/DirectorOmniview";
import { buildDirectorInspectCatalog } from "@/lib/director/inspect-catalog";
import { requireAdminPageAccess } from "@/lib/admin/guard";

export const metadata = {
  title: "Director Omniview — ASYON",
};

export default async function DirectorPage() {
  await requireAdminPageAccess();
  const catalog = buildDirectorInspectCatalog();
  return <DirectorOmniview catalog={catalog} />;
}
