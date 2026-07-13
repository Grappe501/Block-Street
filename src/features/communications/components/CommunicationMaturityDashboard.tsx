import type { CommunicationMaturityView } from "@/lib/civic-action/builds/11.7/optimization";

export function CommunicationMaturityDashboard({ maturity }: { maturity: CommunicationMaturityView }) {
  return (
    <section aria-labelledby="com-maturity" className="card">
      <h2 id="com-maturity" className="text-lg font-bold text-slate-900">
        Communication Maturity
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-5">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Level</p>
          <p className="text-2xl font-bold capitalize">{maturity.level}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Score</p>
          <p className="text-2xl font-bold">{maturity.score}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Archived</p>
          <p className="text-2xl font-bold">{maturity.archived_conversations}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Lessons</p>
          <p className="text-2xl font-bold">{maturity.lessons_captured}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Templates</p>
          <p className="text-2xl font-bold">{maturity.templates_evolved}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{maturity.explanation}</p>
    </section>
  );
}
