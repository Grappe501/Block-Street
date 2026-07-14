import { DirectorOmniview } from "@/components/director/DirectorOmniview";
import { buildDirectorInspectCatalog } from "@/lib/director/inspect-catalog";

export const metadata = {
  title: "Director Omniview — ASYON",
};

export default function DirectorPage() {
  const catalog = buildDirectorInspectCatalog();
  return <DirectorOmniview catalog={catalog} />;
}
