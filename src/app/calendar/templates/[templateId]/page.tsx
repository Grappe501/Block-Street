import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { getTemplateById } from "@/lib/calendar/templates";

export default async function TemplateDetailPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);
  if (!template) notFound();

  return (
    <CalendarChrome title={template.name} subtitle={template.shortDescription} nav={<CalendarNav />} backHref="/calendar/templates" backLabel="Templates">
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <p className="mt-4 font-fieldSans text-sm text-field-ink/85">{template.fullDescription}</p>
      <dl className="mt-4 grid gap-2 font-fieldSans text-sm sm:grid-cols-2">
        <div><dt className="font-semibold">Category</dt><dd>{template.category}</dd></div>
        <div><dt className="font-semibold">Duration</dt><dd>{template.defaults.durationMinutes} minutes</dd></div>
        <div><dt className="font-semibold">Version</dt><dd>{template.version}</dd></div>
        <div><dt className="font-semibold">Recurring suitable</dt><dd>{template.recurringSuitable ? "Yes" : "No"}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/calendar/templates/${template.templateId}/preview`} className="rounded-lg border px-3 py-2 font-fieldSans text-sm font-semibold">Preview</Link>
        <Link href={`/calendar/templates/${template.templateId}/use`} className="rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-sm font-bold text-field-wheat">Use template</Link>
      </div>
    </CalendarChrome>
  );
}
