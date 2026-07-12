import { notFound } from "next/navigation";
import { initiativeApplicationService } from "@/lib/civic-action/builds/11.1/services/application-service";

export default async function InitiativeHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agg = initiativeApplicationService.getAggregate(id);
  if (!agg) notFound();

  return (
    <div className="card">
      <h2 className="text-lg font-bold">Initiative History</h2>
      <p className="mt-1 text-sm text-slate-600">Human-readable timeline — not raw audit infrastructure.</p>
      <ol className="mt-6 space-y-4 border-l-2 border-orange-200 pl-4">
        {agg.history.length === 0 ? (
          <li className="text-sm text-slate-500">No history events yet.</li>
        ) : (
          [...agg.history].reverse().map((e) => (
            <li key={e.initiative_event_id}>
              <p className="text-xs text-slate-500">{new Date(e.occurred_at).toLocaleString()}</p>
              <p className="font-medium text-slate-900">{e.reason || e.event_type}</p>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
