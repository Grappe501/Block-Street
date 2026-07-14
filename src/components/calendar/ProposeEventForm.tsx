"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CalendarEventType, ProposeEventInput } from "@/lib/calendar";

export function ProposeEventForm({
  action,
  defaults,
}: {
  action: (input: ProposeEventInput) => Promise<{ event_id: string }>;
  defaults?: Partial<ProposeEventInput>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4 rounded-xl border border-field-ink/15 bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            const result = await action({
              title: String(fd.get("title") ?? ""),
              description: String(fd.get("description") ?? ""),
              start_time: String(fd.get("start_time") ?? ""),
              end_time: String(fd.get("end_time") ?? ""),
              event_type: String(fd.get("event_type") ?? "networking_event") as CalendarEventType,
              location: String(fd.get("location") ?? "") || undefined,
              city: String(fd.get("city") ?? "") || undefined,
              county_slug: (defaults?.county_slug as string | null) ?? null,
              college_slug: (defaults?.college_slug as string | null) ?? null,
              scope: defaults?.scope,
              kelly_requested: fd.get("kelly_requested") === "yes",
              volunteers_needed: Number(fd.get("volunteers_needed") || 0) || undefined,
            });
            router.push(`/calendar/event/${result.event_id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not propose event.");
          }
        });
      }}
    >
      <label className="block font-fieldSans text-sm">
        <span className="font-semibold text-field-ink">Title</span>
        <input name="title" required className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" />
      </label>
      <label className="block font-fieldSans text-sm">
        <span className="font-semibold text-field-ink">Description</span>
        <textarea name="description" required rows={3} className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block font-fieldSans text-sm">
          <span className="font-semibold text-field-ink">Start</span>
          <input name="start_time" type="datetime-local" required className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" />
        </label>
        <label className="block font-fieldSans text-sm">
          <span className="font-semibold text-field-ink">End</span>
          <input name="end_time" type="datetime-local" required className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" />
        </label>
      </div>
      <label className="block font-fieldSans text-sm">
        <span className="font-semibold text-field-ink">Type</span>
        <select name="event_type" className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" defaultValue="networking_event">
          <option value="networking_event">Networking event</option>
          <option value="voter_registration_drive">Voter-registration drive</option>
          <option value="recruitment_event">Recruitment event</option>
          <option value="volunteer_training">Volunteer training</option>
          <option value="college_community_meeting">College Community meeting</option>
          <option value="county_meeting">County meeting</option>
          <option value="canvass">Canvass</option>
          <option value="candidate_appearance">Candidate appearance</option>
          <option value="orientation">Orientation</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label className="flex items-center gap-2 font-fieldSans text-sm text-field-ink">
        <input type="checkbox" name="kelly_requested" value="yes" />
        Request Kelly attendance (starts as requested — not confirmed)
      </label>
      <label className="block font-fieldSans text-sm">
        <span className="font-semibold text-field-ink">Volunteers needed (optional)</span>
        <input name="volunteers_needed" type="number" min={0} className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" />
      </label>
      <label className="block font-fieldSans text-sm">
        <span className="font-semibold text-field-ink">Location (optional)</span>
        <input name="location" className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" />
      </label>
      <label className="block font-fieldSans text-sm">
        <span className="font-semibold text-field-ink">City (optional)</span>
        <input name="city" defaultValue={defaults?.city ?? ""} className="mt-1 w-full rounded-lg border border-field-ink/20 px-3 py-2" />
      </label>
      {error ? <p className="font-fieldSans text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-field-dusk px-4 py-2 font-fieldSans text-sm font-bold text-field-wheat hover:bg-field-pine disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Propose event"}
      </button>
      <p className="font-fieldSans text-xs text-field-ink/60">Soft beta — proposals stay session-local until production persistence ships.</p>
    </form>
  );
}
