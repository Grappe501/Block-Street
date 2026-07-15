import Link from "next/link";

type Row = {
  itemId: string;
  category: string;
  label: string;
  required: boolean;
  status: string;
  dueAt?: string | null;
  communicationState?: string;
};

export function PreparationChecklistTable({ rows, eventId }: { rows: Row[]; eventId: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse font-fieldSans text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-field-ink/60">
            <th className="p-2">Item</th>
            <th className="p-2">Category</th>
            <th className="p-2">Required</th>
            <th className="p-2">Status</th>
            <th className="p-2">Due</th>
            <th className="p-2">Communication</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.itemId} className="border-b">
              <td className="p-2">
                <Link href={`/calendar/event/${eventId}/preparation/${r.itemId}`} className="text-field-pine underline">
                  {r.label}
                </Link>
              </td>
              <td className="p-2">{r.category}</td>
              <td className="p-2">{r.required ? "Yes" : "No"}</td>
              <td className="p-2">{r.status.replace(/_/g, " ")}</td>
              <td className="p-2 text-xs">{r.dueAt ? new Date(r.dueAt).toLocaleDateString() : "—"}</td>
              <td className="p-2 text-xs">{r.communicationState?.replace(/_/g, " ") ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
