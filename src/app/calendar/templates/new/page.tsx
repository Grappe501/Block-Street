import Link from "next/link";
import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { TemplateSoftBetaNote } from "@/components/calendar/templates/TemplateCard";

export default function TemplateNewPage() {
  return (
    <CalendarChrome title="New template" subtitle="Template administration remains restricted — soft-beta catalog is seed-defined." nav={<CalendarNav />} backHref="/calendar/templates" backLabel="Templates">
      <CalendarHonestyBanner />
      <TemplateSoftBetaNote />
      <p className="font-fieldSans text-sm text-field-ink/80">
        Custom template authoring is planned for a later certification gate. Use the active seed catalog or propose a one-off event.
      </p>
      <Link href="/calendar/create" className="mt-4 inline-block font-fieldSans text-sm font-semibold text-field-pine underline">
        Propose event without template →
      </Link>
    </CalendarChrome>
  );
}
