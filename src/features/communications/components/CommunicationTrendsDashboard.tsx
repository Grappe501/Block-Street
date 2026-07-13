import type { CommunicationHealthDimension } from "@/lib/civic-action/builds/11.7/optimization";

export function CommunicationTrendsDashboard({ health }: { health: CommunicationHealthDimension[] }) {
  return (
    <section aria-labelledby="com-trends" className="card">
      <h2 id="com-trends" className="text-lg font-bold text-slate-900">
        Communication Health Trends
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-4">
        {health.map((d) => (
          <li key={d.dimension} className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold uppercase text-teal-700">{d.label}</p>
            <p className="text-lg font-bold">{d.score_band}</p>
            <p className="text-xs capitalize text-slate-500">{d.state}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
