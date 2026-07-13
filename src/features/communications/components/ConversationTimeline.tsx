import type { TimelineEntryView } from "@/lib/civic-action/builds/11.7/ux";

export function ConversationTimeline({ entries }: { entries: TimelineEntryView[] }) {
  return (
    <section aria-label="Conversation timeline">
      <h2 className="text-lg font-bold text-slate-900">Timeline</h2>
      <ol className="mt-3 space-y-4 border-l-2 border-teal-200 pl-4">
        {entries.length === 0 ? (
          <li className="text-sm text-slate-500">No messages yet. Post the first message to open this conversation.</li>
        ) : (
          entries.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[1.35rem] top-1 h-2 w-2 rounded-full bg-teal-500" aria-hidden />
              <p className="text-xs font-medium text-teal-800">
                {e.author_label} · <time dateTime={e.when}>{e.when}</time>
              </p>
              <p className="mt-1 text-sm text-slate-700">{e.body}</p>
            </li>
          ))
        )}
      </ol>
    </section>
  );
}
