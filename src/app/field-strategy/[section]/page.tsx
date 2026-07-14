import { notFound } from "next/navigation";
import { ManualNav } from "@/components/field-strategy/ManualNav";
import { SectionView } from "@/components/field-strategy/SectionView";
import { SECTIONS } from "@/lib/field-strategy/content";
import type { ManualSectionId } from "@/lib/field-strategy/nav";

/** Every manual section with content gets a drill-down page (not only top-nav items). */
export function generateStaticParams() {
  return (Object.keys(SECTIONS) as ManualSectionId[])
    .filter((id) => id !== "overview")
    .map((section) => ({ section }));
}

export default async function FieldStrategySectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: raw } = await params;
  const section = raw as ManualSectionId;
  const data = SECTIONS[section];
  if (!data || section === "overview") notFound();

  return (
    <>
      <ManualNav active={section} />
      <SectionView section={data} />
    </>
  );
}
