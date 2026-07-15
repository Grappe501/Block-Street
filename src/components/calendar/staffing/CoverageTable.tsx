import Link from "next/link";
import type { CalendarShiftCoverage } from "@/lib/calendar/staffing";

export function CoverageTable({ rows, eventId }: { rows: Array<CalendarShiftCoverage & { roleLabel?: string }>; eventId: string }) {
  if (rows.length === 0) {
    return <p className="font-fieldSans text-sm text-field-ink/70">No shift coverage data yet.</p>;
  }
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse font-fieldSans text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-field-ink/60">
              <th className="p-2">Role / shift</th>
              <th className="p-2">Min</th>
              <th className="p-2">Target</th>
              <th className="p-2">Confirmed</th>
              <th className="p-2">Interest</th>
              <th className="p-2">Gap</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.shiftId} className="border-b">
                <td className="p-2"><Link href={`/calendar/event/${eventId}/shifts/${r.shiftId}`} className="text-field-pine underline">{r.roleLabel ?? r.shiftId}</Link></td>
                <td className="p-2">{r.minimumNeeded}</td>
                <td className="p-2">{r.targetNeeded}</td>
                <td className="p-2">{r.confirmedCount}</td>
                <td className="p-2">{r.interestedCount} ({r.eligibleInterestCount} eligible)</td>
                <td className="p-2">{r.minimumGap}</td>
                <td className="p-2">{r.coverageStatus.replace(/_/g, " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 md:hidden">
        {rows.map((r) => (
          <li key={r.shiftId} className="rounded-lg border bg-white p-3">
            <Link href={`/calendar/event/${eventId}/shifts/${r.shiftId}`} className="font-semibold text-field-pine underline">{r.roleLabel ?? "Shift"}</Link>
            <p className="mt-1 font-fieldSans text-xs text-field-ink/70">Confirmed {r.confirmedCount}/{r.targetNeeded} · Gap {r.minimumGap} · {r.coverageStatus.replace(/_/g, " ")}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
