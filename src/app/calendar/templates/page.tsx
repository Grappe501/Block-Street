import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateCard, TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";
import { TEMPLATE_CATEGORIES, listTemplates } from "@/lib/calendar/templates";

export const metadata = { title: "Event Template Library" };

export default function TemplateLibraryPage() {
  const templates = listTemplates({ status: "active" });

  return (
    <CalendarChrome title="Event Template Library" subtitle="Reusable templates — defaults, not irreversible commands." nav={<CalendarNav />}>
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/calendar/create" className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-sm font-semibold">
          Start without template
        </Link>
        <Link href="/calendar/series" className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-sm font-semibold">
          Recurring series
        </Link>
        <Link href="/command/events/templates" className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-sm font-semibold">
          Command templates view
        </Link>
      </div>
      <section className="mt-6">
        <h2 className="font-fieldDisplay text-xl text-field-ink">Categories</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {TEMPLATE_CATEGORIES.map((c) => (
            <span key={c.id} className="rounded-md border border-field-ink/15 px-2 py-1 font-fieldSans text-xs font-semibold text-field-ink/70">
              {c.label}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        {templates.map((t) => (
          <TemplateCard key={t.templateId} template={t} />
        ))}
      </section>
    </CalendarChrome>
  );
}
