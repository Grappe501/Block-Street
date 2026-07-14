import { notFound } from "next/navigation";
import { ManualNav } from "@/components/field-strategy/ManualNav";
import { SectionView } from "@/components/field-strategy/SectionView";
import { SECTIONS } from "@/lib/field-strategy/content";
import { MANUAL_NAV, type ManualSectionId } from "@/lib/field-strategy/nav";

export function generateStaticParams() {
  return MANUAL_NAV.filter((n) => n.id !== "overview").map((n) => ({ section: n.id }));
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
