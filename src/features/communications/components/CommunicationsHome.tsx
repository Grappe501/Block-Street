import Link from "next/link";
import type { CommunicationsHomeView } from "@/lib/civic-action/builds/11.7/ux";
import { AICommunicationAssistant } from "./AICommunicationAssistant";
import { CollaborationSidebar } from "./CollaborationSidebar";
import { DailyBriefCard } from "./DailyBriefCard";

export function CommunicationsHome({ view }: { view: CommunicationsHomeView }) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section aria-labelledby="collab-questions">
          <h2 id="collab-questions" className="text-lg font-bold text-slate-900">
            Collaboration Questions
          </h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {view.collaboration_questions.map((q) => (
              <div key={q.question} className="card">
                <dt className="text-sm font-semibold text-teal-800">{q.question}</dt>
                <dd className="mt-1 text-sm text-slate-700">{q.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {view.empty_state ? (
          <div className="card border-dashed text-center">
            <h2 className="text-lg font-bold text-slate-900">{view.empty_state.title}</h2>
            <p className="mt-2 text-slate-600">{view.empty_state.body}</p>
            <button type="button" className="btn-primary mt-4">
              {view.empty_state.action_label}
            </button>
          </div>
        ) : (
          <>
            <section aria-labelledby="priority-conversations">
              <h2 id="priority-conversations" className="text-lg font-bold text-slate-900">
                Priority Conversations
              </h2>
              <ul className="mt-3 space-y-2">
                {view.priority_conversations.map((c) => (
                  <li key={c.conversation_id}>
                    <Link href={c.href} className="card block hover:border-teal-300">
                      <span className="font-medium text-slate-900">{c.display_name}</span>
                      <p className="text-sm text-slate-600">{c.purpose_summary}</p>
                      <span className="mt-1 inline-block text-xs text-teal-700">{c.status_label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {view.pending_decisions.length > 0 && (
              <section aria-labelledby="pending-decisions">
                <h2 id="pending-decisions" className="text-lg font-bold text-slate-900">
                  Pending Decisions
                </h2>
                <ul className="mt-3 space-y-2">
                  {view.pending_decisions.map((d) => (
                    <li key={d.id}>
                      <Link href={d.href} className="card block text-sm text-slate-700 hover:border-teal-300">
                        {d.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        <p className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {view.ai_summary_placeholder}
        </p>
        <AICommunicationAssistant
          prompts={["Summarize my priority conversations.", "What decisions need me?", "Draft a message for my review."]}
        />
      </div>

      <aside className="space-y-4">
        <DailyBriefCard href={view.todays_brief_href} />
        <CollaborationSidebar
          mentions={view.mentions}
          actionItems={view.action_items}
          meetings={view.upcoming_meetings}
          missionUpdates={view.mission_updates}
          roleFocus={view.role_focus}
        />
      </aside>
    </div>
  );
}
