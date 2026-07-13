import type { ExecutiveCommunicationBrief as BriefType } from "@/lib/civic-action/builds/11.7/intelligence";

export function ExecutiveCommunicationBrief({ brief }: { brief: BriefType }) {
  return (
    <section aria-labelledby="exec-brief" className="card border-teal-200 bg-teal-50/40">
      <h2 id="exec-brief" className="text-lg font-bold text-slate-900">
        Executive Brief ({brief.reading_time_minutes} min read)
      </h2>
      <p className="mt-1 text-sm text-slate-600">{brief.communication_momentum}</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase text-teal-800">Conversations at risk</dt>
          <dd className="text-lg font-bold">{brief.conversations_at_risk}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-teal-800">Priorities</dt>
          <dd className="text-lg font-bold">{brief.todays_priorities.length}</dd>
        </div>
      </dl>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {brief.pending_decisions.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </section>
  );
}
