import { notFound } from "next/navigation";
import {
  assembleInitiativeOverview,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.1/ux";
import { InitiativeLifecycleActions } from "@/features/initiatives/components/InitiativeLifecycleActions";

export default async function InitiativeOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const overview = assembleInitiativeOverview(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
  if (!overview) notFound();

  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-bold text-slate-900">What needs attention now?</h2>
        <ul className="mt-3 space-y-2">
          {overview.attention.map((item) => (
            <li
              key={item.id}
              className={`rounded px-3 py-2 text-sm ${
                item.tone === "warning" ? "bg-amber-50 text-amber-950" : item.tone === "action" ? "bg-orange-50 text-orange-950" : "bg-slate-50 text-slate-800"
              }`}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="font-bold text-slate-900">Purpose</h2>
          <p className="mt-2 text-slate-600">{overview.purpose_summary}</p>
        </section>
        <section className="card">
          <h2 className="font-bold text-slate-900">Initiative State</h2>
          <p className="mt-2 text-slate-600">{overview.state_summary}</p>
          {overview.last_lifecycle_change && (
            <p className="mt-2 text-xs text-slate-500">Last change: {overview.last_lifecycle_change}</p>
          )}
        </section>
      </div>

      <section className="card">
        <h2 className="font-bold text-slate-900">Ownership</h2>
        <p className="mt-2 text-slate-600">{overview.ownership_summary}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {overview.integration_cards.map((card) => (
          <div key={card.key} className="card border-dashed">
            <h3 className="font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{card.body}</p>
            {"action_href" in card && card.action_href && (
              <a href={card.action_href as string} className="mt-2 inline-block text-sm font-semibold text-orange-800 underline">
                {"action_label" in card ? (card.action_label as string) : "Open →"}
              </a>
            )}
          </div>
        ))}
      </div>

      <section className="card">
        <h2 className="font-bold text-slate-900">Activity</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {overview.activity_feed.length === 0 ? (
            <li>No activity recorded yet.</li>
          ) : (
            overview.activity_feed.map((e) => (
              <li key={e.id}>
                <span className="text-slate-500">{new Date(e.when).toLocaleDateString()}</span> — {e.text}
              </li>
            ))
          )}
        </ul>
      </section>

      <InitiativeLifecycleActions actions={overview.lifecycle_actions} />
    </div>
  );
}
