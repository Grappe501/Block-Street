"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ShiftBuilderForm({
  eventId,
  requirements,
  roles,
  action,
}: {
  eventId: string;
  requirements: Array<{ requirementId: string; roleLabel: string; roleKey: string }>;
  roles: Array<{ roleKey: string; label: string }>;
  action: (data: Record<string, string>) => Promise<{ shiftId: string }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd.entries()) as Record<string, string>;
        startTransition(async () => {
          try {
            const result = await action(data);
            router.push(`/calendar/event/${eventId}/shifts/${result.shiftId}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create shift.");
          }
        });
      }}
    >
      <fieldset className="space-y-3 rounded-xl border bg-white p-4">
        <legend className="font-fieldSans text-sm font-bold">Basic information</legend>
        <label className="block font-fieldSans text-sm">
          Shift name
          <input name="name" required className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Registration table — morning" />
        </label>
        <label className="block font-fieldSans text-sm">
          Staffing requirement
          <select name="requirementId" required className="mt-1 w-full rounded-lg border px-3 py-2">
            {requirements.map((r) => (
              <option key={r.requirementId} value={r.requirementId}>{r.roleLabel}</option>
            ))}
          </select>
        </label>
        <label className="block font-fieldSans text-sm">
          Role (catalog)
          <select name="roleKey" className="mt-1 w-full rounded-lg border px-3 py-2">
            {roles.map((r) => (
              <option key={r.roleKey} value={r.roleKey}>{r.label}</option>
            ))}
          </select>
        </label>
      </fieldset>
      <fieldset className="space-y-3 rounded-xl border bg-white p-4">
        <legend className="font-fieldSans text-sm font-bold">Time</legend>
        <label className="block font-fieldSans text-sm">Start <input name="startAt" type="datetime-local" required className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="block font-fieldSans text-sm">End <input name="endAt" type="datetime-local" required className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="block font-fieldSans text-sm">Arrival <input name="arrivalAt" type="datetime-local" className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
      </fieldset>
      <fieldset className="space-y-3 rounded-xl border bg-white p-4">
        <legend className="font-fieldSans text-sm font-bold">Capacity</legend>
        <label className="block font-fieldSans text-sm">Minimum <input name="minimumNeeded" type="number" min={0} defaultValue={1} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="block font-fieldSans text-sm">Target <input name="targetNeeded" type="number" min={1} defaultValue={2} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="flex items-center gap-2 font-fieldSans text-sm"><input type="checkbox" name="leadRequired" value="yes" /> Lead required</label>
      </fieldset>
      <fieldset className="space-y-3 rounded-xl border bg-white p-4">
        <legend className="font-fieldSans text-sm font-bold">Logistics</legend>
        <label className="block font-fieldSans text-sm">Check-in location <input name="checkInLocation" className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="block font-fieldSans text-sm">Instructions <textarea name="instructions" className="mt-1 w-full rounded-lg border px-3 py-2" rows={3} /></label>
      </fieldset>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={pending} className="rounded-lg bg-field-dusk px-4 py-2 font-fieldSans text-sm font-bold text-field-wheat disabled:opacity-60">
        {pending ? "Creating…" : "Create shift (soft beta)"}
      </button>
    </form>
  );
}
