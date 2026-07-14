"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import { COLLEGE_POSITIONS } from "@/lib/meeting/positions-catalog";
import { appendJoinInterest } from "@/lib/meeting/july14-registry";

function InterestForm() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("position") ?? "";
  const from = params.get("from");
  const item = params.get("item");

  const [name, setName] = useState("");
  const [campusOrPlace, setCampusOrPlace] = useState("");
  const [positionId, setPositionId] = useState(preset);
  const [note, setNote] = useState("");
  const [contactOk, setContactOk] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (preset) setPositionId(preset);
  }, [preset]);

  const positionLabel = useMemo(
    () => COLLEGE_POSITIONS.find((p) => p.id === positionId)?.title ?? "General interest",
    [positionId],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    appendJoinInterest({
      name: name.trim() || "Anonymous soft-beta interest",
      campusOrPlace: campusOrPlace.trim(),
      positionId: positionId || "general",
      note: note.trim(),
      contactOk,
    });
    setSaved(true);
    const qs = new URLSearchParams();
    if (from) qs.set("from", from);
    if (item) qs.set("item", item);
    qs.set("position", positionId || "general");
    router.push(`/join/next-step?${qs.toString()}`);
  }

  return (
    <MeetingChrome
      title="Express interest"
      subtitle="This stores a soft-beta interest note in your browser. It is not an appointment and does not assign personnel."
      eyebrow="Soft beta · Join"
    >
      {saved ? (
        <p className="text-sm text-emerald-800">Saved — heading to next step…</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Name</span>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we greet you?"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Campus or place</span>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={campusOrPlace}
              onChange={(e) => setCampusOrPlace(e.target.value)}
              placeholder="School or county hub"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Seat path</span>
            <select
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
            >
              <option value="">General interest</option>
              {COLLEGE_POSITIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-slate-500">Selected: {positionLabel}</span>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Note</span>
            <textarea
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What draws you to this seat?"
            />
          </label>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1"
              checked={contactOk}
              onChange={(e) => setContactOk(e.target.checked)}
            />
            <span>It’s okay to follow up about soft-beta next steps (still not an appointment).</span>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Save soft-beta interest
          </button>
        </form>
      )}

      <p className="mt-6 text-sm">
        <Link href="/join" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Join home
        </Link>
      </p>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["Browser-local interest notes", "Seat deep-links via ?position="]}
          stillCompleting={["Durable appointments", "Staffing workflows"]}
        />
      </div>
    </MeetingChrome>
  );
}

export default function JoinInterestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-600">Loading interest form…</div>}>
      <InterestForm />
    </Suspense>
  );
}
