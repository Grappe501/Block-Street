import Link from "next/link";
import type { CalendarEventTemplate } from "@/lib/calendar/templates";

export function TemplateCard({ template }: { template: CalendarEventTemplate }) {
  return (
    <article className="rounded-xl border border-field-ink/15 bg-white p-4 shadow-sm">
      <p className="font-fieldSans text-xs font-semibold uppercase tracking-wide text-field-pine">{template.category.replace(/_/g, " ")}</p>
      <h3 className="mt-1 font-fieldSans text-sm font-bold text-field-ink">
        <Link href={`/calendar/templates/${template.templateId}`} className="hover:text-field-pine">
          {template.name}
        </Link>
      </h3>
      <p className="mt-2 font-fieldSans text-xs text-field-ink/70">{template.shortDescription}</p>
      <p className="mt-2 font-fieldSans text-xs text-field-ink/55">
        {template.defaults.durationMinutes} min · {template.defaults.visibility} · v{template.version}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/calendar/templates/${template.templateId}/preview`} className="rounded-lg border border-field-ink/20 px-2.5 py-1 font-fieldSans text-xs font-semibold text-field-ink">
          Preview
        </Link>
        <Link href={`/calendar/templates/${template.templateId}/use`} className="rounded-lg bg-field-dusk px-2.5 py-1 font-fieldSans text-xs font-bold text-field-wheat">
          Use template
        </Link>
      </div>
    </article>
  );
}

export function TemplateSoftBetaNote() {
  return (
    <p className="rounded-lg border border-field-wheat/30 bg-field-paper px-3 py-2 font-fieldSans text-xs text-field-ink/75">
      Template preview · Soft-beta draft · Session-local · Gate A OPEN · RBAC audit_only · Manual confirmation required for Kelly, volunteers, and publication.
    </p>
  );
}
