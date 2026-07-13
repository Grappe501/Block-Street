import type { MissionConversationView } from "@/lib/civic-action/builds/11.7/ux";
import { AICommunicationAssistant } from "./AICommunicationAssistant";
import { ConversationTimeline } from "./ConversationTimeline";

export function MissionConversationPanel({ view }: { view: MissionConversationView }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{view.display_name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {view.lifecycle_label} · Mission {view.mission_id}
        </p>
        <p className="mt-2 max-w-2xl text-slate-700">{view.purpose}</p>
        {view.archived_banner && (
          <p role="alert" className="mt-3 rounded border border-slate-300 bg-slate-100 px-3 py-2 text-sm">
            {view.archived_banner}
          </p>
        )}
      </header>

      <section aria-labelledby="threads-heading">
        <h2 id="threads-heading" className="text-lg font-bold text-slate-900">
          Threads
        </h2>
        <ul className="mt-2 space-y-2">
          {view.threads.map((th) => (
            <li key={th.id} className="card text-sm">
              <span className="font-medium">{th.subject}</span>
              <span className="ml-2 text-slate-500">
                {th.message_count} messages{th.resolved ? " · resolved" : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <ConversationTimeline entries={view.timeline} />

      <section aria-labelledby="participants-heading">
        <h2 id="participants-heading" className="text-lg font-bold text-slate-900">
          Participants
        </h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {view.participants.map((p) => (
            <li key={p.human_id} className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-900">
              {p.label} · {p.role}
            </li>
          ))}
        </ul>
      </section>

      {view.governed_actions.length > 0 && (
        <section aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="text-lg font-bold text-slate-900">
            Governed Actions
          </h2>
          <ul className="mt-2 space-y-2">
            {view.governed_actions.map((a) => (
              <li key={a.action_key} className="card">
                <span className="font-medium">{a.label}</span>
                <p className="text-sm text-slate-600">{a.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AICommunicationAssistant prompts={view.ai_suggestion_prompts} />
    </div>
  );
}
