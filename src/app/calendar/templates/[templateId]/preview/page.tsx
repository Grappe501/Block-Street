import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { buildTemplatePreview, getTemplateById } from "@/lib/calendar/templates";

export default async function TemplatePreviewPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);
  if (!template) notFound();
  const preview = buildTemplatePreview(template);

  return (
    <CalendarChrome title={`Preview · ${template.name}`} subtitle="What this template will generate" nav={<CalendarNav />} backHref={`/calendar/templates/${templateId}`} backLabel="Template">
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <section className="mt-4 space-y-4 font-fieldSans text-sm">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-bold text-field-ink">Automatically generated</h2>
          <ul className="mt-2 list-disc pl-5">{preview.automatic.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-bold text-field-ink">Required tasks</h2>
          <ul className="mt-2 list-disc pl-5">{preview.required.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-bold text-field-ink">Volunteer roles (suggested, not assigned)</h2>
          <ul className="mt-2 list-disc pl-5">{template.volunteerRoles.map((r) => <li key={r.roleKey}>{r.title} ({r.numberNeeded})</li>)}</ul>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-bold text-field-ink">Readiness dimensions</h2>
          <p className="mt-1">Required: {template.readiness.requiredDimensions.join(", ")}</p>
          <p className="mt-1">Not applicable: {template.readiness.nonApplicableDimensions.join(", ")}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-bold text-field-ink">Manual confirmation required</h2>
          <ul className="mt-2 list-disc pl-5">{preview.manualConfirmation.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
      </section>
    </CalendarChrome>
  );
}
