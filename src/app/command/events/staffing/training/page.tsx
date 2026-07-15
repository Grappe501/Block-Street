import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { SEED_EVENTS, listShifts, TRAINING_CATALOG, ensureStaffingFromEvent } from "@/lib/calendar";

export default function CommandStaffingTrainingPage() {
  SEED_EVENTS.forEach((e) => ensureStaffingFromEvent(e));
  const shiftTraining = new Set<string>();
  for (const e of SEED_EVENTS) listShifts(e.event_id).forEach((s) => s.trainingRequirementKeys.forEach((k) => shiftTraining.add(k)));

  return (
    <CommandChrome title="Staffing training" subtitle="Training requirements across events" backHref="/command/events/staffing" backLabel="Staffing">
      <StaffingSoftBetaNote />
      <CommandSection title="Active training keys in shifts">
        <ul className="font-fieldSans text-sm">
          {TRAINING_CATALOG.filter((t) => shiftTraining.has(t.trainingKey)).map((t) => (
            <li key={t.trainingKey} className="rounded-lg border bg-white p-2 mb-2">{t.label}</li>
          ))}
        </ul>
      </CommandSection>
    </CommandChrome>
  );
}
