import Link from "next/link";
import type { CalendarShiftCoverage } from "@/lib/calendar/staffing/types";

type Row = CalendarShiftCoverage & { roleLabel: string; shiftName: string; shiftId: string };

export function StaffingPipelineTable({ rows, eventId }: { rows: Row[]; eventId: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse font-fieldSans text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-field-ink/60">
            <th className="p-2">Role/shift</th>
            <th className="p-2 text-right">Min</th>
            <th className="p-2 text-right">Target</th>
            <th className="p-2 text-right">Interest</th>
            <th className="p-2 text-right">Reviewed</th>
            <th className="p-2 text-right">Offered</th>
            <th className="p-2 text-right">Waitlist</th>
            <th className="p-2 text-right">Soft-beta</th>
            <th className="p-2 text-right">Gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.shiftId} className="border-b">
              <td className="p-2">
                <Link href={`/calendar/event/${eventId}/shifts/${r.shiftId}`} className="text-field-pine underline">
                  {r.roleLabel} — {r.shiftName}
                </Link>
              </td>
              <td className="p-2 text-right">{r.minimumNeeded}</td>
              <td className="p-2 text-right">{r.targetNeeded}</td>
              <td className="p-2 text-right">{r.interestedCount}</td>
              <td className="p-2 text-right">{r.reviewedCount ?? 0}</td>
              <td className="p-2 text-right">{r.offeredCount ?? 0}</td>
              <td className="p-2 text-right">{r.waitlistCount ?? 0}</td>
              <td className="p-2 text-right">{r.softBetaConfirmedCount ?? r.confirmedCount}</td>
              <td className="p-2 text-right">{r.minimumGap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-fieldSans text-xs text-field-ink/60">
        Stages are not merged — interest, offers, waitlist, and soft-beta confirmed coverage remain distinct.
      </p>
    </div>
  );
}
