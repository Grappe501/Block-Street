"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CalendarEventTemplate } from "@/lib/calendar/templates";

export function TemplateUseForm({
  template,
  action,
}: {
  template: CalendarEventTemplate;
  action: (payload: Record<string, string>) => Promise<{ eventId?: string; seriesId?: string }>;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
            if (result.seriesId) router.push(`/calendar/series/${result.seriesId}`);
            else if (result.eventId) router.push(`/calendar/event/${result.eventId}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create event.");
          }
        });
      }}
    >
      <p className="font-fieldSans text-xs font-semibold text-field-ink/60">Step {step} of 4</p>
      {step === 1 ? (
        <fieldset className="space-y-3 rounded-xl border border-field-ink/15 bg-white p-4">
          <legend className="font-fieldSans text-sm font-bold text-field-ink">Scope</legend>
          <label className="block font-fieldSans text-sm">
            College slug (optional)
            <input name="collegeSlug" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="uca" />
          </label>
          <label className="block font-fieldSans text-sm">
            County slug (optional)
            <input name="countySlug" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="faulkner" />
          </label>
          <label className="flex items-center gap-2 font-fieldSans text-sm">
            <input type="checkbox" name="campaignWide" value="yes" /> Campaign-wide
          </label>
        </fieldset>
      ) : null}
      {step === 2 ? (
        <fieldset className="space-y-3 rounded-xl border border-field-ink/15 bg-white p-4">
          <legend className="font-fieldSans text-sm font-bold text-field-ink">Event basics</legend>
          <label className="block font-fieldSans text-sm">
            Title
            <input name="title" defaultValue={template.name} required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="block font-fieldSans text-sm">
            Start
            <input name="start_at" type="datetime-local" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="block font-fieldSans text-sm">
            Location
            <input name="location" className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="block font-fieldSans text-sm">
            Owner team
            <input name="owned_by_team" defaultValue={template.ownership.owningTeamKeys[0] ?? ""} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        </fieldset>
      ) : null}
      {step === 3 ? (
        <fieldset className="space-y-3 rounded-xl border border-field-ink/15 bg-white p-4">
          <legend className="font-fieldSans text-sm font-bold text-field-ink">One-time or recurring</legend>
          <label className="flex items-center gap-2 font-fieldSans text-sm">
            <input type="radio" name="mode" value="once" defaultChecked /> One-time event
          </label>
          <label className="flex items-center gap-2 font-fieldSans text-sm">
            <input type="radio" name="mode" value="series" /> Recurring series
          </label>
          <label className="block font-fieldSans text-sm">
            Recurrence (if series)
            <select name="recurrence" className="mt-1 w-full rounded-lg border px-3 py-2" defaultValue="weekly">
              <option value="weekly">Every week</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className="flex items-center gap-2 font-fieldSans text-sm">
            <input type="checkbox" name="kelly_requested" value="yes" /> Request Kelly (not confirmation)
          </label>
        </fieldset>
      ) : null}
      {step === 4 ? (
        <div className="rounded-xl border border-field-ink/15 bg-white p-4 font-fieldSans text-sm text-field-ink/85">
          <p className="font-bold text-field-ink">Review</p>
          <p className="mt-2">Template: {template.name} v{template.version}</p>
          <p className="mt-1">Volunteer roles: {template.volunteerRoles.length} suggested (not assigned)</p>
          <p className="mt-1">Tasks: {template.tasks.length} generated</p>
          <p className="mt-2 text-xs text-field-ink/60">Soft-beta session-local draft. Not durable until Gate A closes.</p>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {step > 1 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-lg border px-3 py-2 font-fieldSans text-sm font-semibold">
            Back
          </button>
        ) : null}
        {step < 4 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-sm font-bold text-field-wheat">
            Next
          </button>
        ) : (
          <button type="submit" disabled={pending} className="rounded-lg bg-field-pine px-3 py-2 font-fieldSans text-sm font-bold text-white">
            {pending ? "Creating…" : "Create soft-beta draft"}
          </button>
        )}
      </div>
      {error ? <p className="font-fieldSans text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
