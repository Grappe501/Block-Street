import Link from "next/link";

type Row = {
  taskId: string;
  taskKey: string;
  title: string;
  required: boolean;
  status: string;
  ownerUserId?: string | null;
  dueAt?: string | null;
  blocksReadiness: boolean;
};

export function TaskChecklistTable({ rows, eventId }: { rows: Row[]; eventId: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse font-fieldSans text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-field-ink/60">
            <th className="p-2">Task</th>
            <th className="p-2">Required</th>
            <th className="p-2">Status</th>
            <th className="p-2">Due</th>
            <th className="p-2">Owner</th>
            <th className="p-2">Blocks readiness</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.taskId} className="border-b">
              <td className="p-2">
                <Link href={`/calendar/event/${eventId}/tasks/${r.taskId}`} className="text-field-pine underline">
                  {r.title}
                </Link>
              </td>
              <td className="p-2">{r.required ? "Yes" : "No"}</td>
              <td className="p-2">{r.status.replace(/_/g, " ")}</td>
              <td className="p-2 text-xs">{r.dueAt ? new Date(r.dueAt).toLocaleDateString() : "—"}</td>
              <td className="p-2">{r.ownerUserId ? `…${r.ownerUserId.slice(-4)}` : "—"}</td>
              <td className="p-2">{r.blocksReadiness ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
