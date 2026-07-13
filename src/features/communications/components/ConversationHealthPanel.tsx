import type { CommunicationHealthSnapshot } from "@/lib/civic-action/builds/11.7/intelligence";

export function ConversationHealthPanel({ health }: { health: CommunicationHealthSnapshot }) {
  return (
    <section aria-labelledby="conv-health" className="card">
      <h2 id="conv-health" className="text-lg font-bold text-slate-900">
        Conversation Health
      </h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">Response time</dt>
          <dd className="text-xl font-bold">{health.response_time_score}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Decision latency</dt>
          <dd className="text-xl font-bold">{health.decision_latency_score}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Meeting efficiency</dt>
          <dd className="text-xl font-bold">{health.meeting_efficiency_score}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-slate-600">
        {health.unanswered_questions} unanswered · {health.stalled_threads} stalled · {health.pending_decisions}{" "}
        pending decisions
      </p>
    </section>
  );
}
