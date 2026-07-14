"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import {
  clearPowerOf5Team,
  emptyPowerOf5Team,
  readPowerOf5Team,
  writePowerOf5Team,
  type PowerOf5Seat,
  type PowerOf5Team,
} from "@/lib/meeting/power-of-5";

export default function PowerOf5MyTeamPage() {
  const [team, setTeam] = useState<PowerOf5Team>(emptyPowerOf5Team());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTeam(readPowerOf5Team());
    setReady(true);
  }, []);

  function updateSeat(seat: number, patch: Partial<PowerOf5Seat>) {
    setTeam((prev) => {
      const seats = prev.seats.map((row) => {
        if (row.seat !== seat) return row;
        const next = { ...row, ...patch };
        if (next.displayName.trim()) {
          if (next.status === "empty") next.status = "named";
        } else {
          next.status = "empty";
        }
        return next;
      });
      const nextTeam = { ...prev, seats, updatedAt: new Date().toISOString() };
      writePowerOf5Team(nextTeam);
      return nextTeam;
    });
  }

  return (
    <MeetingChrome
      title="My team"
      subtitle="Five soft-beta seats stored in this browser only. Not a certified roster — a private planner so you can welcome people with intention."
    >
      <p className="mb-4 text-sm">
        <Link href="/power-of-5/start" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Start
        </Link>
      </p>

      {!ready ? (
        <p className="text-sm text-slate-600">Loading seats…</p>
      ) : (
        <div className="space-y-4">
          {team.seats.map((seat) => (
            <div key={seat.seat} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-slate-950">Seat {seat.seat}</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {seat.status.replace("_", " ")}
                </span>
              </div>
              <label className="mt-3 block text-sm">
                <span className="font-medium text-slate-800">Name</span>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  value={seat.displayName}
                  onChange={(e) => updateSeat(seat.seat, { displayName: e.target.value })}
                  placeholder="Someone you trust"
                  aria-label={`Seat ${seat.seat} name`}
                />
              </label>
              <label className="mt-3 block text-sm">
                <span className="font-medium text-slate-800">Note</span>
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  rows={2}
                  value={seat.note}
                  onChange={(e) => updateSeat(seat.seat, { note: e.target.value })}
                  placeholder="How you’ll welcome them"
                  aria-label={`Seat ${seat.seat} note`}
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  className="rounded border border-slate-300 px-2.5 py-1.5 font-semibold"
                  onClick={() => updateSeat(seat.seat, { status: seat.displayName.trim() ? "invite_ready" : "empty" })}
                >
                  Mark invite-ready
                </button>
                <button
                  type="button"
                  className="rounded border border-slate-300 px-2.5 py-1.5 font-semibold"
                  onClick={() => updateSeat(seat.seat, { status: seat.displayName.trim() ? "followed_up" : "empty" })}
                >
                  Mark followed up
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/power-of-5/invite" className="rounded-lg bg-brand-700 px-4 py-2.5 font-semibold text-white">
          Invite prep
        </Link>
        <Link href="/power-of-5/follow-up" className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold">
          Follow-up
        </Link>
        <button
          type="button"
          className="rounded-lg px-4 py-2.5 font-semibold text-slate-600 underline-offset-2 hover:underline"
          onClick={() => {
            clearPowerOf5Team();
            setTeam(emptyPowerOf5Team());
          }}
        >
          Clear local seats
        </button>
      </div>

      <div className="mt-8">
        <HonestyPanel
          workingNow={["Browser-local seat planner", "Status markers for prep"]}
          stillCompleting={["Shared durable teams", "CERTIFIED invites"]}
        />
      </div>
    </MeetingChrome>
  );
}
