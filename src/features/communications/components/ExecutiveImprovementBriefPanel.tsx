import type { ExecutiveImprovementBrief } from "@/lib/civic-action/builds/11.7/optimization";

export function ExecutiveImprovementBriefPanel({ brief }: { brief: ExecutiveImprovementBrief }) {
  return (
    <section aria-labelledby="exec-improve-brief" className="card border-teal-200 bg-teal-50/30">
      <h2 id="exec-improve-brief" className="text-lg font-bold text-slate-900">
        Executive Improvement Brief
      </h2>
      <p className="text-xs text-slate-500">{brief.reading_time_minutes}-minute read · advisory only</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-teal-800">What we learned</h3>
          <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
            {brief.what_we_learned.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-teal-800">Needs attention</h3>
          <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
            {brief.needs_attention.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
