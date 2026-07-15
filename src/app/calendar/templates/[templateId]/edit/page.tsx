import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { getTemplateById } from "@/lib/calendar/templates";

export default async function TemplateEditPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);
  if (!template) notFound();
  return (
    <CalendarChrome title={`Edit · ${template.name}`} subtitle="Template updates do not silently rewrite existing events." backHref={`/calendar/templates/${templateId}`} backLabel="Template" nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <p className="font-fieldSans text-sm">Version {template.version} · Status {template.status}. Comparison-based updates planned for CAL-P2 later waves.</p>
      <Link href={`/calendar/templates/${templateId}/use`} className="mt-3 inline-block text-sm font-semibold text-field-pine underline">Use current version →</Link>
    </CalendarChrome>
  );
}
