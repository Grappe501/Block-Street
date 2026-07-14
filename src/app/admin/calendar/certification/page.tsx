import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";

export const metadata = { title: "Admin · CAL-P1 certification" };

export default function AdminCalendarCertificationPage() {
  return (
    <CommandChrome
      title="CAL-P1 certification"
      subtitle="Full durable journey is CAL-P1.8. Wave 1 status remains PRESENT / not CERTIFIED."
      backHref="/admin/calendar/system"
    >
      <CommandSection title="Verdict">
        <p className="font-fieldSans text-sm font-semibold text-field-ink">State: PRESENT (architecture) — not CERTIFIED</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/80">
          <li>Evidence pack path (later): data/calendar/certification/CAL-P1/</li>
          <li>Report path (later): docs/calendar/CAL_P1_CERTIFICATION_REPORT.md</li>
          <li>Blockers until primary + RBAC + staffing + publication journey pass</li>
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
