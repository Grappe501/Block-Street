import Link from "next/link";
import type { MonthGridCell } from "@/lib/calendar";

export function MonthGrid({ weeks, monthLabel }: { weeks: MonthGridCell[][]; monthLabel: string }) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <p className="mb-3 font-fieldDisplay text-xl text-field-ink">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center font-fieldSans text-[11px] font-semibold uppercase tracking-wide text-field-ink/60">
        {weekdays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((cell) => (
          <div
            key={cell.date}
            className={`min-h-[88px] rounded-lg border px-1 py-1 ${
              cell.inMonth ? "border-field-ink/15 bg-white" : "border-field-ink/5 bg-field-paper/80"
            }`}
          >
            <p className={`font-fieldSans text-xs font-semibold ${cell.inMonth ? "text-field-ink" : "text-field-ink/35"}`}>
              {Number(cell.date.slice(8, 10))}
            </p>
            <ul className="mt-1 space-y-0.5">
              {cell.events.slice(0, 2).map((e) => (
                <li key={e.event_id}>
                  <Link
                    href={`/calendar/event/${e.event_id}`}
                    className="block truncate rounded bg-field-dusk px-1 py-0.5 font-fieldSans text-[10px] text-field-wheat hover:bg-field-pine"
                  >
                    {e.title}
                  </Link>
                </li>
              ))}
              {cell.events.length > 2 ? (
                <li className="font-fieldSans text-[10px] text-field-ink/50">+{cell.events.length - 2} more</li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
