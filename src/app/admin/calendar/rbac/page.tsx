import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { getCalendarPersistenceConfig } from "@/lib/calendar/persistence";

export const metadata = { title: "Admin · Calendar RBAC" };

export default function AdminCalendarRbacPage() {
  const cfg = getCalendarPersistenceConfig();
  return (
    <CommandChrome title="Calendar RBAC" subtitle="CAL-P1.2 authority matrix — Wave 3. Mode is audit_only until enforced." backHref="/admin/calendar/system">
      <CommandSection title="Current mode">
        <p className="font-fieldSans text-sm text-field-ink">RBAC mode: {cfg.rbacMode}</p>
        <p className="mt-2 font-fieldSans text-sm text-field-ink/75">
          Matrix path (forthcoming in P1.2): <code>data/calendar/calendar-rbac-matrix.json</code>
        </p>
      </CommandSection>
    </CommandChrome>
  );
}
