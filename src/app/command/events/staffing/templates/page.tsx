import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { listTemplates } from "@/lib/calendar/templates";

export default function CommandStaffingTemplatesPage() {
  const volunteerTemplates = listTemplates({ volunteerNeed: true });

  return (
    <CommandChrome title="Template staffing" subtitle="Templates with volunteer role defaults" backHref="/command/events/staffing" backLabel="Staffing">
      <StaffingSoftBetaNote />
      <CommandSection title={`${volunteerTemplates.length} templates`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {volunteerTemplates.map((t) => (
            <li key={t.templateId} className="rounded-lg border bg-white p-3">
              <Link href={`/calendar/templates/${t.templateId}`} className="font-bold text-field-pine underline">{t.name}</Link>
              <p>{t.volunteerRoles.length} volunteer roles</p>
            </li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
